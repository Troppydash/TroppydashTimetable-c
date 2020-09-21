import Vue from 'vue'
import Vuex from 'vuex'
import { Store, Action } from 'vuex';
import api from '../service/api';

import firebase from 'firebase/app';

import router from "@/router";
import axios from 'axios';
import moment from "moment";
import {
    DISPLAY_PREVIOUS_DAYS,
    TIMETABLE,
    TIMETRAVEL_TIMETABLES,
    TT_TIMETABLE,
    USER_PREFERENCES,
} from "@/StorageKeys";
import { GetFromLocalStorageOrDefault, GetFromLocalStorageOrNull, SetLocalStorage } from "@/Helpers";
import { getDisplayNearbyWeeks } from "@/StorageKeysGetters";


Vue.use( Vuex )

const OFFLINE_USERNAME = 'offline';

interface NetworkCall {
    functionName: string;
    args: any[];
}

export default new Vuex.Store( {
    state: {
        username: '',
        authenticated: false,
        error: '',
        loading: false,

        messages: Array<{
            info: string;
            text: string;
            from: string;
        }>(),

        isVerified: false,
        isOffline: false,

        timetable: {
            loading: false,
            data: [],
            error: ''
        },

        networkCalls: Array<NetworkCall>(),
        isCallingCalls: false,
    },
    getters: {
        lastMessage( state ) {
            return state.messages[state.messages.length - 1];
        },
        timetable( state, getters ) {
            if ( getDisplayNearbyWeeks() ) {
                return state.timetable.data;
            } else {
                const today = getters.unbiasedToday;
                return state.timetable.data.filter( ( day: any, index ) => {
                    return today === index
                        || moment( day.Date, 'DD/MM/YYYY hh:mm:ss' ).isAfter( router.currentRoute.query.date
                            ? moment( router.currentRoute.query.date as string, 'DD-MM-YYYY' )
                            : moment() );
                } );
            }

        },
        today( state, getters ) {
            let REFERENCE = moment();
            let TODAY = REFERENCE.clone().startOf( 'day' );

            if ( router.currentRoute.query.date ) {
                const date: string = router.currentRoute.query.date as string;
                REFERENCE = moment( date, 'DD-MM-YYYY' );
                TODAY = REFERENCE.clone().startOf( 'day' );
            }

            return getters.timetable.findIndex( ( day: any ) => {
                return moment( day.Date, 'DD/MM/YYYY ss/mm/hh' ).isSame( TODAY );
            } )
        },
        unbiasedToday( state ) {
            let REFERENCE = moment();
            let TODAY = REFERENCE.clone().startOf( 'day' );

            if ( router.currentRoute.query.date ) {
                const date: string = router.currentRoute.query.date as string;
                REFERENCE = moment( date, 'DD-MM-YYYY' );
                TODAY = REFERENCE.clone().startOf( 'day' );
            }

            return state.timetable.data.findIndex( ( day: any ) => {
                return moment( day.Date, 'DD/MM/YYYY ss/mm/hh' ).isSame( TODAY );
            } )
        },
        currentLesson( state, getters ) {
            const todayIndex = getters.today;
            const today: any = state.timetable.data[todayIndex];
            if ( !today ) {
                return "";
            }
            const period = today.periodData.findIndex( ( period: any ) => {
                return moment( Date.now() ).isBetween( moment( period.FromTime, 'h.mm' ), moment( period.ToTime, 'h.mm' ) );
            } )
            return "" + todayIndex + (period + 1);
        }
    },
    mutations: {
        setOffline( state, status ) {
            state.isOffline = status;
        },
        addMessages( state, { message } ) {
            state.messages.push( message );
        },
        clearMessages( state ) {
            state.messages = [];
        },
        setUsername( state, payload ) {
            state.username = payload.username;
        },
        setUser( state, payload ) {
            state.username = payload.username;
            state.authenticated = true;
            state.error = '';
            if ( payload.isVerified ) {
                state.isVerified = payload.isVerified;
            } else {
                if ( firebase.auth().currentUser?.providerData[0]?.providerId === 'microsoft.com'
                    || firebase.auth().currentUser?.providerData[0]?.providerId === 'google.com' ) {
                    state.isVerified = true;
                } else {
                    state.isVerified = firebase.auth().currentUser?.emailVerified || false;
                }
            }
        },
        setLoading( state, { isLoading } ) {
            state.loading = isLoading;
        },
        setTimetableLoading( state, { isLoading } ) {
            state.timetable.loading = isLoading;
        },
        signoutUser( state ) {
            state.username = '';
            state.authenticated = false;
            state.timetable = {
                loading: false,
                data: [],
                error: ''
            };
            state.isVerified = false;
            state.networkCalls = [];
        },
        setUserError( state, payload ) {
            state.error = payload.error;
            state.authenticated = false;
            router.replace( '/login' );
        },

        addNetworkCall(state, payload: NetworkCall) {
            state.networkCalls = [...state.networkCalls, payload];
        },

        clearNetworkCall(state) {
            state.networkCalls = [];
        }
    },
    actions: {
        setStatus( context, isOffline ) {
            // was offline and now it isn't
            const oldWasOffline = context.state.isOffline;
            context.commit( 'setOffline', isOffline );

            if ( oldWasOffline && !isOffline ) {
                context.dispatch( 'callNetworkCalls' );
            }
        },

        callNetworkCalls( context ) {
            if ( context.state.isOffline ) {
                return;
            }
            context.state.isCallingCalls = true;

            const promises = [];
            for ( const call of context.state.networkCalls ) {
                console.log(call);
                promises.push( context.dispatch( call.functionName, ...call.args ) );
            }

            Promise.all( promises )
                .then( values => {
                    console.log( values );
                } )
                .catch( err => {
                    console.log( err );
                } )
                .finally(() => {
                    context.commit('clearNetworkCall');
                    context.state.isCallingCalls = false;
                })
        },

        protectNetworkCalls( context, payload: NetworkCall ) {
            if (context.state.isCallingCalls) {
                return;
            }
            setTimeout(() => {
                if (context.state.isOffline) {
                    context.commit('addNetworkCall', payload);
                }
            }, 200);
        },

        // Called: Settings
        verifyEmail( context ) {
            const actionCodeSettings = {
                handleCodeInApp: true,
                url: window.location.href || 'http://stimetable.now.sh/home'
            }
            firebase.auth().currentUser?.sendEmailVerification( actionCodeSettings )
                .then( () => {
                    context.commit( 'addMessages', {
                        message: { type: 'info', text: 'Successfully sent email', from: 'verifyEmail' }
                    } );
                } )
                .catch( err => {
                    console.error( err );
                    context.commit( 'addMessages', {
                        message: { type: 'info', text: 'Unable to send email', from: 'verifyEmail' }
                    } );
                } )
        },
        // Called: Register, Login
        handleUserSocialLogin( context, { type } ) {
            let provider = new firebase.auth.GoogleAuthProvider();

            if ( type === 'ms' ) {
                provider = new firebase.auth.OAuthProvider( 'microsoft.com' );
            } else if ( type === 'google' ) {
                let _ = 'fuckyoutypescript';
                _ = 'fuckyoutypescript';
            }

            context.commit( 'setLoading', { isLoading: true } );
            return firebase.auth().signInWithPopup( provider )
                .then( () => {
                    // Get jwt token from current user
                    return firebase.auth().currentUser?.getIdToken();
                } )
                .then( token => {
                    return api.post( '/createsocialuser', null, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    } )
                } )
                .then( res => {
                    context.commit( 'setUser', { username: res.data.username } );
                    return { error: '' }
                } )
                .catch( err => {
                    context.dispatch( 'handleLogoutUser' );
                    return { error: err.message };
                } )
                .finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        // Called: Register
        handleRegisterUser( context, payload ) {
            let createUserSuccess = false;
            context.commit( 'setLoading', { isLoading: true } );
            // Create a user
            return firebase.auth().createUserWithEmailAndPassword( payload.email, payload.password )
                .then( () => {
                    // Get jwt token from current user
                    return firebase.auth().currentUser?.getIdToken();
                } )
                .then( token => {
                    createUserSuccess = true;
                    return api.post( '/createuser', null, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    } );
                } )
                .then( res => {
                    context.commit( 'setUser', { username: res.data.username } );
                    return { error: '' };
                } )
                .catch( err => {
                    // If firebase register doesn't fail but api endpoint did
                    if ( createUserSuccess ) {
                        firebase.auth().currentUser?.delete();
                    }
                    context.dispatch( 'handleLogoutUser' );
                    return { error: err.message };
                } )
                .finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        // Called: Login
        handleLoginUser( context, payload ) {
            context.dispatch('protectNetworkCalls', {
                functionName: 'handleLoginUser',
                args: [
                    payload
                ]
            });

            context.commit( 'setLoading', { isLoading: true } );
            return firebase.auth().signInWithEmailAndPassword( payload.email, payload.password )
                .then( () => {
                    return firebase.auth().currentUser?.getIdToken();
                } )
                .then( tok => {
                    return api.post( '/loginuser', null, {
                        headers: {
                            Authorization: `Bearer ${tok}`
                        }
                    } );
                } )
                .then( res => {
                    context.commit( 'setUser', { username: res.data.username } );
                    return { error: '' };
                } )
                .catch( err => {
                    if ( context.state.isOffline ) {
                        context.commit( 'setUser', { username: OFFLINE_USERNAME } )
                        return { error: '' }
                    }
                    return { error: err.message };
                } )
                .finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        // Called: UserActions
        handleLogoutUser( context ) {
            return firebase.auth().signOut()
                .then( () => {
                    // Clear only timetable/user caching
                    localStorage.removeItem( TIMETABLE );
                    localStorage.removeItem( TIMETRAVEL_TIMETABLES );
                    context.commit( 'clearMessages' );
                    context.commit( 'signoutUser' );
                } );
        },
        // Called: UserActions
        handleDeleteUser( context ) {
            return firebase.auth().currentUser?.getIdToken()
                .then( token => {
                    return api.delete( '/deleteuser', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    } )
                } )
                .then( () => {
                    return context.dispatch( 'handleLogoutUser' );
                } )
                .catch( err => {
                    context.commit( 'setUserError', {
                        error: err.message
                    } )
                } )
        },
        // Called: TimeTable, Settings
        handleGetUser( context ) {
            context.dispatch('protectNetworkCalls', {
                functionName: 'handleGetUser',
                args: []
            });

            context.commit( 'setLoading', { isLoading: true } );
            const user = {
                username: ''
            };
            return firebase.auth().currentUser?.getIdToken()
                .then( tok => {
                    return api.post( '/loginuser', null, {
                        headers: {
                            Authorization: `Bearer ${tok}`
                        }
                    } );
                } )
                .then( res => {
                    user.username = res.data.username;
                    context.commit( 'setUser', {
                        ...user
                    } );
                    return { error: '' }
                } )
                .catch( err => {
                    if ( context.state.isOffline ) {
                        user.username = OFFLINE_USERNAME;
                        context.commit( 'setUser', {
                            ...user
                        } );
                        return { error: '' }
                    }
                    return { error: err.message }
                } ).finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        // Called: DisplayDatePicker, TimeTable
        handleGetTimetable( context, { force = false, date = null } ) {
            context.dispatch('protectNetworkCalls', {
                functionName: 'handleGetTimetable',
                args: [{ force, date }]
            });
            if ( !force && context.state.timetable.data.length > 0 ) {
                context.commit( 'addMessages', {
                    message: { type: 'info', text: 'data already exists', from: 'handleGetTimetable' }
                } );
                return;
            }

            if ( !context.state.isVerified && !context.state.isOffline ) {
                context.commit( 'addMessages', {
                    message: { type: 'error', text: 'email not verified', from: 'handleGetTimetable' }
                } );
                return;
            }

            context.commit( 'setTimetableLoading', { isLoading: true } );
            if ( date === null || !force ) {
                if ( localStorage.getItem( TIMETABLE ) ) {
                    context.state.timetable.error = '';
                    context.state.timetable.data = JSON.parse( localStorage.getItem( TIMETABLE )! );
                    context.commit( 'addMessages', {
                        message: { type: 'info', text: 'received cache item', from: 'handleGetTimetable' }
                    } );
                    context.commit( 'setTimetableLoading', { isLoading: false } );
                }

                return firebase.auth().currentUser?.getIdToken()
                    .then( token => {
                        return axios.get( `https://frozen-hamlet-21795.herokuapp.com/timetable`, {
                            headers: { Authorization: `Bearer ${token}` }
                        } )
                    } )
                    .then( res => {
                        context.state.timetable.error = '';
                        context.state.timetable.data = JSON.parse( res.data.data );
                        localStorage.setItem( TIMETABLE, res.data.data );
                        context.commit( 'addMessages', {
                            message: { type: 'info', text: 'received network item', from: 'handleGetTimetable' }
                        } );
                        return;
                    } )
                    .catch( err => {
                        context.state.timetable.error = err.response.data.message;
                        context.commit( 'addMessages', {
                            message: { type: 'error', text: err.response.data.message, from: 'handleGetTimetable' }
                        } );
                        return;
                    } )
                    .finally( () => {
                        context.commit( 'setTimetableLoading', { isLoading: false } );
                    } )
            } else {
                const cacheKey = TT_TIMETABLE + date;
                const cachedData = GetFromLocalStorageOrNull(
                    cacheKey, TIMETRAVEL_TIMETABLES, value => JSON.parse( value ) );
                if ( cachedData !== null && !force ) {
                    context.commit( 'setTimetableLoading', { isLoading: false } );
                    context.state.timetable.error = '';
                    context.state.timetable.data = cachedData;
                    context.commit( 'addMessages', {
                        message: { type: 'info', text: 'received cache timetravel item', from: 'handleGetTimetable' }
                    } );
                }

                const formattedDate = date ? date.split( '-' ).join( '/' ) : '';
                return firebase.auth().currentUser?.getIdToken()
                    .then( token => {
                        return axios.get( `https://frozen-hamlet-21795.herokuapp.com/timetable?date=${formattedDate}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        } )
                    } )
                    .then( res => {
                        context.state.timetable.error = '';
                        context.state.timetable.data = JSON.parse( res.data.data );
                        SetLocalStorage( cacheKey, res.data.data, TIMETRAVEL_TIMETABLES );
                        context.commit( 'addMessages', {
                            message: {
                                type: 'info',
                                text: 'received network timetravel item',
                                from: 'handleGetTimetable'
                            }
                        } );
                        return;
                    } )
                    .catch( err => {
                        context.state.timetable.error = err.response.data.message;
                        context.commit( 'addMessages', {
                            message: { type: 'error', text: err.response.data.message, from: 'handleGetTimetable' }
                        } );
                        return;
                    } )
                    .finally( () => {
                        context.commit( 'setTimetableLoading', { isLoading: false } );
                    } )

            }

        },
        handleEditUser( context, { username, keyCode } ) {
            if ( username === '' ) {
                return { error: 'username must not be empty' }
            }
            return firebase.auth().currentUser?.getIdToken()
                .then( token => {
                    return api.put( '/edituser', { username, keyCode }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    } )
                } )
                .then( () => {
                    context.commit( 'setUsername', { username } );
                    context.dispatch( 'handleGetTimetable', { force: true } );
                    return { error: '' }
                } )
                .catch( err => {
                    return { error: err.message };
                } );
        }
    },
    modules: {},
} )


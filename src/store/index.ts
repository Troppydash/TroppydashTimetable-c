import Vue from 'vue'
import Vuex from 'vuex'
import api from '../service/api';

import firebase from 'firebase/app';

import router from "@/router";
import axios from 'axios';
import moment from "moment";
import { SHADOWS_ON, TIMETABLE } from "@/StorageKeys";

Vue.use( Vuex )

export default new Vuex.Store( {
    state: {
        token: '',
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

        timetable: {
            loading: false,
            data: [],
            error: ''
        }
    },
    getters: {
        lastMessage( state ) {
            return state.messages[state.messages.length - 1];
        },
        today( state ) {
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
            state.token = payload.token;
            state.username = payload.username;
            state.authenticated = true;
            state.error = '';

            if ( firebase.auth().currentUser?.providerData[0]?.providerId === 'microsoft.com'
                || firebase.auth().currentUser?.providerData[0]?.providerId === 'google.com' ) {
                state.isVerified = true;
            } else {
                state.isVerified = firebase.auth().currentUser?.emailVerified || false;
            }
        },
        setLoading( state, { isLoading } ) {
            state.loading = isLoading;
        },
        setTimetableLoading( state, { isLoading } ) {
            state.timetable.loading = isLoading;
        },
        signoutUser( state ) {
            state.token = '';
            state.username = '';
            state.authenticated = false;
            state.timetable = {
                loading: false,
                data: [],
                error: ''
            };
            state.isVerified = false;
        },
        setUserError( state, payload ) {
            state.error = payload.error;
            state.authenticated = false;
            router.replace( '/login' );
        },
    },
    actions: {
        // Called: Settings
        verifyEmail( context ) {
            const actionCodeSettings = {
                handleCodeInApp: true,
                url: 'http://stimetable.now.sh/home'
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

            let token: string;
            context.commit( 'setLoading', { isLoading: true } );
            return firebase.auth().signInWithPopup( provider )
                .then( () => {
                    // Get jwt token from current user
                    return firebase.auth().currentUser?.getIdToken();
                } )
                .then( tok => {
                    token = tok || '';
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    return api.post( '/createsocialuser' )
                } )
                .then( res => {
                    context.commit( 'setUser', { token, username: res.data.username } );
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
            let token: string;
            let createUserSuccess = false;
            context.commit( 'setLoading', { isLoading: true } );
            // Create a user
            return firebase.auth().createUserWithEmailAndPassword( payload.email, payload.password )
                .then( () => {
                    // Get jwt token from current user
                    return firebase.auth().currentUser?.getIdToken();
                } )
                .then( tok => {
                    createUserSuccess = true;
                    token = tok || '';
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    return api.post( '/createuser' );
                } )
                .then( res => {
                    context.commit( 'setUser', { token, username: res.data.username } );
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
            context.commit( 'setLoading', { isLoading: true } );
            let token: string;
            return firebase.auth().signInWithEmailAndPassword( payload.email, payload.password )
                .then( () => {
                    return firebase.auth().currentUser?.getIdToken();
                } )
                .then( tok => {
                    token = tok || '';
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    return api.post( '/loginuser' );
                } )
                .then( res => {
                    context.commit( 'setUser', { token, username: res.data.username } );
                    return { error: '' };
                } )
                .catch( err => {
                    context.dispatch( 'handleLogoutUser' );
                    return { error: err.message };
                } )
                .finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        // Called: Settings
        handleLogoutUser( context ) {
            return firebase.auth().signOut()
                .then( () => {
                    // Clear only timetable caching
                    localStorage.removeItem( TIMETABLE );
                    context.commit( 'clearMessages' );
                    context.commit( 'signoutUser' );
                } );
        },
        // Called: Settings
        handleDeleteUser( context ) {
            return api.delete( '/deleteuser' )
                .then( () => {
                    return context.dispatch( 'handleLogoutUser' );
                } )
                .catch( err => {
                    context.commit( 'setUserError', {
                        error: err.message
                    } )
                } )
        },
        // Called: TimeTable
        handleGetUser( context ) {
            context.commit( 'setLoading', { isLoading: true } );

            const user = {
                token: '',
                username: ''
            };
            return firebase.auth().currentUser?.getIdToken()
                .then( tok => {
                    user.token = tok;
                    api.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
                    return api.post( '/loginuser' );
                } )
                .then( res => {
                    user.username = res.data.username;
                    context.commit( 'setUser', {
                        ...user
                    } );
                    return { error: '' }
                } )
                .catch( err => {
                    context.dispatch( 'handleLogoutUser' );
                    context.commit( 'setUserError', {
                        error: err.message
                    } )
                    return { error: err.message }
                } ).finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        // Called: DisplayDatePicker, TimeTable
        handleGetTimetable( context, { force = false, date } ) {
            if ( !force && context.state.timetable.data.length !== 0 ) {
                context.commit( 'addMessages', {
                    message: { type: 'info', text: 'data already exists', from: 'handleGetTimetable' }
                } );
                return;
            }

            if ( !context.state.isVerified ) {
                context.commit( 'addMessages', {
                    message: { type: 'error', text: 'email not verified', from: 'handleGetTimetable' }
                } );
                return;
            }

            if ( !force && localStorage.getItem( TIMETABLE ) ) {
                context.state.timetable.error = '';
                context.state.timetable.data = JSON.parse( localStorage.getItem( TIMETABLE )! );
                context.commit( 'addMessages', {
                    message: { type: 'info', text: 'received cache item', from: 'handleGetTimetable' }
                } );
            } else {
                context.commit( 'setTimetableLoading', { isLoading: true } );
            }

            const formtDate = date ? date.split( '-' ).join( '/' ) : '';
            return axios.get( `https://frozen-hamlet-21795.herokuapp.com/timetable?date=${formtDate}`, {
                headers: { 'Authorization': `Bearer ${context.state.token}` }
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
                    console.log( err );
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
    modules: {}
} )

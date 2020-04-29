import Vue from 'vue'
import Vuex from 'vuex'
import api from '../service/api';
import * as firebase from "firebase";
import router from "@/router";
import axios from 'axios';

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
        }
    },
    mutations: {
        addMessages( state, { message } ) {
            state.messages.push( message );
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
        verifyEmail( context ) {
            const actionCodeSettings = {
                handleCodeInApp: true,
                url: 'http://stimetable.now.sh/home'
            }
            firebase.auth().currentUser?.sendEmailVerification( actionCodeSettings )
                .then( () => {
                    context.commit('addMessages', { message: 'Successfully sent email'})
                } )
                .catch( err => {
                    console.error(err);
                    context.commit( 'addMessages', { message: 'Unable to send email' } );
                } )
        },
        handleUserSocialLogin( context, { type } ) {
            let provider = new firebase.auth.GoogleAuthProvider();

            if ( type === 'ms' ) {
                provider = new firebase.auth.OAuthProvider( 'microsoft.com' );
            } else if ( type === 'google' ) {
                let _ = 'fuckyoutypescript';
                _ = '1';
            }

            let token: string;
            context.commit( 'setLoading', { isLoading: true } );
            return firebase.auth().signInWithPopup( provider )
                .then( () => {
                    // Get jwt token from current user
                    return firebase.auth().currentUser?.getIdToken( true );
                } )
                .then( tok => {
                    token = tok || '';
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    return api.post( '/createsocialuser' )
                } )
                .then( res => {
                    context.commit( 'setUser', { token, username: res.data.username } );
                    context.dispatch( 'handleGetTimetable', { force: false } );
                    return { error: '' }
                } )
                .catch( err => {
                    firebase.auth().signOut();
                    return { error: err.message };
                } )
                .finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        handleRegisterUser( context, payload ) {
            let token: string;
            context.commit( 'setLoading', { isLoading: true } );
            // Create a user
            return firebase.auth().createUserWithEmailAndPassword( payload.email, payload.password )
                .then( () => {
                    // Get jwt token from current user
                    return firebase.auth().currentUser?.getIdToken( true );
                } )
                .then( tok => {
                    token = tok || '';
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    return api.post( '/createuser' );
                } )
                .then( res => {
                    context.commit( 'setUser', { token, username: res.data.username } );
                    context.dispatch( 'handleGetTimetable', { force: false } );
                    return { error: '' };
                } )
                .catch( err => {
                    context.commit( 'setLoading', { isLoading: false } );
                    return { error: err.message };
                } )
                .finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        handleLoginUser( context, payload ) {
            context.commit( 'setLoading', { isLoading: true } );
            let token: string;
            return firebase.auth().signInWithEmailAndPassword( payload.email, payload.password )
                .then( () => {
                    return firebase.auth().currentUser?.getIdToken( true );
                } )
                .then( tok => {
                    token = tok || '';
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    return api.post( '/loginuser' );
                } )
                .then( res => {
                    context.commit( 'setUser', { token, username: res.data.username } );
                    context.dispatch( 'handleGetTimetable', { force: false } );
                    return { error: '' };
                } )
                .catch( err => {
                    firebase.auth().signOut();
                    return { error: err.message };
                } )
                .finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        handleLogoutUser( context ) {
            return firebase.auth().signOut()
                .then( () => {
                    localStorage.removeItem( 'TIMETABLE' );
                    context.commit( 'signoutUser' );
                } );
        },
        handleDeleteUser( context ) {
            return firebase.auth().signOut()
                .then( () => {
                    return api.delete( '/deleteuser' )
                } )
                .then( () => {
                    localStorage.removeItem( 'TIMETABLE' );
                    context.commit( 'signoutUser' );
                } )
                .catch( err => {
                    context.commit( 'setUserError', {
                        error: err.message
                    } )
                } )
        },
        handleGetUser( context ) {
            context.commit( 'setLoading', { isLoading: true } );

            const user = {
                token: '',
                username: ''
            };
            return firebase.auth().currentUser?.getIdToken( true )
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
                    context.dispatch( 'handleGetTimetable', { force: false } );
                    return { error: '' }
                } )
                .catch( err => {
                    context.commit( 'setUserError', {
                        error: err.message
                    } )
                    return { error: err.message }
                } ).finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        handleGetTimetable( context, { force = false } ) {
            if ( !force && context.state.timetable.data.length !== 0 ) {
                context.commit( 'addMessages', {
                    message: { type: 'info', text: 'data already exists' }
                } );
                return;
            }

            if ( !context.state.isVerified ) {
                context.commit( 'addMessages', {
                    message: { type: 'info', text: 'email not verified' }
                } );
                return;
            }

            context.commit( 'setTimetableLoading', { isLoading: true } );

            if ( localStorage.getItem( "TIMETABLE" ) ) {
                context.commit( 'setTimetableLoading', { isLoading: false } );

                context.state.timetable.error = '';
                context.state.timetable.data = JSON.parse( localStorage.getItem( "TIMETABLE" )! );
                context.commit( 'addMessages', {
                    message: { type: 'info', text: 'received cache item' }
                } );
            }


            return axios.post( 'https://frozen-hamlet-21795.herokuapp.com/timetable', {}, {
                headers: { 'Authorization': `Bearer ${context.state.token}` }
            } )
                .then( res => {
                    context.state.timetable.error = '';
                    context.state.timetable.data = JSON.parse( res.data.data );
                    localStorage.setItem( "TIMETABLE", res.data.data );
                    context.commit( 'addMessages', {
                        message: { type: 'info', text: 'received network item' }
                    } );
                    return;
                } )
                .catch( err => {
                    console.log( err );
                    context.state.timetable.error = err.response.data.message;
                    context.commit( 'addMessages', {
                        message: { type: 'error', text: err.response.data.message }
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

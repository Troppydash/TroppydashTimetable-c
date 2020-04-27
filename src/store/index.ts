import Vue from 'vue'
import Vuex from 'vuex'
import api from '../service/api';
import firebase from "firebase";
import router from "@/router";

Vue.use( Vuex )

export default new Vuex.Store( {
    state: {
        token: '',
        username: '',
        authenticated: false,
        error: '',
        loading: false,

        timetable: {
            loading: false,
            data: [],
            error: ''
        }
    },
    mutations: {
        setUsername( state, payload ) {
            state.username = payload.username;
        },
        setUser( state, payload ) {
            state.token = payload.token;
            state.username = payload.username;
            state.authenticated = true;
            state.error = '';
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
        },
        setUserError( state, payload ) {
            state.error = payload.error;
            state.authenticated = false;
            router.replace( '/login' );
        },
    },
    actions: {
        handleUserSocialLogin( context ) {
            const provider = new firebase.auth.GoogleAuthProvider();

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
                    return context.dispatch( 'handleGetTimetable', { force: false } );
                } )
                .then( () => {
                    return { error: '' }
                } )
                .catch( err => {
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
                    return context.dispatch( 'handleGetTimetable', { force: false } );
                } )
                .then( () => {
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
                    return context.dispatch( 'handleGetTimetable', { force: false } );
                } )
                .then( () => {
                    return { error: '' };
                } )
                .catch( err => {
                    return { error: err.message };
                } )
                .finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        handleLogoutUser( context ) {
            return firebase.auth().signOut()
                .then( () => {
                    if ( localStorage.getItem( "TIMETABLE" ) ) {
                        localStorage.setItem( "TIMETABLE", '' );
                    }
                    context.commit( 'signoutUser' );
                } );
        },
        handleDeleteUser( context ) {
            return firebase.auth().signOut()
                .then( () => {
                    return api.delete( '/deleteuser' )
                } )
                .then( res => {
                    if ( localStorage.getItem( "TIMETABLE" ) ) {
                        localStorage.setItem( "TIMETABLE", '' );
                    }
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
                    return context.dispatch( 'handleGetTimetable', { force: false } );
                } )
                .catch( err => {
                    context.commit( 'setUserError', {
                        error: err.message
                    } )
                } ).finally( () => {
                    context.commit( 'setLoading', { isLoading: false } );
                } );
        },
        handleGetTimetable( context, { force = false } ) {
            if ( !force && context.state.timetable.data.length !== 0 ) {
                return { error: '' };
            }
            context.commit( 'setTimetableLoading', { isLoading: true } );

            // TODO: Change for production
            // Check localstorage && dev only
            if ( localStorage.getItem( "TIMETABLE" ) ) {
                context.commit( 'setTimetableLoading', { isLoading: false } );

                context.state.timetable.error = '';
                context.state.timetable.data = JSON.parse( localStorage.getItem( "TIMETABLE" )! );
                // return { error: '' };
            }

            return api.post( '/timetable' )
                .then( res => {
                    context.state.timetable.error = '';
                    context.state.timetable.data = JSON.parse( res.data.data );
                    localStorage.setItem( "TIMETABLE", res.data.data );
                    return { error: '' }
                } )
                .catch( err => {
                    context.state.timetable.error = err.response.data.message;
                    return { error: err.response.data.message };
                } )
                .finally( () => {
                    context.commit( 'setTimetableLoading', { isLoading: false } );
                } )
        }
    },
    modules: {}
} )

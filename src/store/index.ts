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
        error: ''
    },
    mutations: {
        setUsername(state, payload) {
            state.username = payload.username;
        },
        setUser( state, payload ) {
            state.token = payload.token;
            state.username = payload.username;
            state.authenticated = true;
            state.error = '';
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
                    return { error: '' }
                } )
                .catch( err => {
                    return { error: err.message };
                } );
        },
        handleRegisterUser( context, payload ) {
            let token: string;
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
                    return { error: '' };
                } )
                .catch( err => {
                    return { error: err.message };
                } );
        },
        handleLoginUser( context, payload ) {
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
                    return { error: '' };
                } )
                .catch( err => {
                    return { error: err.message };
                } );
        },
        handleLogoutUser( context ) {
            return firebase.auth().signOut()
                .then( () => {
                    context.commit( 'signoutUser' );
                } );
        },
        handleDeleteUser( context ) {
            return firebase.auth().signOut()
                .then( () => {
                    return api.delete( '/deleteuser' )
                } )
                .then( res => {
                    context.commit( 'signoutUser' );
                } )
                .catch( err => {
                    context.commit( 'setUserError', {
                        error: err.message
                    } )
                } )
        },
        handleGetUser( context ) {
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
                } )
                .catch( err => {
                    context.commit( 'setUserError', {
                        error: err.message
                    } )
                } )
        }
    },
    modules: {}
} )

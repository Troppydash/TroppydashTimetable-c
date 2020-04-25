import Vue from 'vue'
import Vuex from 'vuex'

Vue.use( Vuex )

export default new Vuex.Store( {
    state: {
        token: '',
        username: ''
    },
    mutations: {
        setUser( state, payload ) {
            state.token = payload.token;
            state.username = payload.username;
        },
        signoutUser( state ) {
            state.token = '';
            state.username = '';
        }
    },
    actions: {},
    modules: {}
} )

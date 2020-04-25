import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import * as firebase from 'firebase';

Vue.use( VueRouter )

const routes: Array<RouteConfig> = [
    {
        path: '*',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        alias: '/home',
        meta: {
            requireAuth: true
        }
    },

]

const router = new VueRouter( {
    mode: 'history',
    base: process.env.BASE_URL,
    routes
} )

router.beforeEach( ( to, from, next ) => {
    const currentUser = firebase.auth().currentUser;
    const requireAuth = to.matched.some( record => record.meta.requireAuth );

    if ( requireAuth && !currentUser )
        next( 'login' );
    else if ( !requireAuth && currentUser )
        next( 'home' );
    else
        next();
} )

export default router

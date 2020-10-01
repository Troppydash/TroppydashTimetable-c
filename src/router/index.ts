import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Main from '../views/Main.vue'
import store from '../store';

import firebase from 'firebase/app';

Vue.use( VueRouter )

const routes: Array<RouteConfig> = [
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        name: 'Main',
        component: Main
    },
    {
        path: '/login',
        name: 'Login',
        component:  () => import( /* webpackChunkName: "login" */ '@/views/Login.vue' )
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import( /* webpackChunkName: "register" */ '@/views/Register.vue' )
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import( /* webpackChunkName: "home" */ '@/views/Home.vue' ),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import( /* webpackChunkName: "settings" */ '@/views/Settings.vue' ),
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

    if ( requireAuth && !currentUser && !store.state.authenticated )
        next( 'login' );
    else if ( !requireAuth && currentUser && store.state.authenticated )
        next( 'home' );
    else
        next();
} )

export default router

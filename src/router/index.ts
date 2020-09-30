import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Settings from '../views/Settings.vue'
import Register from '../views/Register.vue'
import Main from '../views/Main.vue'
import store from '../store';

import firebase from 'firebase/app';

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
        component: () => import( /* webpackChunkName: "register" */ '@/views/Register.vue' )
    },
    {
        path: '/',
        name: 'Main',
        component: Main
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
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

import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import * as firebase from 'firebase';

import "../node_modules/normalize.css/normalize.css";
Vue.config.productionTip = false

// TODO: Secure this
const config = {
    apiKey: "AIzaSyB2Yw4uRW0PC8lINGqP6O42K9hfAtyQ1zg",
    authDomain: "time-table-8c06b.firebaseapp.com",
    databaseURL: "https://time-table-8c06b.firebaseio.com",
    projectId: "time-table-8c06b",
    storageBucket: "time-table-8c06b.appspot.com",
    messagingSenderId: "442977137138",
    appId: "1:442977137138:web:6e2e40a82756d9620cfb6b",
    measurementId: "G-S7XGS6YHLP"
};
firebase.initializeApp( config );

let app: Vue;

let tried = false;
firebase.auth().onAuthStateChanged( user => {
    if (user && !store.state.authenticated && !tried) {
        store.dispatch('handleGetUser');
        tried = true;
    }

    if (!user) {
        tried = false;
    }

    if ( !app ) {
        app = new Vue( {
            router,
            store,
            render: h => h( App )
        } ).$mount( '#app' )
    }
} )


import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import * as firebase from 'firebase/app';
import 'firebase/auth';

import VueOffline from 'vue-offline';

import "../node_modules/normalize.css/normalize.css";
import { generateLoadingMessage } from "@/service/loadingMessage";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCompress, faExpand, faTimes, faMinus, faPlus, faAngleLeft, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCompress, faExpand, faTimes, faMinus, faPlus, faAngleLeft, faAngleUp, faAngleDown)

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

Vue.mixin({
    computed: {
        randomLoadingMessage() {
            return generateLoadingMessage().message;
        }
    }
})

Vue.component('fa-icon', FontAwesomeIcon)

firebase.auth().onAuthStateChanged( user => {
    if ( !app ) {
        app = new Vue( {
            router,
            store,
            render: h => h( App )
        } ).$mount( '#app' );
        // TODO: Move this
        Vue.use(VueOffline, {
            mixin: false,
            storage: false
        });
    }
} )


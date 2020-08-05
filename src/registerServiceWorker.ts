/* eslint-disable no-console */

import { register } from 'register-service-worker'

export const swUpdated = 'swUpdated';

// if ( process.env.NODE_ENV === 'production' ) {
    register( `${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log(
                'App is being served from cache by a service worker.'
            )
        },
        updated( registration: ServiceWorkerRegistration ) {
            console.log( 'New content is available; please refresh.' );
            document.dispatchEvent(
                new CustomEvent( swUpdated, { detail: registration } )
            );
        },
        registered() {
            //
        },
        cached() {
            //
        },
        updatefound() {
            //
        },
        offline() {
            //
        },
        error( error ) {
            //
        }
    } )
// }

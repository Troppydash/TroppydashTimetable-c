import { swUpdated } from '@/registerServiceWorker';

const REFRESH_DELAY = 3;

export default {
    data() {
        return {
            registration: null ,
            updateExists: false ,
            refreshing: false ,
            timer: REFRESH_DELAY ,
            interval: -1 ,
        };
    } ,
    created() {
        document.addEventListener(swUpdated , this.updateAvailable , { once: true });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (this.refreshing) return;
            this.refreshing = true;
            window.location.reload(true);
        })
    } ,
    methods: {
        refreshApp() {
            this.updateExists = false;
            if (!this.registration || !this.registration.waiting) return;
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        } ,
        count() {
            this.timer -= 1;
            if (this.timer <= 0) {
                this.refreshApp();
                clearInterval(this.interval);
            }
        } ,
        updateAvailable( event ) {
            this.registration = event.detail;
            this.updateExists = true;
            this.timer = REFRESH_DELAY;
            this.interval = setInterval(this.count , 1000);
        }
    }
};

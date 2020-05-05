<template>
    <div class="settings">
        <!--<h1>Settings</h1>-->
        <!--<h5>{{ email }}</h5>-->
        <DisplaySettingsSidebar :is-mobile="isMobile" />
        <DisplaySettings />
    </div>
</template>

<script>
    import { mapGetters} from 'vuex';
    import firebase from 'firebase/app';
    import DisplaySettings from '@/components/DisplaySettings';
    import DisplaySettingsSidebar from '@/components/DisplaySettingsSidebar';

    export default {
        name: 'Settings' ,
        components: { DisplaySettingsSidebar , DisplaySettings } ,
        data() {
            return {
                isMobile: false ,

            };
        } ,
        watch: {
        } ,
        computed: {
            ...mapGetters([
                'lastMessage'
            ]) ,
            email() {
                return firebase.auth().currentUser.email;
            }
        } ,
        methods: {
            onResize() {
                this.isMobile = window.innerWidth < 1300;
            } ,
        },
        mounted() {
            if (!this.$store.state.token) {
                this.$store.dispatch('handleGetUser');
            }
            this.onResize();
            window.addEventListener('resize' , this.onResize);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
        }
    };
</script>

<style scoped lang="scss">
    .settings {
        width: 100%;

        margin: 50px 0;

        box-sizing: content-box;
        padding-bottom: 50vh;

        position: relative;
        flex-wrap: wrap;
        display: flex;
        justify-content: center;
    }
</style>

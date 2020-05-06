<template>
    <div class="settings" v-if="!loading">
        <DisplaySettingsSidebar :is-mobile="isMobile" />
        <DisplaySettings />
    </div>
    <div class="settings" v-else>
        <p>Getting Current User, Please Wait...</p>
    </div>
</template>

<script>
    import { mapGetters , mapState } from 'vuex';
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
            ...mapState([
                'loading'
            ])
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

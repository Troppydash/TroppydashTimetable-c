<template>
    <div class="settings" v-if="!loading">
        <DisplaySettingsSidebar :is-mobile="isMobile" />
        <DisplaySettings />
    </div>
    <div v-else style="margin: 40px 0 0 0;">
        <LoadingMessage />
    </div>
</template>

<script>
    import { mapGetters , mapState } from 'vuex';
    import DisplaySettings from '@/components/DisplaySettings';
    import DisplaySettingsSidebar from '@/components/DisplaySettingsSidebar';
    import LoadingMessage from '@/components/LoadingMessage';

    export default {
        name: 'Settings' ,
        components: { LoadingMessage , DisplaySettingsSidebar , DisplaySettings } ,
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
                this.isMobile = window.innerWidth < 1024;
            } ,
        },
        mounted() {
            if (!this.$store.state.username) {
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

        margin: 40px 0;

        box-sizing: content-box;

        position: relative;
        display: flex;
        justify-content: center;
    }

    @media only screen and (max-width: 1023px) {
        .settings {
            margin: 20px 0;
        }
    }
</style>

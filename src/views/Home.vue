<template>
    <div class="home" v-if="!loading">


        <TimeTable v-if="!timetable.loading" />

        <div v-else>
            <p>Loading... Please wait</p>
        </div>

        <VerifyEmailBanner v-if="!loading && !isVerified" />
    </div>
    <div v-else>
        <p>Getting Current User...</p>
    </div>
</template>

<style>
    .home-header {
        font-family: "Roboto Light", "Calibri Light";
        text-align: right;
        font-size: 3rem;
    }
</style>

<script>
    import { mapGetters , mapState } from 'vuex';
    import TimeTable from '@/components/TimeTable';
    import VerifyEmailBanner from '@/components/VerifyEmailBanner';

    export default {
        name: 'Home' ,
        components: { VerifyEmailBanner , TimeTable } ,
        data() {
            return {};
        } ,
        computed: {
            ...mapState([
                'username' ,
                'timetable' ,
                'loading' ,
                'isVerified'
            ])
        } ,
        methods: {}
    };
</script>

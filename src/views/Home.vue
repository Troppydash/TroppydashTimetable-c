<template>
    <div class="home" v-if="!loading">
        <h2>Hello {{ username }}</h2>

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

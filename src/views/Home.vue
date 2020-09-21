<template>
    <div class="home" v-if="!loading">
        <TimeTable v-if="!timetable.loading" />
        <div v-else>
            <p>Retrieving Timetable, Please Wait...</p>
        </div>
        <VerifyEmailBanner v-if="!loading && !isVerified && username" />
    </div>
    <div v-else class="home">
        <p>Getting Current User, Please Wait...</p>
    </div>
</template>

<style>
    .home {
        text-align: center;
    }
</style>

<script>
    import { mapState } from 'vuex';
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
        mounted() {
                if (!this.$store.state.username) {
                    this.$store.dispatch('handleGetUser')
                        .then(() => {
                            // setTimeout(() => {
                            this.$store.dispatch('handleGetTimetable' , {
                                force: false ,
                                date: this.$route.query.date || null
                            });
                            // } , 100);
                        });
                } else {
                    // setTimeout(() => {
                    this.$store.dispatch('handleGetTimetable' , {
                        force: false ,
                        date: this.$route.query.date || null
                    });
                    // } , 100);
                }
        }
    };
</script>

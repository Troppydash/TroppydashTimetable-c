<template>
    <div class="home" v-if="!loading">
        <TimeTable/>
        <VerifyEmailBanner v-if="!loading && !isVerified && username" />
    </div>
    <div v-else style="margin: 40px 0 0 0;">
        <LoadingMessage />
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
    import LoadingMessage from '@/components/LoadingMessage';

    export default {
        name: 'Home' ,
        components: { LoadingMessage , VerifyEmailBanner , TimeTable } ,
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
                        this.$store.dispatch('handleGetTimetable' , {
                            force: false ,
                            date: this.$route.query.date || null
                        });
                    });
            } else {
                this.$store.dispatch('handleGetTimetable' , {
                    force: false ,
                    date: this.$route.query.date || null
                });
            }
        }
    };
</script>

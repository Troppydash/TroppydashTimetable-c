<template>
    <div class="home" v-if="!loading">
        <h1>Home</h1>
        <h2>Hello {{ username }}</h2>

        <div v-if="!timetable.loading">
            <TimeTable />
        </div>
        <div v-else>
            <p>Loading... Please wait</p>
        </div>
    </div>
    <div v-else>
        <p>Getting Current User...</p>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import TimeTable from '@/components/TimeTable';

    export default {
        name: 'Home' ,
        components: { TimeTable } ,
        data() {
            return {};
        } ,
        computed: {
            ...mapState([
                'username',
                'timetable',
                'loading'
            ])
        } ,
        methods: {
        }
    };
</script>

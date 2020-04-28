<template>
    <div class="timeTable">
        <p v-if="timetable.error">{{ timetable.error }}</p>
        <!--Table-->
        <DisplayTable v-bind:table-data="timetable.data" :on-click="handleClick" />

        <!--Canvas-->
        <DisplayCanvas ref="map" />
    </div>
</template>

<script>
    import DisplayTable from '@/components/DisplayTable';
    import { mapState } from 'vuex';
    import DisplayCanvas from '@/components/DisplayCanvas';

    export default {
        name: 'TimeTable' ,
        components: { DisplayCanvas , DisplayTable } ,
        data() {
            return {};
        } ,
        computed: {
            ...mapState([
                'timetable' ,
            ])
        } ,
        methods: {
            handleClick( code ) {
                this.$refs.map.focusFromCode(code);
            }
        }
    };
</script>

<style scoped>
    .timeTable {
        width: 100%;

        margin: 50px 0 500px;
    }
</style>

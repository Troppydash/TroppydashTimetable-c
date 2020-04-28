<template>
    <div class="timeTable">
        <p v-if="timetable.error">{{ timetable.error }}</p>
        <div class="row" style="width: 100%">

            <!--Canvas-->
            <div class="col-lg-4">
                <DisplayCanvas ref="map"/>
            </div>

            <!--Table-->
            <div class="col-lg-8">
                <DisplayTable v-bind:table-data="timetable.data" :on-click="handleClick"/>
            </div>

            <!--Canvas-->
            <div class="col-lg-4">
                <DisplayCanvas ref="map"/>
            </div>

        </div>
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
            return {
            }
        },
        computed: {
            ...mapState([
                'timetable',
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
    }
</style>

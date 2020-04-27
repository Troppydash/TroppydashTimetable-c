<template>
    <div class="timeTable">
        <p v-if="timetable.error">{{ timetable.error }}</p>
        <div class="row">

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

</style>

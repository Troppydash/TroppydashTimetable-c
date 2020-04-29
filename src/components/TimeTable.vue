<template>
    <div class="timeTable">
        <p v-if="timetable.error">{{ timetable.error }}</p>
        <!--Table-->
        <DisplayTable :table-data="timetable.data" :on-click="handleClick" :selected-item="selectedItem" :is-mobile="isMobile"/>

        <!--Canvas-->
        <DisplayCanvas ref="map" :is-mobile="isMobile"/>
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
                isMobile: false,
                selectedItem: ''
            };
        } ,
        computed: {
            ...mapState([
                'timetable' ,
            ])
        } ,
        methods: {
            handleClick( code, item ) {
                this.selectedItem = item;
                this.$refs.map.focusFromCode(code);
            },
            onResize() {
                this.isMobile = window.innerWidth < 1024;
            },
        },
        mounted() {
            this.onResize();
            window.addEventListener('resize', this.onResize, { passive: true })
        }
    };
</script>

<style scoped>
    .timeTable {
        width: 100%;

        margin: 50px 0 400px;
    }
</style>

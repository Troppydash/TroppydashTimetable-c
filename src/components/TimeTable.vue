<template>
    <div class="timeTable">
        <p v-if="timetable.error">{{ timetable.error }}</p>
        <!--Table-->
        <DisplayTable :table-data="timetable.data" :on-click="handleClick" :selected-item="selectedItem"
                      :is-mobile="isMobile" :closed="isCanvasClosed" />

        <!--Canvas-->
        <DisplayCanvas ref="map" :is-mobile="isMobile" :toggle-canvas="toggleCanvas" :closed="isCanvasClosed"/>
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
                isMobile: false ,
                selectedItem: '',
                isCanvasClosed: false,
            };
        } ,
        computed: {
            ...mapState([
                'timetable' ,
            ])
        } ,
        methods: {
            handleClick( code , item ) {
                if (!code) {
                    return;
                }
                this.selectedItem = item;
                this.$refs.map.focusFromCode(code);
            } ,
            onResize() {
                this.isMobile = window.innerWidth < 1024;
            } ,
            toggleCanvas() {
                this.isCanvasClosed = !this.isCanvasClosed;
            }
        } ,
        mounted() {
            this.onResize();
            window.addEventListener('resize' , this.onResize );

            this.$store.dispatch('handleGetTimetable', { force: false, date: this.$route.query.date || '' })
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
        }
    };
</script>

<style scoped>
    .timeTable {
        width: 100%;

        margin: 50px 0 400px;
    }
</style>

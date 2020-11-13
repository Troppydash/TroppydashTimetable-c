<template>
    <div class="timeTable">
        <p v-if="timetable.error">{{ timetable.error }}</p>
        <!--Table-->
        <DisplayTable :table-data="timetable.data" :on-click="handleClick" :selected-item="selectedItem"
                      :is-mobile="isMobile" :closed="isCanvasClosed" />

        <!--Canvas-->
        <DisplayCanvas ref="map" :is-mobile="isMobile" :toggle-canvas="toggleCanvas" :closed="isCanvasClosed" />
    </div>
</template>

<script>
    import DisplayTable from '@/components/DisplayTable';
    import DisplayCanvas from '@/components/DisplayCanvas';
    import { mapState } from 'vuex';

    export default {
        name: 'TimeTable' ,
        components: { DisplayCanvas , DisplayTable } ,
        data() {
            return {
                isMobile: false ,
                selectedItem: '' ,
                isCanvasClosed: false ,
            };
        } ,
        computed: {
            ...mapState([
                'timetable'
            ]),
            routerDate() {
                return undefined;
            }
        } ,
        watch: {
            routerDate( newVal ) {
                this.$store.dispatch('handleGetTimetable' , { force: true , date: newVal || null });
            }
        } ,
        methods: {
            handleClick( code , item ) {
                if (!code) {
                    return;
                }
                this.selectedItem = item;
                this.$refs.map.focusObject(code);
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
            window.addEventListener('resize' , this.onResize);
            // if (this.$route.query.date) {
            //     this.$store.dispatch('handleGetTimetable' , { force: true , date: this.$route.query.date || null });
            // }
        } ,
        beforeDestroy() {
            window.removeEventListener('resize' , this.onResize);
        }
    };
</script>

<style scoped>
    .timeTable {
        width: 100%;

        padding-bottom: 50vh;
        margin: 40px 0 0;
    }

    @media only screen and (max-width: 1023px) {
        .timeTable {
            margin: 10px 0 0;
        }
    }

</style>

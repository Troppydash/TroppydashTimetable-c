<template>
    <div class="dayProgressbar" ref="parentWrapper" v-if="!isMobile">
        <div class="progress-bar">
            <div class="pointer" :style="{ width: this.width + 'px' }" v-if="this.width !== 0">
                <span>{{ now }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';
    import { clamp } from '@/Helpers';

    export default {
        name: 'DayProgressbar' ,
        props: ['offsetWidth' , 'isMobile'] ,
        data() {
            return {
                width: 0
            };
        } ,
        computed: {
            ...mapGetters([
                'today' ,
                'timetable'
            ]) ,
            now() {
                return moment().format('hh:mm a').toString();
            } ,
        } ,
        watch: {
            offsetWidth() {
                this.width = this.widthPercentage();
            }
        } ,
        methods: {
            widthPercentage() {
                if (!this.offsetWidth) {
                    return 0;
                }
                const { start , end , difference } = this.todayTimeConstraints();

                const totalWidth = this.$refs.parentWrapper.offsetWidth - this.offsetWidth;

                const mBeforeStartFromNow = moment.duration(moment().diff(start)).asMinutes();


                return clamp(mBeforeStartFromNow / difference , 0 , 1) * totalWidth + this.offsetWidth;
            } ,
            todayTimeConstraints() {
                const today = this.timetable[this.today] || this.timetable[0];
                if (!today) {
                    return {
                        start: moment() ,
                        end: moment() ,
                        difference: 0
                    };
                }

                let earliestStart = moment().add(10 , 'days');
                let latestEnd = moment().add(-10 , 'days');
                // today
                today.periodData.forEach(( period ) => {
                    const start = moment(period.FromTime , 'h.mm');
                    const end = moment(period.ToTime , 'h.mm');

                    if (start.isBefore(earliestStart)) {
                        earliestStart = start;
                    }
                    if (end.isAfter(latestEnd)) {
                        latestEnd = end;
                    }
                });

                return {
                    start: earliestStart ,
                    end: latestEnd ,
                    difference: moment.duration(latestEnd.diff(earliestStart)).asMinutes()
                };
            }
        } ,
        mounted() {
            this.width = this.widthPercentage();
        }
    };
</script>

<style scoped>

    .dayProgressbar {
        width: 100%;

        margin: 0.5rem 0;
    }

    .progress-bar {
        width: 100%;
        height: 1.5rem;
        background: var(--scots-lightgrey);
        position: relative;
    }

    .pointer {
        position: absolute;
        top: 0;
        left: 0;
        height: 1.52rem;
        background: var(--scots-red);

        padding: 0 0.5rem;

        display: flex;
        align-items: center;
        justify-content: flex-end;

        overflow: hidden;
    }


    .pointer > span {
        color: white;
        text-shadow: 1px 1px 1px var(--scots-grey1);
        font-size: 1.2rem;
        white-space: nowrap;

        user-select: none;
    }
</style>

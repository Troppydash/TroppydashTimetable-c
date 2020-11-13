<template>
    <div class="displayTable" v-if="!isMobile">
        <table class="main-table">
            <thead>
            <tr>
                <th ref="dateCol"></th>
                <th v-for="heading in tableHeaders" :key="heading">
                    {{ heading }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(day, index) in tableData" :key="day.Date" :class="{ 'today': index === today }">
                <td class="date-column">{{ prettyDate(day.DateFormatted) }}</td>
                <td v-for="period in day.periodData" :key="period.PeriodID"
                    v-on:click="() => onClick(period.AdditionalData.Room, ''+index+period.PeriodID)"
                    :class="{
                        'selected': selectedItem === ''+index+period.PeriodID,
                        'lesson': currentLesson === ''+index+period.PeriodID ,
                        'hovered': selectedItem !== ''+index+period.PeriodID && hoveredItem === period.AdditionalData.Desc
                    }"
                    class="period"
                    @mouseover="() => hoverItem(period.AdditionalData.Desc)"
                    @mouseleave="() => unhoverItem()">
                    {{ period.AdditionalData.Desc }}
                    <span class="room-number room-number-desktop">
                        {{ period.AdditionalData.Room }}
                    </span>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="displayTable" v-else>
        <div class="main-list__container">
            <div class="main-list" v-for="(day, index) in tableData" :key="day.Date">
                <div class="main-list-title" @click="() => handleToggle(index)" :class="{ 'today': index === today }">
                    <span>{{ day.DateFormatted }}</span>
                    <div class="arrow">
                        <fa-icon icon="angle-up" v-if="days[index]" />
                        <fa-icon icon="angle-down" v-else />
                    </div>
                </div>
                <ul class="main-list-item" :class="{ open: days[index] }">
                    <li v-for="period in day.periodData" :key="period.PeriodID"
                        v-on:click="() => onClick(period.AdditionalData.Room, ''+index+period.PeriodID)"
                        :class="{
                            selected: selectedItem === ''+index+period.PeriodID,
                            'lesson': currentLesson === ''+index+period.PeriodID
                        } ">
                        {{ period.AdditionalData.Desc }}
                        <span class="room-number room-number-mobile">
                            {{ period.AdditionalData.Room }}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { getDisableHighlighting , getShowRoomName } from '@/StorageKeysGetters';
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import { getFakeTableData } from '@/Helpers';

    export default {
        name: 'Timetable' ,
        props: ['onClick', 'selectedItem'],
        data() {
            const disableHighlighting = getDisableHighlighting();

            let forceRoomName = null;
            const showRoomName = getShowRoomName();
            if (showRoomName === 'always') {
                forceRoomName = true;
            } else if (showRoomName === 'never') {
                forceRoomName = false;
            }

            const fakeData = getFakeTableData();

            const fakeDays = [];
            for (const _ of fakeData) {
                fakeDays.push(false);
            }
            return {
                forceRoomName ,
                disableHighlighting ,
                days: fakeDays,
                hoveredItem: '' ,

                offsetWidth: 0 ,
                didLoad: false ,
                tableData: fakeData,
                isMobile: false,
            };
        } ,

        methods: {
            prettyDate( date ) {
                return moment(date.toString() , 'dddd Do MMMM, YYYY').format('dddd, MMMM Do YYYY');
            } ,
            hoverItem( desc ) {
                if (this.disableHighlighting) {
                    return;
                }
                if (this.isMobile) {
                    return;
                }
                this.hoveredItem = desc;
            } ,
            unhoverItem() {
                if (this.disableHighlighting) {
                    return;
                }
                if (this.isMobile) {
                    return;
                }
                this.hoveredItem = '';
            } ,
            handleToggle( index ) {
                this.days.splice(index , 1 , !this.days[index]);
            },
            onResize() {
                this.isMobile = window.innerWidth < 1400;
            } ,
        } ,
        computed: {
            tableHeaders() {
                if (this.tableData.length > 0) {
                    return this.tableData[0].periodData.map(period => {
                        return 'Period ' + period.PeriodID;
                    });
                }
                return [];
            } ,
            ...mapGetters([
                'today' ,
                'currentLesson' ,
                'timetable'
            ])
        },
        mounted() {
            this.onResize();
            window.addEventListener('resize' , this.onResize);
        } ,
        beforeDestroy() {
            window.removeEventListener('resize' , this.onResize);
        }
    };
</script>

<style scoped lang="scss">
    .selected:not(.lesson) {
        color: white;
        background: var(--scots-grey1);

        &:hover {
            background: var(--scots-grey1);
        }
    }

    .today {
        border-left: 0.7rem solid var(--scots-red);
    }

    .lesson {
        background: var(--scots-red) !important;
        color: white !important;
    }

    .period {
        position: relative;
        overflow-y: visible;
        overflow-x: visible;
    }

    .room-number {
        color: var(--scots-red);
        font-weight: bold;
    }

    .selected > .room-number {
        color: #ffffff;
    }

    .lesson > .room-number {
        color: white;
    }

    @-webkit-keyframes zoom {
        0% {
            transform: scale(1.2);
        }
    }

    @keyframes zoom {
        0% {
            transform: scale(1.2);
        }
    }

    .room-number-desktop {
        position: absolute;
        bottom: 2px;
        right: 2px;

        transform: scale(1.0);
        animation: zoom 0.25s forwards ease;
        -webkit-animation: zoom 0.25s forwards ease;
    }

    .room-number-mobile {
        float: right;
    }

    /*Mobile*/
    .main-list__container {
        margin: 0 auto;
    }

    .arrow {
        float: right;
    }

    .main-list {
        -webkit-tap-highlight-color: transparent;
        outline: none;

        * {
            outline: none;
        }

        cursor: pointer;

        margin: 0;
        padding: 0;

        width: 100%;

        .main-list-title {
            color: white;
            background: var(--scots-grey2);
        }

        .main-list-title {
            width: 100%;
            padding: 1rem;
        }

        .main-list-item {
            list-style: none;
            margin: 0;
            padding: 0;

            //max-height: 0;
            overflow: hidden;

            li {
                width: 100%;
                padding: 1rem;
                margin: 0;
            }
        }
    }

    //@-webkit-keyframes slide {
    //    0% {
    //        max-height: 0;
    //        transition: max-height 1s;
    //    }
    //    100% {
    //        max-height: 500px;
    //        transition: max-height 1s;
    //    }
    //}
    //
    //@keyframes slide {
    //    0% {
    //        max-height: 0;
    //        transition: max-height 1s;
    //    }
    //    100% {
    //        max-height: 500px;
    //        transition: max-height 1s;
    //    }
    //}

    .main-list-item {
        max-height: 600px;
        transition: max-height 0.75s ease;
        transition-delay: 10ms;

        //animation: slide 0.75s forwards;
        //-webkit-animation: slide 0.75s forwards;

        &:not(.open) {
            max-height: 0;
        }
    }


    /*Not Mobile*/
    .displayTable {
        text-align: left;
        width: 100%;

    }

    .date-column {
        width: 16%;
    }

    .main-table {
        width: 100%;
        margin: 0 auto;
        border-collapse: collapse;


        tbody tr {
            &:hover {
                background: var(--highlight);
            }
        }

        td, th {
            padding: 1rem;
            cursor: pointer;
        }

        td:not(.date-column) {
            width: 14%;
        }

        td {
            height: 4rem;
        }

        tr + tr {
            border-bottom: 1px solid var(--scots-grey1);
            border-top: 1px solid var(--scots-grey1);
        }

        thead tr {
            background: var(--scots-grey2);

            th {
                color: white;
                font-family: "Roboto Light", "Helvetica";
                font-weight: normal;
                font-size: 1.25rem;
            }
        }
    }

    .hovered {
        transition-delay: 1s;
        transition-duration: 200ms;
        background: #9e9e9e;
        color: white;
    }

</style>

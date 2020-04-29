<template>
    <div class="displayTable" v-if="!isMobile">
        <table class="main-table">
            <thead>
            <tr>
                <th></th>
                <th v-for="heading in tableHeaders" :key="heading">
                    {{ heading }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(day, index) in tableData" :key="day.Date">
                <td class="date-column">{{ day.DateFormatted }}</td>
                <td v-for="period in day.periodData" :key="period.PeriodID"
                    v-on:click="() => onClick(period.AdditionalData.Room, ''+index+period.PeriodID)"
                    :class="{ selected: selectedItem === ''+index+period.PeriodID }">
                    {{ period.AdditionalData.Desc }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="displayTable" v-else>
        <div class="main-list__container">
            <div class="main-list" v-for="(day, index) in tableData" :key="day.Date">
                <div class="main-list-title" @click="() => handleToggle(index)">
                    <span>{{ day.DateFormatted }}</span>
                    <div class="arrow">
                        <i class="fa fa-lg fa-angle-up" v-if="days[index]"></i>
                        <i class="fa fa-lg fa-angle-down" v-else></i>
                    </div>
                </div>
                <ul v-if="days[index]" class="main-list-item" :class="{ open: days[index] }">
                    <li v-for="period in day.periodData" :key="period.PeriodID"
                        v-on:click="() => onClick(period.AdditionalData.Room, ''+index+period.PeriodID)"
                        :class="{ selected: selectedItem === ''+index+period.PeriodID }">
                        {{ period.AdditionalData.Desc }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DisplayTable' ,
        props: ['tableData' , 'onClick' , 'selectedItem' , 'isMobile'] ,
        data() {
            return {
                days: this.tableData.map(() => false) ,
            };
        } ,
        methods: {
            handleToggle( index ) {
                this.days.splice(index , 1 , !this.days[index]);
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
        }
    };
</script>

<style scoped lang="scss">
    .selected {
        background: #ff5d63;
        color: white;

        &:hover {
            background: var(--scots-red) !important;
        }
    }


    /*Mobile*/
    .main-list__container {
        width: 90%;
        margin: 0 auto;
    }

    .arrow {
        float: right;
    }

    .main-list {
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

            max-height: 0;
            transition: max-height 1s ease-in;
            overflow: hidden;

            li {
                width: 100%;
                padding: 1rem;
                margin: 0;
            }
        }
    }

    @-webkit-keyframes slide {
        100% {
            max-height: 500px;
            transition: max-height 1s;
        }
    }

    @keyframes slide {
        100% {
            max-height: 500px;
            transition: max-height 1s;
        }
    }

    .main-list-item {
        max-height: 0;
        transition: max-height 1s;
        overflow: hidden;

        animation: slide 0.75s ease;
        -webkit-animation: slide 0.75s ease;
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
        width: 90%;
        margin: 0 auto;
        border-collapse: collapse;


        tbody tr {
            &:hover {
                background: var(--scots-lightgrey);
            }

            td:hover {
                background: lightgray;
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
            overflow-y: auto;
        }

        tr + tr {
            border-bottom: 1px solid var(--scots-grey1);
            border-top: 1px solid var(--scots-grey1);
        }

        thead tr {
            background: var(--scots-grey2);

            th {
                color: white;
                font-family: "Roboto Light", Sans, sans-serif;
                font-weight: normal;
                font-size: 1.25rem;
            }
        }
    }

</style>

<template>
    <div class="displayTable">
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
                <tr v-for="day in tableData" :key="day.Date">
                    <td class="date-column">{{ day.DateFormatted }}</td>
                    <td v-for="period in day.periodData" :key="period.PeriodID" v-on:click="onClick(period.AdditionalData.Room)">
                        {{ period.AdditionalData.Desc }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'DisplayTable' ,
        props: ['tableData', 'onClick'] ,
        computed: {
            tableHeaders() {
                if (this.tableData.length > 0) {
                    return this.tableData[0].periodData.map(period => {
                        return "Period " + period.PeriodID;
                    })
                }
                return [];
            }
        },
    };
</script>

<style scoped lang="scss">
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
                font-family: "Roboto Light", "Calibri Light";
                font-weight: normal;
                font-size: 1.25rem;
            }
        }
    }


</style>

<template>
    <div class="displayTable">
        <table>
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
                    <td>{{ day.DateFormatted }}</td>
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

<style scoped>
    .displayTable {
        text-align: left;
    }
</style>

<template>
    <div class="displayDatePicker">
        <div class="wrapper">
            <Datepicker v-model="date" monday-first :highlighted="highlighted"/>
            <button class="button button-primary" @click="handleView" :disabled="!viewButtonActive">{{ isToday ? 'Today'
                : 'GoTo' }}
            </button>
        </div>
    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import moment from 'moment';

    export default {
        name: 'DisplayDatePicker' ,
        components: {
            Datepicker
        } ,
        data() {
            const initialDate = this.$route.query.date
                ? moment(this.$route.query.date , 'DD-MM-YYYY').toString()
                : moment().format('MM-DD-YYYY').toString();

            return {
                date: initialDate,
                highlighted: {
                    dates: [
                        new Date()
                    ]
                }
            };
        } ,
        computed: {
            viewButtonActive() {
                // If no date
                if (!this.$route.query.date) {
                    if (moment(this.date).format('DD-MM-YYYY').toString() === moment().format('DD-MM-YYYY')) {
                        return false;
                    }
                    // If have date, and url date
                } else if (this.$route.query.date === moment(this.date).format('DD-MM-YYYY').toString()) {
                    return false;
                }
                return true;
            } ,
            isToday() {
                if (this.$route.query.date) {
                    if (this.$route.query.date !== moment().format('DD-MM-YYYY')) {
                        return false;
                    }
                }
                return moment(this.date).format('DD-MM-YYYY').toString() === moment().format('DD-MM-YYYY');
            }
        } ,
        methods: {
            handleView() {
                const selectedDate = moment(this.date , 'MM-DD-YYYY').format('DD-MM-YYYY').toString();

                if (!this.viewButtonActive) {
                    return;
                }
                if (this.$route.query) {
                    if (this.$route.query.date === this.date) {
                        return;
                    }
                }

                // Do stuff
                this.$router.push(`/home?date=${ selectedDate }`);
                this.$store.dispatch('handleGetTimetable' , { force: true , date: selectedDate });
            }
        }
    };
</script>

<style scoped lang="scss">

    .displayDatePicker {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 1rem;
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;


        & > * {
            margin-right: 5px;
        }
    }

    button:disabled {
        background-color: #6b6b6b;
    }

</style>

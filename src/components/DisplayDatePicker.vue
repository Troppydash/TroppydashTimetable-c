<template>
    <div class="displayDatePicker">
        <div class="date-message">
            <p>
                <span>
                    {{ todayMessage
                    ? `Welcome, Today's Date is `
                    : `Greetings, fellow Time traveller. You are currently in the time ` }}
                </span>
                <span class="date-message-date">
                {{ todayMessage ? prettyDate : prettyTimeTravelDate }}
                </span>
            </p>
        </div>
        <div class="wrapper">
            <Datepicker v-model="date" monday-first :highlighted="highlighted" />
            <button class="button button-primary timetravel-button" @click="handleView" :disabled="!viewButtonActive">{{ isToday ? 'Today'
                : 'Time Travel' }}
            </button>
        </div>
    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';
    import moment from 'moment';
    import { mapState } from 'vuex';

    export default {
        name: 'DisplayDatePicker' ,
        components: {
            Datepicker
        } ,
        data() {
            const initialDate = this.$route.query.date
                ? moment(this.$route.query.date , 'DD-MM-YYYY').format('MM-DD-YYYY').toString()
                : moment().format('MM-DD-YYYY').toString();

            return {
                date: initialDate ,
                highlighted: {
                    dates: [
                        new Date()
                    ]
                }
            };
        } ,
        computed: {
            ...mapState([
                'isVerified'
            ]),
            prettyDate() {
                return moment().format('dddd, Do MMM YYYY');
            } ,
            prettyTimeTravelDate() {
                return moment(this.$route.query.date , 'DD-MM-YYYY').format('dddd, Do MMM YYYY');
            } ,
            todayMessage() {
                if (this.$route.query.date) {
                    return this.$route.query.date === moment().format('DD-MM-YYYY');
                }
                return true;
            } ,
            viewButtonActive() {
                if (!this.isVerified) {
                    return false;
                }
                // If no date
                if (!this.$route.query.date) {
                    if (moment(this.date , 'MM-DD-YYYY').format('DD-MM-YYYY').toString() === moment().format('DD-MM-YYYY')) {
                        return false;
                    }
                    // If have date, and url date
                } else if (this.$route.query.date === moment(this.date, 'MM-DD-YYYY').format('DD-MM-YYYY').toString()) {
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
                return moment(this.date, 'MM-DD-YYYY').format('DD-MM-YYYY').toString() === moment().format('DD-MM-YYYY');
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

    .date-message {
        font-size: 1.1rem;
        font-family: "Roboto Light", Sans, sans-serif;
    }

    .date-message-date {
        text-decoration: underline;
    }

    .displayDatePicker {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .wrapper {
        width: auto;
        display: flex;
        align-items: center;
        justify-content: center;


        & > * {
            margin-right: 5px;
        }
    }
    @media only screen and (max-width: 760px) {
        .wrapper {
            width: 100%;
            justify-content: flex-end;
        }
    }

    button:disabled {
        background-color: #6b6b6b;
    }

</style>

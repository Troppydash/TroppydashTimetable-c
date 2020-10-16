<template>
    <div class="editUser">
        <span>{{ currentUserEmail }}</span>
        <form @submit.prevent="handleSubmit" class="edituser-form">
            <div>
                <p class="input-label">Username</p>
                <label>
                    <input class="input" type="text" v-model="username" placeholder="Username" />
                </label>
            </div>
            <div>
                <p class="input-label">KeyCode</p>
                <label>
                    <input class="input" type="text" v-model="keyCode" placeholder="Keycode" />
                </label>
            </div>
            <p v-if="error" class="error">{{ error }}</p>
            <div>
                <input type="submit" value="Update" class="button button-form button-primary" />
            </div>
        </form>

        <form @submit.prevent="handleCalibrate" class="cal-button">
            <div>
                <input type="submit" value="Calibrate User" class="button button-form button-primary" />
            </div>
        </form>

        <CustomModel :is-showing="isCalibrating" title="Calibration"
                     :on-cancel="handleCalibrateClose" :on-complete="handleCalibrateClose">
            <div class="content-container">
                <div style="padding-right: 2rem">
                    <form @submit.prevent="startCalibrate" class="cal-form">
                        <div>
                            <p class="input-label">Firstname</p>
                            <label>
                                <input :disabled="isCalibratingLoading" class="input input-wide" type="text" v-model="firstname" placeholder="Firstname" />
                            </label>
                        </div>
                        <div>
                            <p class="input-label">Lastname</p>
                            <label>
                                <input :disabled="isCalibratingLoading" class="input input-wide" type="text" v-model="lastname" placeholder="Lastname" />
                            </label>
                        </div>
                        <div>
                            <p class="input-label">Middlename</p>
                            <label>
                                <input :disabled="isCalibratingLoading" class="input input-wide" type="text" v-model="middlename" placeholder="Middlename" />
                            </label>
                        </div>
                        <p class="error" v-if="calError">{{ calError }}</p>
                        <div>
                            <input :disabled="isCalibratingLoading"
                                   type="submit" value="Calibrate" class="button button-form button-primary" />
                        </div>
                    </form>
                </div>
                <div>
                    <p class="sub-text">Email: {{ currentUserEmail }}</p>
                    <p class="sub-text">Username: {{ username }}</p>
                    <hr />
                    <p class="sub-text">You can leave some fields empty if you'd like</p>
                    <p class="sub-text">This info will not be saved and will only be used during the calibration
                        process</p>
                </div>
            </div>
        </CustomModel>
    </div>
</template>

<script>
    import * as firebase from 'firebase/app';
    import CustomModel from '@/components/Popups/CustomModel';

    export default {
        name: 'EditUser' ,
        components: { CustomModel } ,
        data() {
            return {
                username: this.$store.state.username ,
                keyCode: '' ,
                error: '' ,

                isCalibrating: false ,
                isCalibratingLoading: false ,
                calError: '' ,
                firstname: '' ,
                lastname: '' ,
                middlename: '' ,

            };
        } ,
        computed: {
            currentUserEmail() {
                return firebase.auth().currentUser.email;
            }
        } ,
        methods: {
            handleCalibrateClose() {
                this.isCalibrating = false;
            } ,
            handleCalibrate() {
                this.isCalibrating = true;
            } ,
            startCalibrate() {
                this.calError = '';
                this.isCalibratingLoading = true;
                this.$store.dispatch('handleCalibrate', {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    middlename: this.middlename
                })
                    .then(res => {
                        if (res.success) {
                            this.calError = 'Calibration Complete';
                        } else {
                            this.calError = 'Calibration Failed: ' + res.message;
                        }
                    })
                    .catch(res => {
                        this.calError = 'Calibration Failed: ' + res.message;
                    })
                    .finally(() => {
                        this.isCalibratingLoading = false;
                    });
            } ,
            handleSubmit() {
                this.$store.dispatch('handleEditUser' , {
                    username: this.username ,
                    keyCode: this.keyCode
                }).then(( { error } ) => {
                    if (error) {
                        console.log(error);
                        this.error = error;
                    } else {
                        this.$router.replace('home');
                    }
                });
            } ,
        }
    };
</script>

<style scoped lang="scss">

    .cal-button {
        margin: 10px 0;
    }

    .cal-form {
        margin: 0;
    }

    .content-container {
        padding: 1rem 0;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        justify-content: space-between;


        & > div {
            width: 50%;
        }
    }

    .edituser-form {
        margin: 0 auto;
        width: auto;
    }

    .input-label {
        text-align: left;
        margin: 5px 0;

        font-family: "Roboto", Sans, sans-serif;
        font-size: 1.2rem;
    }

    .input {
        width: 400px;
    }

    .input-wide {
        width: 100%;
    }

    @media only screen and (max-width: 1023px) {
        .input {
            width: 100%;
        }

        .content-container {
            flex-direction: column;

            & > div {
                width: 100%;
                padding: 0;
            }
        }

    }

    .sub-text {
        font-family: "Roboto Light", Sans, sans-serif;
        font-size: 1.2rem;
    }

    hr {
        border-color: var(--scots-red);
    }

</style>

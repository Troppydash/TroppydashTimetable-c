<template>
    <div class="editUser">
        <span>{{currentUserEmail}}</span>
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
    </div>
</template>

<script>
    import api from '@/service/api';
    import firebase from 'firebase';

    export default {
        name: 'EditUser' ,
        data() {
            return {
                username: this.$store.state.username ,
                keyCode: '' ,
                error: '' ,
            };
        } ,
        computed: {
            currentUserEmail() {
                return firebase.auth().currentUser.email;
            }
        } ,
        methods: {
            handleSubmit() {
                const username = this.username;
                api.put('/edituser' , { username: username , keyCode: this.keyCode })
                    .then(() => {
                        if (username) {
                            this.$store.commit('setUsername' , { username });
                        }
                        this.$store.dispatch('handleGetTimetable' , { force: true });
                        this.$router.replace('home');
                    })
                    .catch(err => {
                        this.error = err.message;
                    });
            } ,
        }
    };
</script>

<style scoped>
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

    @media only screen and (max-width: 1023px) {
        .input {
            width: 100%;
        }
    }
</style>

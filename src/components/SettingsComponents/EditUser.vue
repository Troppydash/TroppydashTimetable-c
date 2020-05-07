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
    import * as firebase from 'firebase/app';

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
                this.$store.dispatch('handleEditUser' , {
                    username: this.username ,
                    keyCode: this.keyCode
                }).then(( { error } ) => {
                    console.log(error);

                    if (error) {
                        this.error = error;
                    } else {
                        this.$router.replace('home');
                    }
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

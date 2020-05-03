<template>
    <div class="settings">
        <h1>Settings</h1>
        <h5>{{ email }}</h5>
        <form @submit.prevent="handleSubmit">
            <div>
                Username
                <input type="text" v-model="username" />
            </div>
            <div>
                KeyCode
                <input type="text" v-model="keyCode" />
            </div>
            <p v-if="error">{{ error }}</p>
            <input type="submit" value="Edit" />
        </form>

        <div>
            Force Shadow?
            <input type="checkbox" value="force shadow" v-model="forceShadow">
        </div>

        <button @click="handleLogout">Logout</button>
        <button @click="handleDelete">Delete user</button>
        <button @click="verifyEmail" v-if="!isVerified">Verify Email</button>
        <p>{{ lastMessage }}</p>
    </div>
</template>

<script>
    import api from '../service/api';
    import { mapGetters , mapState } from 'vuex';
    import firebase from 'firebase/app';

    export default {
        name: 'Settings' ,
        data() {
            return {
                username: this.$store.state.username ,
                keyCode: '' ,
                error: '',
                forceShadow: localStorage.getItem('FORCE_SHADOW') === 'true'
            };
        } ,
        watch: {
            forceShadow(value) {
                localStorage.setItem('FORCE_SHADOW', ''+value);
            }
        },
        computed: {
            ...mapState([
                'isVerified'
            ]) ,
            ...mapGetters([
                'lastMessage'
            ]) ,
            email() {
                return firebase.auth().currentUser.email;
            }
        } ,
        methods: {
            verifyEmail() {
                this.$store.dispatch('verifyEmail');
            } ,
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
            handleLogout: function () {
                this.$store.dispatch('handleLogoutUser')
                    .then(() => {
                        this.$router.replace('login');
                    });
            } ,
            handleDelete: function () {
                this.$store.dispatch('handleDeleteUser')
                    .then(() => {
                        this.$router.replace('login');
                    });
            }
        }
    };
</script>

<style scoped>

</style>

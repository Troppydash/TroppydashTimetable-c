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
            Advance Shadow Setting
            <input type="checkbox" v-model="advanceShadow">
            <div v-if="advanceShadow">
                Shadows on?
                <input type="checkbox" value="force shadow" v-model="advanceShadowOn">
            </div>
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
    import { SHADOWS_ON } from '@/StoageKeys';

    export default {
        name: 'Settings' ,
        data() {
            return {
                username: this.$store.state.username ,
                keyCode: '' ,
                error: '' ,

                advanceShadow: localStorage.getItem(SHADOWS_ON) ,
                advanceShadowOn: localStorage.getItem(SHADOWS_ON) === 'true' ,
            };
        } ,
        watch: {
            advanceShadow( value ) {
                if (value) {
                    localStorage.setItem(SHADOWS_ON , '' + !(window.innerWidth < 1024));
                    this.advanceShadowOn = !(window.innerWidth < 1024);
                } else {
                    localStorage.removeItem(SHADOWS_ON);
                    this.advanceShadowOn = !(window.innerWidth < 1024);
                }
            } ,
            advanceShadowOn( value ) {
                if (!this.advanceShadow) {
                    return;
                }
                localStorage.setItem(SHADOWS_ON , '' + value);
            }
        } ,
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

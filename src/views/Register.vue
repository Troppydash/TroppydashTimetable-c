<template>
    <div class="register">
        <p>Create a new Account</p>
        <form @submit.prevent="handleRegister">
            <div>
                <input type="text" placeholder="Email" v-model="email" />
            </div>
            <div>
                <input type="password" placeholder="Password" v-model="password">
            </div>
            <p v-if="error">{{ error }}</p>
            <div>
                <input type="submit" value="Register">
            </div>
        </form>

        <GoogleLogin />
    </div>
</template>

<script>
    import firebase from 'firebase';
    import api from '../service/api';
    import GoogleLogin from '@/components/GoogleLogin';

    export default {
        name: 'Register' ,
        components: { GoogleLogin } ,
        data: () => ({
            email: '' ,
            password: '' ,
            error: ''
        }) ,
        methods: {
            handleRegister: function () {
                let token;
                // Create a user
                firebase.auth().createUserWithEmailAndPassword(this.email , this.password)
                    .then(() => {
                        // Get jwt token from current user
                        return firebase.auth().currentUser.getIdToken(true);
                    })
                    .then(tok => {
                        token = tok;
                        api.defaults.headers.common['Authorization'] = `Bearer ${ token }`;
                        return api.post('/createuser');
                    })
                    .then(res => {
                        this.$store.commit('setUser' , { token , username: res.data.username });
                        this.$router.replace('home');
                    })
                    .catch(err => {
                        this.error = err.message;
                    });
            }
        }
    };
</script>

<style scoped>

</style>

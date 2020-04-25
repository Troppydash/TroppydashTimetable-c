<template>
    <div class="login">
        <h3>Login</h3>
        <form @submit.prevent="handleLogin">
            <div>
                <input type="text" placeholder="Email" v-model="email" />
            </div>
            <div>
                <input type="password" placeholder="Password" v-model="password">
            </div>

            <p v-if="error">{{ error }}</p>
            <div>
                <input type="submit" value="Login">
            </div>
        </form>
        <GoogleLogin />
    </div>
</template>

<script>
    import firebase from 'firebase';
    import api from '@/service/api';
    import GoogleLogin from '@/components/GoogleLogin';

    export default {
        name: 'Login' ,
        components: { GoogleLogin } ,
        data: () => ({
            email: '' ,
            password: '' ,
            error: ''
        }) ,
        methods: {
            handleLogin: function () {
                let token;
                firebase.auth().signInWithEmailAndPassword(this.email , this.password)
                    .then(() => {
                        return firebase.auth().currentUser.getIdToken(true);
                    })
                    .then(tok => {
                        token = tok;
                        api.defaults.headers.common['Authorization'] = `Bearer ${ token }`;
                        return api.post('/loginuser');
                    })
                    .then(res => {
                        this.$store.commit('setUser' , { token, username: res.data.username });
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

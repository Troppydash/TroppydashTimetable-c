<template>
    <div class="googleLogin">
        <button @click="handleSocialLogin">
            <img alt="Google Logo" src="../assets/google-logo.svg" />
        </button>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import api from '@/service/api';

    export default {
        name: 'GoogleLogin' ,
        methods: {
            handleSocialLogin: function () {
                const provider = new firebase.auth.GoogleAuthProvider();

                let token;
                firebase.auth().signInWithPopup(provider)
                    .then(() => {
                        // Get jwt token from current user
                        return firebase.auth().currentUser.getIdToken(true);
                    })
                    .then(tok => {
                        token = tok;
                        api.defaults.headers.common['Authorization'] = `Bearer ${ token }`;
                        return api.post('/createsocialuser')
                    })
                    .then(res => {
                        this.$store.commit('setUser' , { token , username: res.data.username });
                        this.$router.replace('home');
                    })
                    .catch(err => {
                        alert(err.message);
                    });
            }
        }
    };
</script>

<style scoped>

</style>

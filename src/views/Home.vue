<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <h2>Hello {{ username }}</h2>
        <button @click="handleLogout">Logout</button>
    </div>
</template>

<script>
    import firebase from 'firebase';

    export default {
        name: 'Home' ,
        data() {
            return {
                username: this.$store.state.username
            }
        },
        methods: {
            handleLogout: function () {
                firebase.auth().signOut()
                    .then(() => {
                        this.$store.commit('signoutUser');
                        this.$router.replace('login');
                    });
            }
        }
    };
</script>

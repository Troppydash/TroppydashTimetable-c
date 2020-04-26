<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <h2>Hello {{ username }}</h2>
        <button @click="handleLogout">Logout</button>
        <button @click="handleDelete">Delete user</button>
        <button @click="getTimetable">Fetch</button>
    </div>
</template>

<script>
    import api from '../service/api';

    export default {
        name: 'Home' ,
        data() {
            return {};
        } ,
        computed: {
            username() {
                return this.$store.state.username;
            }
        } ,
        methods: {
            getTimetable() {
                api.post('/timetable')
                    .then(res => {
                        console.log(JSON.parse(res.data.data));
                    })
                    .catch(err => {
                        console.log(err);
                        console.log(err.response.data.message);
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

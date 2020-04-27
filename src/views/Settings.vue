<template>
    <div class="settings">
        <h1>Settings</h1>
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
            <input type="submit" value="Edit" disabled/>
        </form>

        <button @click="handleLogout">Logout</button>
        <button @click="handleDelete" disabled>Delete user</button>
    </div>
</template>

<script>
    import api from '../service/api';

    export default {
        name: 'Settings' ,
        data() {
            return {
                username: this.$store.state.username ,
                keyCode: '' ,
                error: ''
            };
        } ,
        methods: {
            handleSubmit() {
                const username = this.username;
                api.put('/edituser' , { username: username , keyCode: this.keyCode })
                    .then(res => {
                        if (username) {
                            this.$store.commit('setUsername' , { username });
                        }
                        this.$router.replace('home');
                    })
                    .catch(err => {
                        this.error = err.message;
                    });
            },
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

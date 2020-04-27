<template>
    <div class="header">
        <span v-if="isAuthenticated">
            <router-link to="/home">Home</router-link>
            |
            <router-link to="/settings">Settings</router-link>
        </span>
        <span v-else>
            <router-link to="/login">Login</router-link>
            |
            <router-link to="/register">Register</router-link>
        </span>
    </div>
</template>

<script>
    export default {
        name: 'Header',
        computed: {
            isAuthenticated() {
                return this.$store.state.authenticated;
            }
        }
    };
</script>

<style scoped>

</style>

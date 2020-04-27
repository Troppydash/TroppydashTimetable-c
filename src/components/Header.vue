<template>
    <div class="header-outside">
        <div class="header p-3" v-if="isAuthenticated">
            <router-link to="/home">Home</router-link>
            <router-link to="/settings">Settings</router-link>
        </div>
        <div class="header p-3" v-else>
            <router-link to="/login">Login</router-link>
            <router-link to="/register">Register</router-link>
        </div>
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

<style scoped lang="scss">
    .header-outside {
        width: 100%;
        height: 50px;

        border-top: 10px solid var(--scots-red);

        display: flex;
        justify-content: center;
    }
    .header {
        display: flex;

        width: 1024px;
        height: 100%;

        align-items: center;
        justify-content: left;

        background-color: var(--scots-red);

        a {
            color: white;
            text-decoration: none;
            font-size: 1.1rem;
            margin: 0 1rem;
            text-transform: uppercase;
            font-weight: bold;
        }
    }

    @media only screen and (max-width: 1024px) {
        .header {
            width: 100%;

            align-items: flex-end;
        }
    }

</style>

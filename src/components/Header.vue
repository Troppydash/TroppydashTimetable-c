<template>
    <div class="header-outside">
        <div class="header" v-if="loading">
            <a>Authenticating</a>
        </div>
        <div class="header" v-else-if="authenticated">
            <router-link to="/home" class="header-link">Home</router-link>
            <router-link to="/settings" class="header-link">Settings</router-link>
            <div class="username-container">
                <p class="username">Hello {{ shortenedUsername }}</p>
            </div>
        </div>
        <div class="header" v-else>
            <router-link to="/login">Login</router-link>
            <router-link to="/register">Register</router-link>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'Header' ,
        computed: {
            ...mapState([
                'username' ,
                'authenticated' ,
                'loading'
            ]),
            shortenedUsername() {
                return (this.username.length < 20) ? this.username : this.username.substr(0, 20) + '...'
            }
        }
    };
</script>

<style scoped lang="scss">

    .header-link {
        &:hover {
            text-decoration: underline;
        }
    }

    .username-container {
        margin-left: auto;

        .username {
            color: white;
            margin: 0;
        }
    }

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

        padding: 1rem;

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

        .header-outside {
            position: fixed;
            top: 0;
            z-index: 1;
        }
    }

</style>

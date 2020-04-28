<template>
    <div class="login">

        <div class="p-4 login-form__container" :class="{ loading: loaded }">
            <h1>Login</h1>

            <form @submit.prevent="handleLogin" class="login-form">
                <div>
                    <input class="input" type="text" placeholder="Email" v-model="email" :disabled="loaded" />
                </div>
                <div>
                    <label>
                        <input class="input" type="password" placeholder="Password" v-model="password"
                               :disabled="loaded">
                    </label>
                </div>

                <p class="error" v-if="error">{{ error }}</p>
                <div>
                    <input type="submit" value="Login" class="button button-form" :disabled="loaded">
                </div>
            </form>
            <div class="google-login__container">
                <GoogleLogin :loading="loaded" :handle-error="handleError" />
            </div>
        </div>

    </div>
</template>

<script>
    import GoogleLogin from '@/components/GoogleLogin';
    import { mapState } from 'vuex';

    export default {
        name: 'Login' ,
        components: { GoogleLogin } ,
        data: () => ({
            email: '' ,
            password: '' ,
            error: '' ,
            submitted: false ,
        }) ,
        computed: {
            ...mapState([
                'loading'
            ]) ,
            loaded() {
                return this.loading || this.submitted;
            }
        } ,
        methods: {
            handleError( error ) {
                this.error = error;
            } ,
            handleLogin: function () {
                this.submitted = true;
                this.$store.dispatch('handleLoginUser' , {
                    email: this.email ,
                    password: this.password
                })
                    .then(( { error } ) => {
                        this.submitted = false;
                        if (error) {
                            this.error = error;
                        } else {
                            this.$router.replace('home');
                        }
                    });
            }
        }
    };
</script>

<style scoped lang="scss">

    .loading {
        opacity: 0.5;
    }

    input:not([type=submit]) {
        width: 400px;
    }

    h1 {
        margin: 1rem 0;
        font-family: "Roboto Light", "Helvetica";
        font-weight: lighter;
        font-size: 5rem;
    }

    .login-form {
        margin-bottom: 5rem;

        & > div {
            margin: 10px 0;
        }
    }

    .login-form__container {
        min-width: 500px;
        min-height: 40%;
        text-align: center;
    }

    @-webkit-keyframes slide {
        100% {
            left: 0;
            opacity: 1
        }
    }

    @keyframes slide {
        100% {
            left: 0;
            opacity: 1
        }
    }

    .login {
        position: relative;
        left: -50px;
        opacity: 0;

        animation: slide 0.75s forwards;
        -webkit-animation: slide 0.75s forwards;

        width: 100%;
        height: calc(100% - 60px);

        padding-bottom: 5rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        & > div {
            margin-bottom: 50px;
        }
    }
</style>

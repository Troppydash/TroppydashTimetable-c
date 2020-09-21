<template>
    <div class="login">

        <div class="p-4 login-form__container" :class="{ loading: loaded }">
            <h1>Login</h1>

            <form @submit.prevent="handleLogin" class="login-form">
                <div>
                    <label>
                        <span class="input-label">Email</span>
                        <input class="input" type="text" placeholder="Email" v-model="email" :disabled="loaded" />
                    </label>
                </div>
                <div>
                    <label>
                        <span class="input-label">Password</span>
                        <input class="input" type="password" placeholder="Password" v-model="password"
                               :disabled="loaded">
                    </label>
                </div>

                <p class="error" v-if="error">{{ error }}</p>
                <div>
                    <input type="submit" value="Login" class="button button-form button-primary" :disabled="loaded">
                </div>
            </form>
            <div class="google-login__container">
                <GoogleLogin :loading="loaded" :handle-error="handleError" />
            </div>
            <div class="ms-login__container">
                <MSLogin :loading="loaded" :handle-error="handleError" />
            </div>
        </div>

    </div>
</template>

<script>
    import GoogleLogin from '@/components/GoogleLogin';
    import { mapState } from 'vuex';
    import MSLogin from '@/components/MSLogin';

    export default {
        name: 'Login' ,
        components: { MSLogin , GoogleLogin } ,
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
                        if (error) {
                            this.error = error;
                            this.submitted = false;
                        } else {
                            this.$router.replace('home' , () => {
                                this.submitted = false;
                            });
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

    @media only screen and (max-width: 1023px) {
        input:not([type=submit]) {
            width: 300px;
        }
    }

    h1 {
        margin: 1rem 0;
        font-family: "Roboto Light", Sans, sans-serif;
        font-weight: lighter;
        font-size: 5rem;
    }

    .login-form {
        margin-bottom: 5rem;

        & > div {
            margin: 10px 0;
            & > label {
                display: inline-block;

            }
        }
    }

    .login-form__container {
        min-width: 500px;
        width: 100%;
        min-height: 40%;
        text-align: center;
    }

    @-webkit-keyframes slide {
        100% {
            transform: translateY(10px);
        }
    }

    @keyframes slide {
        100% {
            transform: translateY(10px);
        }
    }

    .login {
        transform: translateY(0);

        animation: slide 0.5s forwards ease;
        -webkit-animation: slide 0.5s forwards ease;

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

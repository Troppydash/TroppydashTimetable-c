<template>
    <div class="register">
        <div class="p-4 register-form__container" :class="{ loading: loaded }">
            <h1>Register</h1>

            <form @submit.prevent="handleRegister" class="register-form">
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
                    <input type="submit" value="Register" class="button button-form button-primary" :disabled="loaded">
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
        name: 'Register' ,
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
            handleRegister: function () {
                this.submitted = true;
                this.$store.dispatch('handleRegisterUser' ,
                    {
                        email: this.email ,
                        password: this.password
                    })
                    .then(( { error } ) => {
                        if (error) {
                            this.submitted = false;
                            this.error = error;
                        } else {
                            this.$router.replace('home', () => {
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

    .register-form {
        margin-bottom: 5rem;

        & > div {
            margin: 10px 0;
            & > label {
                display: inline-block;
            }
        }
    }

    .register-form__container {
        min-width: 500px;
        min-height: 40%;
        text-align: center;
    }

    @keyframes slide {
        100% {
            transform: translateY(10px);
        }
    }

    @-webkit-keyframes slide {
        100% {
            transform: translateY(10px);
        }
    }

    .register {

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

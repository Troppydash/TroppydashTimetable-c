<template>
    <div></div>
<!--    <div class="googleLogin">-->
<!--        <button class="google-button button" @click="handleSocialLogin" :disabled="loading">-->
<!--            <span>Sign in with Google</span>-->
<!--            <span>-->
<!--                <img alt="Google Logo" src="../assets/google-logo.svg" />-->
<!--            </span>-->
<!--        </button>-->
<!--    </div>-->
</template>

<script>
    export default {
        name: 'GoogleLogin' ,
        props: ['loading', 'handleError'],
        methods: {
            handleSocialLogin: function () {
                this.$store.dispatch('handleUserSocialLogin', { type: 'google' })
                    .then(( { error } ) => {
                        if (error) {
                            this.handleError(error)
                        } else {
                            this.$router.replace('home');
                        }
                    });
            }
        }
    };
</script>

<style scoped lang="scss">
    .googleLogin {
        margin: 10px 0;
    }

    .google-button {

        padding: 5px;

        width: 290px;
        height: 90px;

        display: inline-flex;
        align-items: center;
        justify-content: space-around;

        img {
            height: 70px;
            width: auto;
        }

        span {
            font-size: 1.2rem;
            font-weight: lighter;
            line-height: normal;
        }

    }
</style>

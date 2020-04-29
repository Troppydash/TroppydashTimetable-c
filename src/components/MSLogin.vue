<template>
    <div class="msLogin">
        <button class="ms-button button" @click="handleSocialLogin" :disabled="loading">
            <span>Sign in with Microsoft</span>
            <span>
                <img alt="Microsoft Logo" src="../assets/ms-logo.svg" />
            </span>
        </button>
    </div>
</template>

<script>
    export default {
        name: 'MSLogin' ,
        props: ['loading' , 'handleError'] ,
        methods: {
            handleSocialLogin() {
                this.$store.dispatch('handleUserSocialLogin' , { type: 'ms' })
                    .then(( { error } ) => {
                        if (error) {
                            this.handleError(error);
                        } else {
                            this.$router.replace('home');
                        }
                    });
            }
        }
    };
</script>

<style scoped lang="scss">
    .msLogin {
        margin: 10px 0;
    }

    .ms-button {

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

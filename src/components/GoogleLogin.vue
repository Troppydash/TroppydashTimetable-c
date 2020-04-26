<template>
    <div class="googleLogin">
        <button @click="handleSocialLogin">
            <img alt="Google Logo" src="../assets/google-logo.svg" />
        </button>
    </div>
</template>

<script>
    export default {
        name: 'GoogleLogin' ,
        methods: {
            handleSocialLogin: function () {
                this.$store.dispatch('handleUserSocialLogin')
                    .then(( { error } ) => {
                        if (error) {
                            alert(error);
                        } else {
                            this.$router.replace('home');
                        }
                    });
            }
        }
    };
</script>

<style scoped>

</style>

<template>
    <div class="login">
        <h3>Login</h3>
        <form @submit.prevent="handleLogin">
            <div>
                <input type="text" placeholder="Email" v-model="email" />
            </div>
            <div>
                <input type="password" placeholder="Password" v-model="password">
            </div>

            <p v-if="error">{{ error }}</p>
            <div>
                <input type="submit" value="Login">
            </div>
        </form>
        <GoogleLogin />
    </div>
</template>

<script>
    import GoogleLogin from '@/components/GoogleLogin';

    export default {
        name: 'Login' ,
        components: { GoogleLogin } ,
        data: () => ({
            email: '' ,
            password: '' ,
            error: ''
        }) ,
        methods: {
            handleLogin: function () {
                this.$store.dispatch('handleLoginUser' , {
                    email: this.email ,
                    password: this.password
                })
                    .then(( { error } ) => {
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

<style scoped>

</style>

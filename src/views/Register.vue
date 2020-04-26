<template>
    <div class="register">
        <p>Create a new Account</p>
        <form @submit.prevent="handleRegister">
            <div>
                <input type="text" placeholder="Email" v-model="email" />
            </div>
            <div>
                <input type="password" placeholder="Password" v-model="password">
            </div>
            <p v-if="error">{{ error }}</p>
            <div>
                <input type="submit" value="Register">
            </div>
        </form>

        <GoogleLogin />
    </div>
</template>

<script>
    import GoogleLogin from '@/components/GoogleLogin';

    export default {
        name: 'Register' ,
        components: { GoogleLogin } ,
        data: () => ({
            email: '' ,
            password: '' ,
            error: ''
        }) ,
        methods: {
            handleRegister: function () {
                this.$store.dispatch('handleRegisterUser' ,
                    {
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

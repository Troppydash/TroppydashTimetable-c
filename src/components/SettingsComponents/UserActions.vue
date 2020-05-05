<template>
    <div class="userActions">
        <button @click="handleLogout" class="button button-primary">Logout</button>
        <button @click="handleDelete" class="button button-primary">Delete user</button>
        <button @click="verifyEmail" v-if="!isVerified" class="button button-primary">Verify Email</button>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'UserActions',
        computed: {

            ...mapState([
                'isVerified'
            ]) ,
        },
        methods: {
            verifyEmail() {
                this.$store.dispatch('verifyEmail');
            } ,
            handleLogout: function () {
                this.$store.dispatch('handleLogoutUser')
                    .then(() => {
                        this.$router.replace('login');
                    });
            } ,
            handleDelete: function () {
                this.$store.dispatch('handleDeleteUser')
                    .then(() => {
                        this.$router.replace('login');
                    });
            }
        }
    };
</script>

<style scoped>

</style>

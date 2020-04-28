<template>
    <div class="verifyEmailBanner" v-if="vis">
        <div>
            <p class="banner-text">You haven't verified your email yet, please go to Settings to verified your email</p>
        </div>
        <div class="action-buttons">
            <button class="button">Settings</button>
            <button class="button" @click="handleDismiss">Dismiss</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'VerifyEmailBanner',
        data() {
            return {
                vis: true
            }
        },
        methods: {
            handleDismiss() {
                this.vis = false;
            }
        }
    };
</script>

<style scoped>

    .action-buttons {
        display: flex;
        height: 100%;
        width: auto;

        align-items: center;
        justify-content: center;
    }

    @-webkit-keyframes slide {
        100% {
            transform: translateY(0);
        }
    }

    @keyframes slide {
        100% {
            transform: translateY(0);
        }
    }

    .verifyEmailBanner {
        animation: slide 0.25s forwards;
        -webkit-animation: slide 0.25s forwards;

        transform: translateY(60px);

        position: absolute;
        bottom: 0;
        left: 10%;

        width: 80%;
        height: 60px;

        padding: 0 2rem;

        background: var(--scots-grey1);
        color: white;

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .banner-text {
        font-size: 1.2rem;
        font-family: "Roboto Light", Sans ;
    }
</style>

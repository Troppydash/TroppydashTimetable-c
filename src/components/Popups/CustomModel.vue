<template>
    <div class="wrapper" v-if="isShowing" @click.self="handleCancel">
        <div class="modal-container">
            <div class="header">
                <h1>{{ title }}</h1>
            </div>
            <div class="content">
                <slot></slot>
            </div>
            <div class="footer">
                <div class="button-container">
                    <button class="button" @click="handleCancel">Cancel</button>
                    <button class="button button-primary" @click="handleComplete">Done</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CustomModel',
        props: ['isShowing', 'onComplete', 'onCancel', 'title'],
        methods: {
            handleComplete() {
                this.onComplete();
            },
            handleCancel() {
                this.onCancel();
            }
        }
    };
</script>

<style scoped lang="scss">
    .wrapper {
        width: 100vw;
        height: 100vh;
        position: fixed;
        z-index: 99;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.6);

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-container {
        width: 80%;
        height: 70%;
        max-width: 1024px;
        max-height: 70%;
        background: var(--background);
        border: 1px solid var(--scots-red);
        padding: 1rem;

        display: flex;
        flex-direction: column;
    }

    .header {
        width: 100%;
        height: auto;

        h1 {
            display: inline;
            font-size: 3rem;
            font-family: "Roboto Light", Sans, sans-serif;
            font-weight: lighter;
            margin: 0;
            border-bottom: 2px solid var(--scots-red);
        }

        margin-bottom: 10px;
    }

    @media only screen and (max-width: 1023px) {
        .modal-container {
            width: 90%;
            height: 85%;
        }

        .header {
            h1 {
                font-size: 2rem;
            }
        }
    }



    .content {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .footer {
        width: 100%;
        height: auto;

        display: flex;
        align-items: center;
        justify-content: flex-end;

        .button-container {
            button {
                margin: 0 0.25rem;
                min-width: 100px;
            }
        }
    }

</style>

<template>
    <div id="app">
        <Header />
        <router-view />
        <update-message />
    </div>
</template>

<script>
    import Header from '@/components/Header';
    import UpdateMessage from '@/components/UpdateMessage';
    import { getColorMode } from '@/StorageKeysGetters';

    export default {
        components: { UpdateMessage , Header } ,
        mounted() {
            const colorMode = getColorMode();
            document.getElementsByTagName('body')[0].className = colorMode;
        }
    };
</script>

<style lang="scss">
    :root {
        --scots-red: #b82832;
        --scots-grey1: #6b6b6b;
        --scots-grey2: #4b4b4b;
        --scots-lightgrey: #f2f2f2;
        --background: var(--normal-grey);

        --normal-grey: #282828;
        --darker-grey: #1f1f1f;
        --darkest-grey: #181818;

        --highlight: var(--scots-lightgrey);
    }

    html,
    body {
        height: 100%;
        width: 100%;
        overflow-x: hidden;

        font-family: Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        scroll-behavior: smooth;
    }


    * {
        box-sizing: border-box;
    }

    #app {
        width: 100%;
        height: 100%;
    }

    .card {
        display: inline-block;
        padding: 15px;
        box-shadow: 4px 4px 10px 3px gray;
        border-radius: 5px;
    }

    .error {
        color: red;
    }

    .image-fluid {
        width: 100%;
        height: auto;
    }

    .button-form {
        width: 200px;
        font-size: 1.2rem;
    }

    .button-reset {
        margin-left: auto;
    }

    .button-large {
        padding: 1rem 1.3rem;
        font-size: 1.2rem;
    }

    .input {
        padding: 1rem;
        height: 3rem;

        border: 1px solid var(--scots-grey2);
        margin: 5px auto;

        transition-duration: 100ms;

        &:focus {
            outline: none;
            border: 1px solid var(--scots-red);
        }

        &:hover {
            background: whitesmoke;
        }
    }

    .button {
        padding: 0.7rem 1rem;

        background: white;
        border: 1px solid var(--scots-grey2);

        &:hover {
            background: whitesmoke;
        }

        &:focus {
            outline: none;
        }

        &:active {
            background: lightgray;
            border: 1px solid var(--scots-red);
        }
    }

    .button-primary {
        background: var(--scots-red);
        color: white;

        border: none;

        &:hover {
            background: #7f0814;
            border: none;

        }

        &:active {
            background: #63050d;
            border: none;
        }
    }

    @media (prefers-color-scheme: dark) {
        body.auto {
            --scots-red: #881d24;
            --scots-grey1: #6b6b6b;
            --scots-grey2: #4b4b4b;
            --scots-lightgrey: rgba(179, 177, 177, 0.50);
            --background: var(--normal-grey);
            --highlight: rgba(181, 179, 179, 0.2);

            background: var(--normal-grey);

            color: white;

            a {
                color: white !important;
            }

            .vdp-datepicker {
                color: black !important;
            }

            .button:not(.button-primary):not(.close-button):not(.full-button),
            .input {
                color: white;
                background: var(--darkest-grey);

                &:hover {
                    background: var(--darker-grey);
                }
            }
        }
    }

    body.dark {
        --scots-red: #881d24;
        --scots-grey1: #6b6b6b;
        --scots-grey2: #4b4b4b;
        --scots-lightgrey: rgba(179, 177, 177, 0.50);
        --background: var(--normal-grey);
        --highlight: rgba(181, 179, 179, 0.2);

        background: var(--normal-grey);

        color: white;

        a {
            color: white !important;
        }

        .vdp-datepicker {
            color: black !important;
        }

        .button:not(.button-primary):not(.close-button):not(.full-button),
        .input {
            color: white;
            background: var(--darkest-grey);

            &:hover {
                background: var(--darker-grey);
            }
        }
    }

</style>

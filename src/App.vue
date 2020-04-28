<template>
    <div id="app">
        <Header />
        <router-view />
    </div>
</template>

<script>
    import Header from '@/components/Header';
    export default {
        components: { Header }
    };
</script>

<style lang="scss">
    :root {
        --scots-red: #b82832;
        --scots-grey1 : #6b6b6b;
        --scots-grey2 : #4b4b4b;
        --scots-lightgrey : #f2f2f2;
    }

    html,
    body {
        height: 100%;
        width: 100%;

        overflow-x: hidden;

        font-family: Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    * {
        box-sizing: border-box;
    }

    #app {
        width: 100%;
        height: 100%;
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

    .button-form {
        width: 200px;
        font-size: 1.2rem;
    }

    .button-large {
        padding: 1rem 1.3rem;
        font-size: 1.2rem;
    }

</style>

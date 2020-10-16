<template>
    <p class="loading_message">
        {{ randomLoadingMessage }}
    </p>
</template>

<script>
    export default {
        name: 'LoadingMessage' ,
    };
</script>

<style scoped>
    .loading_message {
        text-align: center;
        font-family: monospace, monospace;
        font-size: 1.2rem;
    }
</style>

<template>
    <div class="update-container" v-if="updateExists">
        <p>An update is available</p>
        <p>This page will refresh in <strong>{{ timer }}</strong> seconds</p>
    </div>
</template>

<script>
    import update from '@/mixins/update';

    export default {
        name: 'UpdateMessage',
        mixins: [update]
    };
</script>

<style scoped lang="scss">
    .update-container {
        background: var(--background);
        border: 2px solid var(--scots-red);
        padding: 0.25rem;

        position: absolute;
        top: 1rem;
        right: 1.25rem;

        max-width: 50vw;

        text-align: right;

        box-shadow: 1px 1px 5px gray;

        p {
            margin: 0.1rem;
        }
    }
</style>

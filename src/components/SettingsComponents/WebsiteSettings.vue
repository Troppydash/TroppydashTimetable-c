<template>
    <ul class="editMap">
        <li>
            <div class="mapsetting-label">
                <span>Site Color</span>
            </div>
            <div class="mapsetting-content">
                <select v-model="colorMode">
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
        </li>
    </ul>
</template>

<script>
    import { getColorMode } from '@/StorageKeysGetters';
    import { SetLocalStorage } from '@/Helpers';
    import { COLOR_MODE , USER_PREFERENCES } from '@/StorageKeys';

    export default {
        name: 'WebsiteSettings' ,
        data() {

            const colorMode = getColorMode();

            return {
                colorMode
            };
        } ,
        watch: {
            colorMode( newVal ) {
                SetLocalStorage(COLOR_MODE , newVal , USER_PREFERENCES);
                document.getElementsByTagName('body')[0].className = newVal;
            }
        }
    };
</script>

<style scoped lang="scss">
    select {
        font-family: "Roboto", Sans, sans-serif;
        text-align: right;
        width: auto;
        padding: 0.45rem 1rem 0.5rem;
        color: black;
        height: 34px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: var(--scots-lightgrey);

        transition: all 120ms ease-in-out;

        &:hover {
            background: #dcdcdc;
            border: 1px solid var(--scots-red);
        }
    }
</style>

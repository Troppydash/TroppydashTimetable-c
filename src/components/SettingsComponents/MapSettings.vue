<template>
    <ul class="editMap">
        <li>
            <div class="mapsetting-label">
                <span>Enable Textures</span>
            </div>
            <div class="mapsetting-content">
                <label class="switch">
                    <input type="checkbox" v-model="enableTextures">
                    <span class="slider"></span>
                </label>
            </div>
        </li>

        <li>
            <div class="mapsetting-label">
                <span>Open map on startup</span>
            </div>
            <div class="mapsetting-content">
                <label class="switch">
                    <input type="checkbox" v-model="openOSU">
                    <span class="slider"></span>
                </label>
            </div>
        </li>

        <li>
            <div class="mapsetting-label">
                <span>Map X-Offset</span>
            </div>
            <div class="mapsetting-content">
                <div class="counter">
                    <i class="fas fa-minus fa-lg" @click="decrXOffset"></i>
                    <span>{{ mapXOffset }}</span>
                    <i class="fas fa-plus fa-lg" @click="incrXOffset"></i>
                </div>
            </div>
        </li>
        <li>
            <div class="mapsetting-label">
                <span>Map Y-Offset</span>
            </div>
            <div class="mapsetting-content">
                <div class="counter">
                    <i class="fas fa-minus fa-lg" @click="decrYOffset"></i>
                    <span>{{ mapYOffset }}</span>
                    <i class="fas fa-plus fa-lg" @click="incrYOffset"></i>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
    import { getEnableTexture , getMapXOffset , getMapYOffset , getOpenOSU } from '@/StorageKeysGetters';
    import { clamp , SetLocalStorage } from '@/Helpers';
    import {
        DISPLAY_PREVIOUS_DAYS ,
        ENABLE_TEXTURES ,
        MAP_XOFFSET ,
        MAP_YOFFSET , OPEN_OSU ,
        USER_PREFERENCES
    } from '@/StorageKeys';

    export default {
        name: 'MapSettings',
        data() {
            const enableTextures = getEnableTexture();
            const openOSU = getOpenOSU();
            const mapXOffset = getMapXOffset();
            const mapYOffset = getMapYOffset();
            return {
                enableTextures,
                mapXOffset,
                mapYOffset,
                openOSU,
            }
        },
        watch: {

            enableTextures(isOn) {
                if (isOn) {
                    SetLocalStorage(ENABLE_TEXTURES , 'true' , USER_PREFERENCES);
                } else {
                    SetLocalStorage(ENABLE_TEXTURES , 'false' , USER_PREFERENCES);
                }
            },
            openOSU(isOn) {
                if (isOn) {
                    SetLocalStorage(OPEN_OSU , 'true' , USER_PREFERENCES);
                } else {
                    SetLocalStorage(OPEN_OSU , 'false' , USER_PREFERENCES);
                }
            },
            mapXOffset(value) {
                SetLocalStorage(MAP_XOFFSET, value, USER_PREFERENCES);
            },
            mapYOffset(value) {
                SetLocalStorage(MAP_YOFFSET, value, USER_PREFERENCES);
            },
        },
        methods: {
            incrXOffset() {
                this.mapXOffset++;
                this.mapXOffset = clamp(this.mapXOffset , -50 , 50);
            } ,
            decrXOffset() {
                this.mapXOffset--;
                this.mapXOffset = clamp(this.mapXOffset , -50 , 50);
            },
            incrYOffset() {
                this.mapYOffset++;
                this.mapYOffset = clamp(this.mapYOffset , -50 , 50);
            } ,
            decrYOffset() {
                this.mapYOffset--;
                this.mapYOffset = clamp(this.mapYOffset , -50 , 50);
            }
        }
    };
</script>

<style scoped lang="scss">
    .editTable {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 0.5rem;

            &:hover {
                background: var(--scots-lightgrey);
            }
        }
    }
</style>

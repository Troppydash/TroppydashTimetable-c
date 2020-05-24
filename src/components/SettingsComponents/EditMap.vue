<template>
    <ul class="editMap">
        <li>
            <div class="mapsetting-label">
                <span>Map Quality</span>
            </div>
            <div class="mapsetting-content">
                <div class="counter">
                    <i class="fas fa-minus fa-lg" @click="decrShadowQuality"></i>
                    <span>{{ shadowQuality }}</span>
                    <i class="fas fa-plus fa-lg" @click="incrShadowQuality"></i>
                </div>
            </div>
        </li>
        <li>
            <div class="mapsetting-label">
                <span>Shadows</span>
            </div>
            <div class="mapsetting-content">
                <label class="switch">
                    <input type="checkbox" v-model="enableShadows">
                    <span class="slider"></span>
                </label>
            </div>
        </li>
        <li>
            <div class="mapsetting-label">
                <span>Smooth Camera</span>
            </div>
            <div class="mapsetting-content">
                <label class="switch">
                    <input type="checkbox" v-model="enableSmoothCamera">
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
        <li>
            <div class="mapsetting-label">
                <span>Auto Rotate Camera</span>
            </div>
            <div class="mapsetting-content">
                <label class="switch">
                    <input type="checkbox" v-model="enableAutoRotate">
                    <span class="slider"></span>
                </label>
            </div>
        </li>
        <li v-if="enableAutoRotate">
            <div class="mapsetting-label">
                <span>Rotate Delay</span>
            </div>
            <div class="mapsetting-content">
                <div class="counter">
                    <i class="fas fa-minus fa-lg" @click="decrTimeout"></i>
                    <span>{{ enableAutoRotateTimeout }}</span>
                    <i class="fas fa-plus fa-lg" @click="incrTimeout"></i>
                </div>
            </div>
        </li>
        <li>
            <button class="button button-primary button-reset" @click="resetMapSettings">Reset</button>
        </li>

    </ul>
</template>

<script>
    import {
        AUTO_ROTATE ,
        AUTO_ROTATE_TIMEOUT ,
        MAP_QUALITY , MAP_XOFFSET ,
        SHADOWS_ON ,
        SMOOTH_CAMERA ,
        USER_PREFERENCES
    } from '@/StorageKeys';
    import { clamp , GetFromLocalStorageOrDefault , SetLocalStorage } from '@/Helpers';
    import {
        getAutoRotate , getAutoRotateTimeout ,
        getMapXOffset ,
        getMapYOffset ,
        getQuality ,
        getShadows ,
        getSmoothCamera
    } from '@/StorageKeysGetters';

    export default {
        name: 'EditMap' ,
        data() {
            const shadows = getShadows();
            const quality = getQuality();

            const mapXOffset = getMapXOffset();
            const mapYOffset = getMapYOffset();

            const smooth = getSmoothCamera();

            const autoRotate = getAutoRotate();
            const autoRotateTimeout = getAutoRotateTimeout();

            return {
                enableShadows: shadows ,
                shadowQuality: quality ,
                enableSmoothCamera: smooth ,
                enableAutoRotate: autoRotate ,
                enableAutoRotateTimeout: autoRotateTimeout ,
                mapXOffset: mapXOffset,
                mapYOffset: mapYOffset,
            };
        } ,
        watch: {
            enableShadows( isOn ) {
                if (isOn) {
                    SetLocalStorage(SHADOWS_ON , 'true' , USER_PREFERENCES);
                } else {
                    SetLocalStorage(SHADOWS_ON , 'false' , USER_PREFERENCES);
                }
            } ,
            shadowQuality( quality ) {
                SetLocalStorage(MAP_QUALITY , quality , USER_PREFERENCES);
            } ,
            enableSmoothCamera( isOn ) {
                if (isOn) {
                    SetLocalStorage(SMOOTH_CAMERA , 'true' , USER_PREFERENCES);
                } else {
                    SetLocalStorage(SMOOTH_CAMERA , 'false' , USER_PREFERENCES);
                }
            } ,
            enableAutoRotateTimeout( timeout ) {
                SetLocalStorage(AUTO_ROTATE_TIMEOUT , timeout , USER_PREFERENCES);
            } ,
            enableAutoRotate( isOn ) {
                if (isOn) {
                    SetLocalStorage(AUTO_ROTATE , 'true' , USER_PREFERENCES);
                } else {
                    SetLocalStorage(AUTO_ROTATE , 'false' , USER_PREFERENCES);
                }
            }
        } ,
        methods: {
            resetData() {
                const shadows = !(window.innerWidth < 1024);
                const quality = 5;
                const smooth = true;
                const autoRotate = false;
                const autoRotateTimeout = 3;
                const mapXOffset = 0;
                const mapYOffset = 0;

                this.mapXOffset = mapXOffset;
                this.mapYOffset = mapYOffset;
                this.enableShadows = shadows;
                this.shadowQuality = quality;
                this.enableSmoothCamera = smooth;
                this.enableAutoRotate = autoRotate;
                this.enableAutoRotateTimeout = autoRotateTimeout;
            } ,
            resetMapSettings() {
                // RemoveFromLocalStorage(SMOOTH_CAMERA , USER_PREFERENCES);
                // RemoveFromLocalStorage(AUTO_ROTATE , USER_PREFERENCES);
                // RemoveFromLocalStorage(AUTO_ROTATE_TIMEOUT , USER_PREFERENCES);
                // RemoveFromLocalStorage(MAP_QUALITY , USER_PREFERENCES);
                // RemoveFromLocalStorage(SHADOWS_ON , USER_PREFERENCES);
                this.resetData();
            } ,
            incrShadowQuality() {
                if (this.shadowQuality < 10) {
                    this.shadowQuality++;
                }
                if (this.shadowQuality === 2) {
                    this.enableShadows = true;
                }
            } ,
            decrShadowQuality() {
                if (this.shadowQuality > 1) {
                    this.shadowQuality--;
                }
                if (this.shadowQuality === 1) {
                    this.enableShadows = false;
                }
            } ,
            incrTimeout() {
                this.enableAutoRotateTimeout++;
                this.enableAutoRotateTimeout = clamp(this.enableAutoRotateTimeout , 1 , 10);
            } ,
            decrTimeout() {
                this.enableAutoRotateTimeout--;
                this.enableAutoRotateTimeout = clamp(this.enableAutoRotateTimeout , 1 , 10);
            },
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

    .mapsetting-content {
    }

    .counter {
        height: 27px;

        display: flex;
        align-items: center;
        justify-content: center;

        position: relative;

        span {
            margin: 0 0.5rem;
            user-select: none;

        }

        i {
            cursor: pointer;
            color: var(--scots-red);

            &:hover {
                color: #7f0814;
            }
        }
    }

    .mapsetting-label {
        font-size: 1.15rem;
    }

    .editMap {
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


    /* The switch - the box around the slider */
    .switch {
        position: relative;
        display: inline-block;
        width: 47px;
        height: 27px;
    }

    /* Hide default HTML checkbox */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .2s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 19px;
        width: 19px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .2s;
        transition: .2s;
    }

    input:checked + .slider {
        background-color: var(--scots-red);
    }

    input:focus + .slider {
        box-shadow: 0 0 1px var(--scots-red);
    }

    input:hover:checked + .slider {
        background: #7f0814;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(19px);
        -ms-transform: translateX(19px);
        transform: translateX(19px);
    }
</style>

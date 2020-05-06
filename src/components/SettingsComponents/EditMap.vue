<template>
    <ul class="editMap">
        <li>
            <div class="mapsetting-label">
                <span>Enable Shadows?</span>
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
    </ul>
</template>

<script>
    import { MAP_QUALITY , SHADOWS_ON , USER_PREFERENCES } from '@/StorageKeys';
    import { clamp , GetFromLocalStorageOrDefault , SetLocalStorage } from '@/Helpers';

    export default {
        name: 'EditMap' ,
        data() {
            const shadows = GetFromLocalStorageOrDefault(SHADOWS_ON , !(window.innerWidth < 1024) , USER_PREFERENCES, value => value === 'true');
            const quality = GetFromLocalStorageOrDefault(MAP_QUALITY , 5 ,  USER_PREFERENCES,value => {
                return clamp(parseInt(value), 1, 10);
            });
            return {
                enableShadows: shadows ,
                shadowQuality: quality
            };
        } ,
        watch: {
            enableShadows( isOn ) {
                if (isOn) {
                    SetLocalStorage(SHADOWS_ON , 'true', USER_PREFERENCES);
                } else {
                    SetLocalStorage(SHADOWS_ON , 'false', USER_PREFERENCES);
                }
            } ,
            shadowQuality( quality ) {
                SetLocalStorage(MAP_QUALITY, quality, USER_PREFERENCES);
            }
        } ,
        methods: {
            incrShadowQuality() {
                if (this.shadowQuality < 10) {
                    this.shadowQuality++;
                }
                if (this.shadowQuality > 1) {
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

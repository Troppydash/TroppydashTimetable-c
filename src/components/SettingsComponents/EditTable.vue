<template>
    <ul class="editTable">
        <li>
            <div class="mapsetting-label">
                <span>Display Previous Days</span>
            </div>
            <div class="mapsetting-content">
                <label class="switch">
                    <input type="checkbox" v-model="displayNearbyWeeks">
                    <span class="slider"></span>
                </label>
            </div>
        </li>
        <li>
            <div class="mapsetting-label">
                <span>Disable Highlighting Like Lessons</span>
            </div>
            <div class="mapsetting-content">
                <label class="switch">
                    <input type="checkbox" v-model="disableHighlighting">
                    <span class="slider"></span>
                </label>
            </div>
        </li>
    </ul>
</template>

<script>
    import {
        DISABLE_HIGHLIGHTING_LIKE_TERMS ,
        DISPLAY_PREVIOUS_DAYS ,
        USER_PREFERENCES
    } from '@/StorageKeys';
    import { clamp , GetFromLocalStorageOrDefault , SetLocalStorage } from '@/Helpers';

    export default {
        name: 'EditTable' ,
        data() {
            const displayNearbyWeeks = GetFromLocalStorageOrDefault(DISPLAY_PREVIOUS_DAYS , false , USER_PREFERENCES , value => value === 'true');
            const disableHighlighting = GetFromLocalStorageOrDefault(DISABLE_HIGHLIGHTING_LIKE_TERMS , false , USER_PREFERENCES , value => value === 'true');

            return {
                displayNearbyWeeks,
                disableHighlighting
            };
        } ,
        watch: {
            displayNearbyWeeks( isOn ) {
                // here to notify vuex getter to change
                this.$store.state.timetable.data = [...this.$store.state.timetable.data];

                if (isOn) {
                    SetLocalStorage(DISPLAY_PREVIOUS_DAYS , 'true' , USER_PREFERENCES);
                } else {
                    SetLocalStorage(DISPLAY_PREVIOUS_DAYS , 'false' , USER_PREFERENCES);
                }
            },
            disableHighlighting( isOn ) {
                if (isOn) {
                    SetLocalStorage(DISABLE_HIGHLIGHTING_LIKE_TERMS , 'true' , USER_PREFERENCES);
                } else {
                    SetLocalStorage(DISABLE_HIGHLIGHTING_LIKE_TERMS , 'false' , USER_PREFERENCES);
                }
            },
        } ,
        methods: {}
    };
</script>

<style scoped lang="scss">

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

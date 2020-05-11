<template>
    <div class="displayCanvas" :class="{ 'displayCanvas__transp': closed }">
        <div class="wrapper">
            <div class="close-button__container"
                 :class="{ 'closed-button__closed': closed, 'closed-button__open': !closed }">
                <button class="button close-button" :class="{ 'button__closed': closed, 'button__open': !closed }"
                        @click="toggleCanvas">
                    <i class="fa fa-angle-left" v-if="closed"></i>
                    <i class="fa fa-times" v-else></i>
                </button>
            </div>
            <div id="schoolMap" :class="{ closed: closed }"></div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {
        AUTO_ROTATE ,
        AUTO_ROTATE_TIMEOUT ,
        MAP_QUALITY ,
        SHADOWS_ON ,
        SMOOTH_CAMERA ,
        USER_PREFERENCES
    } from '@/StorageKeys';
    import { clamp , GetFromLocalStorageOrDefault } from '@/Helpers';
    import { MapRenderer } from '@/lib/MapRenderer';

    export default {
        name: 'DisplayCanvas' ,
        props: ['isMobile' , 'toggleCanvas' , 'closed'] ,
        data() {
            return {
                location: null ,

                mapRenderer: null ,
            };
        } ,
        computed: {
            ...mapGetters([
                'currentLesson'
            ]) ,
            data() {
                return this.$store.state.timetable.data;
            } ,
            isShadowsOn() {
                return GetFromLocalStorageOrDefault(SHADOWS_ON , !this.isMobile , USER_PREFERENCES , value => value === 'true');
            } ,
            mapQuality() {
                return GetFromLocalStorageOrDefault(MAP_QUALITY , 5 , USER_PREFERENCES , value => {
                    return clamp(parseInt(value) , 1 , 10);
                });
            } ,
            isSmoothCamera() {
                return GetFromLocalStorageOrDefault(SMOOTH_CAMERA , false , USER_PREFERENCES , value => value === 'true');
            } ,
            isAutoRotate() {
                return GetFromLocalStorageOrDefault(AUTO_ROTATE , false , USER_PREFERENCES , value => value === 'true');
            } ,
            autoRotateTimeout() {
                if (!this.isAutoRotate) {
                    return -1;
                }
                return GetFromLocalStorageOrDefault(AUTO_ROTATE_TIMEOUT , 5 , USER_PREFERENCES , value => {
                    return clamp(parseInt(value) , 1 , 10);
                });
            }
        } ,
        watch: {
            data( newData ) {
                if (newData) {
                    this.tryFocusObject();
                }
            } ,
            isMobile( isMobile ) {
                let width = 600 , height = width / 16 * 9;
                if (isMobile) {
                    width = 300;
                    height = width / 16 * 9;
                }

                this.mapRenderer.changeSize({
                    width ,
                    height
                });
            } ,
        } ,
        methods: {
            tryFocusObject() {
                const val = this.$store.state.timetable.data;
                const currentLesson = this.currentLesson;
                if (!currentLesson) {
                    return;
                }
                if (val.length < 1) {
                    return;
                }
                if (!val[currentLesson[0]]) {
                    return;
                }
                if (!val[this.currentLesson[0]].periodData[currentLesson[1] - 1]) {
                    return;
                }
                if (!val[currentLesson[0]].periodData[currentLesson[1] - 1].AdditionalData.Room) {
                    return;
                }
                this.mapRenderer.focusObject(val[currentLesson[0]].periodData[currentLesson[1] - 1].AdditionalData.Room);
            } ,
            focusObject( roomName ) {
                this.mapRenderer.focusObject(roomName);
            }
        } ,
        mounted() {
            this.mapRenderer = new MapRenderer(
                document.getElementById('schoolMap') ,
                {
                    haveShadow: this.isShadowsOn ,
                    mapQuality: this.mapQuality ,
                    haveSmoothCamera: this.isSmoothCamera ,
                    haveAutoRotate: this.isAutoRotate ,
                    autoRotateTimeout: this.autoRotateTimeout
                } ,
                {
                    width: 600 ,
                    height: 600 / 16 * 9
                }
            );
            this.mapRenderer.loadMap()
                .then(() => {
                    // success
                    console.log('Map Successfully loaded');
                    if (this.mapRenderer) {
                        console.log('Setting User Location');
                        this.mapRenderer.getAndSetUserLocation();
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        } ,
        beforeDestroy() {
            this.mapRenderer.cleanUp()
                .then(() => {
                    this.mapRenderer = null;
                });
        }
    };
</script>

<style scoped lang="scss">

    .close-button__container {
        pointer-events: all;
    }

    .displayCanvas__transp {
        pointer-events: none;
    }

    .closed-button__closed {
        color: black;
        position: absolute;
        bottom: 1px;
        right: 1px;

        top: initial;
    }

    .button__open {
        color: whitesmoke;

        &:hover {
            color: lightgray;
        }
    }

    .button__closed {
        color: black;
        background: #d3d3d3 !important;
        border-radius: 50%;

        &:hover {
            color: gray;
        }
    }

    .closed-button__open {
        position: absolute;
        top: 1px;
        right: 1px
    }

    .close-button {
        padding: 0.75rem 1rem;
        background: none;
        border: none;
    }

    .displayCanvas {
        position: absolute;
        bottom: 1rem;
        right: 2rem;
        height: auto;
    }

    #schoolMap {
        width: 100%;
        height: 342px;

        box-shadow: 0 0 5px 2px gray;
        border: 2px solid var(--scots-red);
    }

    .closed {
        transition: all .25s ease;
        transform: translateX(1000px);
        visibility: hidden;
    }

    @media only screen and (max-width: 1023px) {
        #schoolMap {
            width: 100%;
            height: 172.75px;
        }

        .closed {
            display: none;
            transition: none;
            transform: none;
        }

        /*.displayCanvas:hover:not(:focus):not(:active) {*/
        /*    transition-duration: initial;*/
        /*    transition-delay: initial;*/

        /*    opacity: initial;*/
        /*}*/
    }
</style>

<template>
    <div class="displayCanvas" :class="{ 'displayCanvas__transp': closed, 'd-fullscreen': isFullScreen  }">
        <div class="wrapper">
            <div class="close-button__container"
                 :class="{ 'closed-button__closed': closed, 'closed-button__open': !closed }"
                v-if="!isFullScreen">
                <button class="button close-button" :class="{ 'button__closed': closed, 'button__open': !closed }"
                        @click="toggleCanv">
                    <i class="fa fa-angle-left" v-if="closed"></i>
                    <i class="fa fa-times" v-else></i>
                </button>
            </div>
            <div class="full-button__container" v-if="!closed">
                <button class="button full-button" @click="toggleFullScreen">
                    <i class="fas fa-compress"></i>
                </button>
            </div>
            <div id="schoolMap" :class="{ closed: closed, 'fullscreen': isFullScreen }"></div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { MapRenderer } from '@/lib/MapRenderer';
    import {
        getAutoRotate ,
        getAutoRotateTimeout , getMapXOffset , getMapYOffset ,
        getQuality ,
        getShadows ,
        getSmoothCamera
    } from '@/StorageKeysGetters';

    export default {
        name: 'DisplayCanvas' ,
        props: ['isMobile' , 'toggleCanvas' , 'closed'] ,
        data() {
            return {
                location: null ,
                mapRenderer: null ,
                isFullScreen: false
            };
        } ,
        computed: {
            ...mapGetters([
                'currentLesson'
            ]) ,
            data() {
                return this.$store.state.timetable.data;
            } ,
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
            toggleFullScreen() {
                this.isFullScreen = !this.isFullScreen;
                this.mapRenderer.toggleFullScreen(this.isFullScreen);
            } ,
            toggleCanv() {
                if (getAutoRotate()) {
                    const closed = document.getElementById('schoolMap').classList.contains('closed');
                    if (closed) {
                        this.mapRenderer.startRotationTimer();
                    } else {
                        this.mapRenderer.stopRotationTimer();
                    }
                }
                this.toggleCanvas();
            } ,
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
                if (!val[currentLesson[0]].periodData[currentLesson[1] - 1]) {
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
                    haveShadow: getShadows(),
                    mapQuality: getQuality() ,
                    haveSmoothCamera: getSmoothCamera() ,
                    haveAutoRotate: getAutoRotate() ,
                    autoRotateTimeout: getAutoRotateTimeout()
                } ,
                {
                    width: 600 ,
                    height: 600 / 16 * 9
                },
                {
                    xOffset: getMapXOffset(),
                    yOffset: getMapYOffset(),
                }
            );
            this.mapRenderer.loadMap()
                .then(() => {
                    // success
                    if (this.mapRenderer) {
                        this.mapRenderer.getAndSetUserLocation();
                    }
                })
                .catch(err => {
                    console.error(err);
                });
            window.onresize = this.mapRenderer.onresize;
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

    .full-button__container {
        pointer-events: all;

        position: absolute;
        top: 1px;
        left: 2px;
    }

    .full-button {
        color: white;

        background: none;
        border: none;
        padding: 0.75rem 1rem;
    }


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

    .d-fullscreen {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
        right: 0 !important;

        overflow: hidden;
    }

    .fullscreen {
        width: 100vw !important;
        height: 100vh !important;
        border: none !important;
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

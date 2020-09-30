<template>
    <div class="displayCanvas" :class="{ 'displayCanvas__transp': closed, 'd-fullscreen': isFullScreen  }">
        <div class="wrapper">
            <div class="close-button__container"
                 :class="{ 'closed-button__closed': closed, 'closed-button__open': !closed }"
                 v-if="!isFullScreen">
                <button class="button close-button" :class="{ 'button__closed': closed, 'button__open': !closed }"
                        @click="toggleCanv">
                    <fa-icon v-if="closed" icon="angle-left" />
                    <fa-icon v-else icon="times" />
                </button>
            </div>
            <div class="full-button__container" v-if="!closed">
                <button class="button full-button" @click="toggleFullScreen">
                    <fa-icon icon="expand" v-if="!isFullScreen"/>
                    <fa-icon icon="compress" v-else/>
                </button>
            </div>
            <div id="schoolMap" :class="{ closed: closed, 'fullscreen': isFullScreen }"></div>
            <div class="tooltip"
                 :style="{ display: tooltip.display ? 'block' : 'none', top: tooltip.position.y + 'px', left: tooltip.position.x + 'px' }">
                <span>{{ tooltip.data.text }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { MapRenderer , TimeOfDay } from '@/lib/MapRenderer';
    import {
        getAutoRotate ,
        getAutoRotateTimeout , getEnableTexture , getMapXOffset , getMapYOffset , getOpenOSU ,
        getQuality ,
        getShadows ,
        getSmoothCamera , getTOD
    } from '@/StorageKeysGetters';

    export default {
        name: 'DisplayCanvas' ,
        props: ['isMobile' , 'toggleCanvas' , 'closed'] ,
        data() {
            const openOSU = getOpenOSU();
            return {
                openOSU ,
                location: null ,
                mapRenderer: null ,
                isFullScreen: false ,
                loaded: false ,

                tooltip: {
                    position: {
                        x: -100 ,
                        y: -100 ,
                    } ,
                    data: {
                        text: '' ,
                        description: '' ,
                    } ,
                    display: false
                }
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
            isFullScreen( value ) {
                if (value) {
                    if (!this.isMobileBrowser()) {
                        this.tooltip.display = true;
                        this.tooltip.position = { x: -100 , y: -100 };
                        return;
                    }
                }
                this.tooltip.display = false;

            } ,
            closed( newData ) {
                // TODO: Make this toggleable
                if (newData) {
                    this.cleanupMap();
                } else {
                    this.loadMap();
                }
            } ,
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

                if (this.mapRenderer) {
                    this.mapRenderer.changeSize({
                        width ,
                        height
                    });
                }
            } ,
        } ,
        methods: {
            isMobileBrowser() {
                let check = false;
                (function ( a ) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0 , 4))) check = true;
                })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            } ,
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
                if (this.closed) {
                    return;
                }
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
                if (this.closed) {
                    return;
                }
                this.mapRenderer.focusObject(roomName);
            } ,
            handleHover( ev ) {
                // console.log(ev);
                const { x , y } = ev.position;
                const { name } = ev.mesh;
                this.tooltip.data = { ...this.tooltip.data , text: name.split('_').join(' ') };
                this.tooltip.position = { ...this.tooltip.position , x: x + 5 , y: y - 25 };
                this.tooltip.display = true;
            } ,
            handleOnLeave() {
                this.tooltip.display = false;
            } ,
            loadMap() {
                const width = !this.isMobile ? 600 : 300;
                this.mapRenderer = new MapRenderer(
                    document.getElementById('schoolMap') ,
                    {
                        haveShadow: getShadows() ,
                        mapQuality: getQuality() ,
                        haveSmoothCamera: getSmoothCamera() ,
                        haveAutoRotate: getAutoRotate() ,
                        autoRotateTimeout: getAutoRotateTimeout()
                    } ,
                    {
                        width: width ,
                        height: width / 16 * 9
                    } ,
                    {
                        xOffset: getMapXOffset() ,
                        yOffset: getMapYOffset() ,
                    } ,
                    getEnableTexture() ? '/maps/compressed/scots.gltf' : '/maps/compressed/scots-notex.gltf' ,
                    undefined ,
                    getTOD()
                );
                this.mapRenderer.loadMap(this.handleHover , this.handleOnLeave)
                    .then(() => {
                        // success
                        if (this.mapRenderer) {
                            this.mapRenderer.getAndSetUserLocation();
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
                window.addEventListener('resize' , this.mapRenderer.onresize);
            } ,
            cleanupMap() {
                window.removeEventListener('resize' , this.mapRenderer.onresize);
                this.mapRenderer.cleanUp()
                    .then(() => {
                        this.mapRenderer = null;
                    });
            }
        } ,
        mounted() {
            if (this.loaded) {
                return;
            }
            this.loaded = true;
            this.loadMap();

            if (!this.openOSU) {
                this.toggleCanv();
            }
        } ,
        beforeDestroy() {
            if (this.mapRenderer) {
                this.cleanupMap();
            }
        }
    };
</script>

<style scoped lang="scss">

    .tooltip {
        position: absolute;

        background: #f2f2f2;
        color: var(--scots-grey2);
        padding: 0.2rem;

        box-shadow: 1px 1px 4px var(--scots-grey2);

        transition-duration: 100ms;
        pointer-events: none;
        //transition-delay: 100ms;
    }

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

        &:hover {
            color: gray;
        }
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

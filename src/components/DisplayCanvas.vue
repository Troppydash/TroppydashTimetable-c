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
    // import * as THREE from 'three';
    // import TWEEN from '@tweenjs/tween.js';
    // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    // import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
    // import similarity from 'similarity';
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

    // let camera = null;
    // let controls = null;
    // let scene = null;
    // let renderer = null;
    //
    // let models = [];

    export default {
        name: 'DisplayCanvas' ,
        props: ['isMobile' , 'toggleCanvas' , 'closed'] ,
        data() {
            return {
                loading: true ,
                error: '' ,
                lastSelected: -1 ,

                location: null ,
                shouldFocus: false ,

                unmounted: false ,

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
                    this.shouldFocus = true;
                }
            } ,
            isMobile( isMobile ) {
                let width = 600 , height = width / 16 * 9;
                if (isMobile) {
                    width = 300;
                    height = width / 16 * 9;
                }

                // renderer.setSize(width , height);
            } ,
        } ,
        methods: {
            // focusFromCode( code ) {
            //     if (!code) {
            //         return;
            //     }
            //     this.clearLastSelected();
            //
            //     // Get the most likely name
            //     let susIndex = [];
            //     code = code.toLowerCase();
            //     models.forEach(( model , index ) => {
            //         let temp = [];
            //         model.name.split('_').forEach(( value ) => {
            //             const sim = similarity(value.toLowerCase() , code);
            //             temp.push({
            //                 percent: sim ,
            //                 index
            //             });
            //         });
            //         if (temp.length > 0) {
            //             temp = temp.sort(( x , y ) => y.percent - x.percent);
            //             susIndex.push(temp[0]);
            //         }
            //     });
            //     susIndex = susIndex.sort(( x , y ) => y.percent - x.percent);
            //     const selectedIndex = susIndex[0].index;
            //
            //     this.lastSelected = selectedIndex;
            //     models[selectedIndex].material.color.set('#b82832');
            //
            //
            //     const from = camera.position.clone();
            //
            //     const to = models[selectedIndex].position.clone();
            //
            //     const toOffset = {
            //         x: from.x - to.x > 0 ? to.x + 30 : to.x - 30 ,
            //         y: to.y + 45 ,
            //         z: from.z - to.z > 0 ? to.z + 30 : to.z - 30
            //     };
            //
            //     if (this.isAutoRotate) {
            //         controls.autoRotate = false;
            //         setTimeout(() => {
            //             controls.autoRotate = true;
            //         }, this.autoRotateTimeout * 1000);
            //     }
            //
            //     if (this.isSmoothCamera) {
            //         new TWEEN.Tween(from)
            //             .to(toOffset , 1000)
            //             .easing(TWEEN.Easing.Exponential.InOut)
            //             .onUpdate(function () {
            //                 camera.position.set(from.x , from.y , from.z);
            //                 camera.lookAt(new THREE.Vector3(to.x , to.y , to.z));
            //                 controls.target = new THREE.Vector3(to.x , to.y , to.z);
            //             })
            //             .onComplete(function () {
            //                 camera.position.set(toOffset.x , toOffset.y , toOffset.z);
            //                 camera.lookAt(new THREE.Vector3(to.x , to.y , to.z));
            //                 controls.target = new THREE.Vector3(to.x , to.y , to.z);
            //
            //             })
            //             .start();
            //     } else {
            //         controls.target = to;
            //         camera.position.set(toOffset.x , toOffset.y , toOffset.z);
            //     }
            // } ,
            // clearLastSelected() {
            //     if (this.lastSelected === -1) {
            //         return;
            //     }
            //     models[this.lastSelected].material.color.set('#fff');
            // } ,
            // measure( originLat , originLong , lat , long ) {  // generally used geo measurement function
            //     const latdif = originLat - lat;
            //     const longdif = originLong - long;
            //
            //     return {
            //         lat: latdif * 111.32 * 1000 ,
            //         long: longdif * 40075 * Math.cos(latdif) / 360 * 1000 ,
            //     };
            // } ,
            // setUserInCanvas() {
            //     if (!this.location) {
            //         return;
            //     }
            //
            //     const hodgeLat = -41.328232;
            //     const hodgeLong = 174.818269;
            //     const { lat , long } = this.measure(hodgeLat , hodgeLong , this.location.latitude , this.location.longitude);
            //     if (lat > 1000 || long > 1000) {
            //         return;
            //     }
            //
            //     if (models.filter(m => m.name === 'Player').length > 0) {
            //         // Already exists, repositioning
            //         return;
            //     }
            //
            //     const geometry = new THREE.BoxGeometry(5 , 14 , 5);
            //     const cubeMeterial = new THREE.MeshNormalMaterial();
            //
            //     const mesh = new THREE.Mesh(geometry , cubeMeterial);
            //     mesh.name = 'Player';
            //
            //     mesh.position.x = (-long * 0.65) - 68;
            //     mesh.position.z = (lat * 0.92) - 22;
            //     mesh.position.y = 30;
            //
            //     scene.add(mesh);
            //
            // } ,
            tryFocusFromCode() {
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
            // getLocation() {
            //     if (navigator.geolocation) {
            //         navigator.geolocation.getCurrentPosition(position => {
            //             this.location = position.coords;
            //             this.setUserInCanvas();
            //         });
            //     }
            // } ,
            // removeOldCanvas() {
            //     const targetElement = document.getElementById('schoolMap');
            //     if (!targetElement) {
            //         return;
            //     }
            //     targetElement.innerHTML = '';
            //
            //     camera = null;
            //     controls = null;
            //     scene = null;
            //     renderer = null;
            //     models = [];
            //     this.loading = false;
            //     this.error = '';
            // } ,
            // init() {
            //     this.removeOldCanvas();
            //     // Init ThreeJS
            //     const width = 600 , height = width / 16 * 9;
            //
            //     const isShadowsOn = this.isShadowsOn;
            //     const mapQuality = this.mapQuality;
            //
            //     const targetElement = document.getElementById('schoolMap');
            //     renderer = new THREE.WebGLRenderer({
            //         antialias: mapQuality > 3 ,
            //         powerPreference: mapQuality > 8 ? 'high-performance' : 'default'
            //     });
            //     renderer.setSize(width , height);
            //
            //     if (isShadowsOn) {
            //         renderer.shadowMap.enabled = true;
            //         // renderer.shadowMapSize = 20;
            //     }
            //
            //     targetElement.appendChild(renderer.domElement);
            //
            //     scene = new THREE.Scene();
            //     scene.background = new THREE.Color('#87ceeb');
            //     camera = new THREE.PerspectiveCamera(45 , 16 / 9 , 0.1 , 5000);
            //
            //     camera.position.z = 200;
            //     camera.position.y = 200;
            //     scene.add(camera);
            //
            //     const light = new THREE.SpotLight('#defaf8' , 0.3);
            //     light.position.set(0 , 300 , 0);
            //     light.target.position.set(0 , 0 , 0);
            //
            //     if (isShadowsOn) {
            //         light.castShadow = true;
            //         light.shadow.camera.near = 0.008;
            //         light.shadow.camera.far = 300;
            //         light.shadow.mapSize.width = 500;  // default
            //         light.shadow.mapSize.height = 500;
            //         light.shadow.bias = -0.0000005;
            //     }
            //
            //     scene.add(light);
            //     // scene.add(new THREE.CameraHelper(light.shadow.camera));
            //
            //     const sidelight = new THREE.SpotLight('#defaf8' , 1);
            //     sidelight.position.set(70 , 150 , 70);
            //
            //     if (isShadowsOn) {
            //         sidelight.castShadow = true;
            //         sidelight.shadow.camera.near = 0.008;
            //         sidelight.shadow.camera.far = 500;
            //         sidelight.shadow.mapSize.width = (mapQuality - 1) ** 2 * 150;
            //         sidelight.shadow.mapSize.height = (mapQuality - 1) ** 2 * 150;
            //         sidelight.shadow.bias = -0.0000005;
            //     }
            //
            //     scene.add(sidelight);
            //     // scene.add(new THREE.CameraHelper(sidelight.shadow.camera));
            //
            //     const ambientLight = new THREE.AmbientLight('#fff' , 0.2);
            //     scene.add(ambientLight);
            //
            //     controls = new OrbitControls(camera , renderer.domElement);
            //     controls.rotateSpeed = 1.0;
            //     controls.zoomSpeed = 3;
            //     controls.panSpeed = 2;
            //     controls.enableZoom = true;
            //
            //     if (this.isSmoothCamera) {
            //         controls.enableDamping = true;
            //     }
            //
            //     if (this.isAutoRotate) {
            //         setTimeout(() => {
            //             controls.autoRotate = true;
            //         } , this.autoRotateTimeout * 1000);
            //
            //         controls.addEventListener('start' , () => {
            //             controls.autoRotate = false;
            //         })
            //         controls.addEventListener('end' , () => {
            //             setTimeout(() => {
            //                 controls.autoRotate = true;
            //             } , this.autoRotateTimeout * 1000);
            //         })
            //     }
            //
            //     const loader = new GLTFLoader();
            //
            //     loader.load('/img/map.gltf' , gltf => {
            //         this.loading = false;
            //         models = gltf.scene.children;
            //
            //         const remove = [];
            //         gltf.scene.traverse(( child ) => {
            //             if (child.isMesh) {
            //                 if (child.material && !child.name.includes('Ground')) {
            //                     child.material.color.set('#fff');
            //                     if (isShadowsOn) {
            //                         child.castShadow = true;
            //                         child.receiveShadow = true;
            //                     }
            //                 } else {
            //                     if (mapQuality < 2) {
            //                         remove.push(child);
            //                     } else if (isShadowsOn) {
            //                         child.castShadow = false;
            //                         child.receiveShadow = true;
            //                     }
            //                 }
            //             }
            //         });
            //
            //         if (mapQuality < 2) {
            //             for (let i = 0; i < remove.length; i++) {
            //                 gltf.scene.remove(remove[i]);
            //             }
            //         }
            //
            //         scene.add(gltf.scene);
            //
            //         if (this.shouldFocus) {
            //             this.tryFocusFromCode();
            //             this.shouldFocus = false;
            //         }
            //     } , undefined , err => {
            //         this.error = err;
            //         console.error(err);
            //     });
            //     this.animate();
            // } ,
            // animate() {
            //     if (this.unmounted) {
            //         return;
            //     }
            //
            //     TWEEN.update();
            //     requestAnimationFrame(this.animate);
            //     renderer.render(scene , camera);
            //     controls.update();
            // }
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
                    this.tryFocusFromCode();
                })
                .catch(err => {
                    console.error(err);
                });
            // this.unmounted = false;
            // this.init();
            // this.getLocation();
        } ,
        beforeDestroy() {
            // this.unmounted = true;
            // this.removeOldCanvas();
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

        .displayCanvas:hover:not(:focus):not(:active) {
            transition-duration: initial;
            transition-delay: initial;

            opacity: initial;
        }
    }
</style>

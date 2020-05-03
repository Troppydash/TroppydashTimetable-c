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
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

    import similarity from 'similarity';
    import { mapGetters } from 'vuex';

    export default {
        name: 'DisplayCanvas' ,
        props: ['isMobile' , 'toggleCanvas' , 'closed'] ,
        data() {
            return {
                loading: true ,
                error: '' ,
                models: [] ,
                ref: {
                    camera: null ,
                    controls: null ,
                    scene: null ,
                    renderer: null ,
                } ,
                lastSelected: -1,

                location: null ,
                shouldFocus: false ,
            };
        } ,
        computed: {
            ...mapGetters([
                'currentLesson'
            ]) ,
            data() {
                return this.$store.state.timetable.data;
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

                this.ref.renderer.setSize(width , height);
            } ,
        } ,
        methods: {
            focusFromCode( code ) {

                this.clearLastSelected();

                // Get the most likely name
                let susIndex = [];
                code = code.toLowerCase();
                this.models.forEach(( model , index ) => {
                    let temp = [];
                    model.name.split('_').forEach(( value ) => {
                        const sim = similarity(value.toLowerCase() , code);
                        temp.push({
                            percent: sim ,
                            index
                        });
                    });
                    if (temp.length > 0) {
                        temp = temp.sort(( x , y ) => y.percent - x.percent);
                        susIndex.push(temp[0]);
                    }
                });
                susIndex = susIndex.sort(( x , y ) => y.percent - x.percent);
                const selectedIndex = susIndex[0].index;

                this.lastSelected = selectedIndex;
                this.models[selectedIndex].material.color.set('#b82832');
                this.ref.controls.target = new THREE.Vector3(this.models[selectedIndex].position.x , this.models[selectedIndex].position.y , this.models[selectedIndex].position.z);

                const zoomDistance = Number(30)
                const currDistance = this.ref.camera.position.length()
                const factor = zoomDistance / currDistance;

                this.ref.camera.position.x *= factor;
                this.ref.camera.position.z *= factor;
                this.ref.camera.position.y = 80;
                this.ref.controls.update();
            } ,
            clearLastSelected() {
                if (this.lastSelected === -1) {
                    return;
                }
                this.models[this.lastSelected].material.color.set('#6b6b6b');
            } ,
            measure( originLat , originLong , lat , long ) {  // generally used geo measurement function
                const latdif = originLat - lat;
                const longdif = originLong - long;

                return {
                    lat: latdif * 111.32 * 1000 ,
                    long: longdif * 40075 * Math.cos(latdif) / 360 * 1000 ,
                };
            } ,
            setUserInCanvas() {
                if (!this.location) {
                    return;
                }

                const hodgeLat = -41.328232;
                const hodgeLong = 174.818269;
                const { lat , long } = this.measure(hodgeLat , hodgeLong , this.location.latitude , this.location.longitude);
                if (lat > 1000 || long > 1000) {
                    return;
                }

                if (this.models.filter(m => m.name === 'Player').length > 0) {
                    // Already exists, repositioning
                    return;
                }

                const geometry = new THREE.BoxGeometry(5 , 14 , 5);
                const cubeMeterial = new THREE.MeshNormalMaterial();

                const mesh = new THREE.Mesh(geometry , cubeMeterial);
                mesh.name = 'Player';

                mesh.position.x = (-long * 0.65) - 68;
                mesh.position.z = (lat * 0.92) - 22;
                mesh.position.y = 30;

                this.ref.scene.add(mesh);

            } ,
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

                this.focusFromCode(val[currentLesson[0]].periodData[currentLesson[1] - 1].AdditionalData.Room);
            } ,
            getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        this.location = position.coords;
                        this.setUserInCanvas();
                    });
                }
            } ,
            init() {
                // Init ThreeJS
                const width = 600 , height = width / 16 * 9;

                const targetElement = document.getElementById('schoolMap');
                this.ref.renderer = new THREE.WebGLRenderer({ antialias: true });
                this.ref.renderer.setSize(width , height);

                targetElement.appendChild(this.ref.renderer.domElement);

                this.ref.scene = new THREE.Scene();
                this.ref.camera = new THREE.PerspectiveCamera(45 , 16 / 9 , 0.1 , 10000);

                this.ref.camera.position.z = 200;
                this.ref.camera.position.y = 200;
                this.ref.scene.add(this.ref.camera);

                let light = new THREE.SpotLight(0xeeeeee, 1);
                light.position.set(300 , 300 , 300);
                this.ref.scene.add(light);

                light = new THREE.AmbientLight( 0x404040);
                this.ref.scene.add(light);

                this.ref.controls = new OrbitControls(this.ref.camera , this.ref.renderer.domElement);
                this.ref.controls.rotateSpeed = 1.0;
                this.ref.controls.zoomSpeed = 3;
                this.ref.controls.panSpeed = 2;
                this.ref.controls.enableZoom = true;

                const loader = new GLTFLoader();
                loader.load('/img/map.glb' , gltf => {
                    this.loading = false;
                    this.models = gltf.scene.children;
                    this.ref.scene.add(gltf.scene);

                    this.models.forEach(model => {
                        if (model.material && !model.name.includes('Ground')) {
                            model.material.color.set('#6b6b6b');
                        }
                    });

                    if (this.shouldFocus) {
                        this.tryFocusFromCode();
                        this.shouldFocus = false;
                    }
                } , undefined , err => {
                    this.error = err;
                    console.error(err);
                });
                this.animate();
            } ,
            animate() {
                requestAnimationFrame(this.animate);
                this.ref.controls.update();
                this.ref.renderer.render(this.ref.scene , this.ref.camera);
            }
        } ,
        mounted() {
            this.init();
            this.getLocation();
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

    /*.displayCanvas:hover:not(:focus):not(:active) {*/
    /*    transition-duration: 500ms;*/
    /*    transition-delay: 1.5s;*/

    /*    opacity: 0.3;*/
    /*}*/

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

<template>
    <div class="displayCanvas">
        <div id="schoolMap"></div>
    </div>
</template>

<script>
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
    import similarity from 'similarity';

    // TODO: Optimise
    export default {
        name: 'DisplayCanvas' ,
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
                }
            };
        } ,
        methods: {
            focusFromCode( code ) {

                this.clearAll();
                code = code.toLowerCase();

                let susIndex = [];
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
                susIndex = susIndex.sort(( x , y ) => y.percent - x.percent)
                const selectedIndex = susIndex[0].index;

                this.models[selectedIndex].material.color.set('#ff0000');
                this.ref.controls.target = this.models[selectedIndex].position;

                const zoomDistance = Number(30) ,
                    currDistance = this.ref.camera.position.length() ,
                    factor = zoomDistance / currDistance;

                this.ref.camera.position.x *= factor;
                this.ref.camera.position.z *= factor;
                this.ref.camera.position.y = 80;
                this.ref.controls.update();
            } ,
            clearAll() {
                this.models.forEach(model => {
                    if (model.material) {
                        model.material.color.set('#fff');
                    }
                });
            } ,
            init() {
                // Init ThreeJS
                const width = 500 , height = 400;

                const targetElement = document.getElementById('schoolMap');
                this.ref.renderer = new THREE.WebGLRenderer({ antialias: true });
                this.ref.renderer.setSize(width , height);

                targetElement.appendChild(this.ref.renderer.domElement);

                this.ref.scene = new THREE.Scene();
                this.ref.camera = new THREE.PerspectiveCamera(45 , width / height , 0.1 , 10000);

                this.ref.camera.position.z = 200;
                this.ref.camera.position.y = 200;
                this.ref.scene.add(this.ref.camera);

                const light = new THREE.DirectionalLight(0xffffff);
                light.position.set(0 , 100 , 50);
                this.ref.scene.add(light);

                this.ref.controls = new OrbitControls(this.ref.camera , this.ref.renderer.domElement);
                this.ref.controls.rotateSpeed = 1.0;
                this.ref.controls.zoomSpeed = 5;
                this.ref.controls.panSpeed = 2;
                this.ref.controls.enableZoom = true;

                const loader = new GLTFLoader();
                loader.load('/img/map.glb' , gltf => {
                    this.loading = false;
                    this.models = gltf.scene.children;
                    this.ref.scene.add(gltf.scene);
                } , undefined , err => {
                    this.error = err;
                    console.error(err);
                });

                this.clearAll();
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
        }
    };
</script>

<style scoped>

</style>

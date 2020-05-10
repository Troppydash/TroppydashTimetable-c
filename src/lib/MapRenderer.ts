import * as THREE from 'three';
import * as OrbitControls from 'three/examples/jsm/controls/OrbitControls.js';
import * as GLTFLoader from "three/examples/jsm/loaders/GLTFLoader";

import TWEEN from "@tweenjs/tween.js";
import similarity from 'similarity';

interface QualitySettings {
    haveShadow: boolean;
    mapQuality: number;

    haveSmoothCamera: boolean;

    haveAutoRotate: boolean;
    autoRotateTimeout: number;
}

interface CanvasSettings {
    width: number;
    height: number;
}

interface ControlsEventListeners {
    start: () => void;
    end: () => void;
}

export class MapRenderer {

    public size: CanvasSettings

    private camera: THREE.Camera
    private controls: OrbitControls.OrbitControls
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer

    private models: THREE.Object3D[]

    private controlsEventListeners: ControlsEventListeners | null

    private settings: QualitySettings

    private selected: number[] = []

    private doesStop = false

    constructor(
        targetElement: HTMLElement,
        qualitySettings: QualitySettings,
        canvasSettings: CanvasSettings
    ) {
        const {
            mapQuality, haveShadow,
            haveSmoothCamera,
            haveAutoRotate, autoRotateTimeout
        } = qualitySettings;

        this.size = canvasSettings;
        this.settings = qualitySettings;

        // Set up renderer
        this.renderer = new THREE.WebGLRenderer( {
            antialias: mapQuality > 3,
            powerPreference: mapQuality > 8 ? 'high-performance' : 'default'
        } );
        this.renderer.setSize( this.size.width, this.size.height );

        if ( haveShadow ) {
            this.renderer.shadowMap.enabled = true;
        }

        targetElement.appendChild( this.renderer.domElement );


        // Set up Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( '#87ceeb' );


        // Set up camera
        this.camera = new THREE.PerspectiveCamera( 45, 16 / 9, 0.1, 5000 );
        this.camera.position.set( 0, 200, 200 );
        this.scene.add( this.camera );


        // Top Light
        const topLight = new THREE.SpotLight( '#defaf8', 0.3 );
        topLight.position.set( 0, 300, 0 );
        topLight.target.position.set( 0, 0, 0 );

        if ( haveShadow ) {
            topLight.castShadow = true;
            topLight.shadow.camera.near = 0.008;
            topLight.shadow.camera.far = 300;
            topLight.shadow.mapSize.width = 500;
            topLight.shadow.mapSize.height = 500;
            topLight.shadow.bias = -0.0000005;
        }

        this.scene.add( topLight );


        // Side light
        const sidelight = new THREE.SpotLight( '#defaf8', 1 );
        sidelight.position.set( 70, 150, 70 );

        if ( haveShadow ) {
            sidelight.castShadow = true;
            sidelight.shadow.camera.near = 0.008;
            sidelight.shadow.camera.far = 500;
            sidelight.shadow.mapSize.width = (mapQuality - 1) ** 2 * 150;
            sidelight.shadow.mapSize.height = (mapQuality - 1) ** 2 * 150;
            sidelight.shadow.bias = -0.0000005;
        }

        this.scene.add( sidelight );


        // Ambient Light
        const ambientLight = new THREE.AmbientLight( '#fff', 0.2 );
        this.scene.add( ambientLight );


        // Set up Controls
        this.controls = new OrbitControls.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 3;
        this.controls.panSpeed = 2;
        this.controls.enableZoom = true;

        if ( haveSmoothCamera ) {
            this.controls.enableDamping = true;
        }

        if ( haveAutoRotate ) {
            setTimeout( () => {
                this.controls.autoRotate = true;
            }, autoRotateTimeout * 1000 );

            this.controlsEventListeners = {
                start: () => {
                    this.controls.autoRotate = false;
                },
                end: () => {
                    setTimeout( () => {
                        this.controls.autoRotate = true;
                    }, autoRotateTimeout * 1000 );
                }
            };
            this.controls.addEventListener( 'start', this.controlsEventListeners.start )
            this.controls.addEventListener( 'end', this.controlsEventListeners.end )
        } else {
            this.controlsEventListeners = null;
        }


        this.models = [];
        this.animate();
    }

    loadMap =() => {
        // Load Map
        return new Promise( (( resolve, reject ) => {
            const loader = new GLTFLoader.GLTFLoader();
            loader.load( '/img/map.gltf', gltf => {
                this.models = gltf.scene.children;

                const ground: THREE.Object3D[] = [];
                gltf.scene.traverse( child => {
                    if ( child instanceof THREE.Mesh ) {
                        // Buildings
                        if ( child.material && !child.name.includes( 'Ground' ) ) {
                            (child.material as any).color.set( '#fff' );

                            if ( this.settings.haveShadow ) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }

                        } else {

                            if ( this.settings.mapQuality < 2 ) {
                                ground.push( child );
                            }

                            if ( this.settings.haveShadow ) {
                                child.castShadow = false;
                                child.receiveShadow = true;
                            }
                        }

                    }
                } );

                if ( this.settings.mapQuality < 2 ) {
                    for ( let i = 0; i < ground.length; i++ ) {
                        gltf.scene.remove( ground[i] );
                    }
                }

                this.scene.add( gltf.scene );

                resolve();
            }, undefined, err => {
                reject( err );
            } );
        }) )
    }

    animate = () => {
        if ( this.doesStop ) {
            return;
        }

        TWEEN.update();
        requestAnimationFrame( this.animate );
        this.renderer.render( this.scene, this.camera );
        this.controls.update();
    }

    clearSelected = () => {
        if ( this.models.length !== 0 ) {
            this.selected.forEach( index => {
                (this.models[index] as any).material.color.set( '#fff' );
            } )
        }
    }

    focusObject = (roomNumber: string ) => {
        if ( !roomNumber ) {
            return;
        }

        this.clearSelected();

        const indexes = this.getIndexFromRoomNumber( roomNumber );
        this.selected = indexes;

        const mostLikelyItem = (indexes[0] as any);
        mostLikelyItem.material.color.set( '#b82832' );

        const from = this.camera.position.clone();
        const to = mostLikelyItem.position.clone();
        const toOffset = {
            x: from.x - to.x > 0 ? to.x + 30 : to.x - 30,
            y: to.y + 45,
            z: from.z - to.z > 0 ? to.z + 30 : to.z - 30
        };

        if ( this.settings.haveAutoRotate ) {
            this.controls.autoRotate = false;
            setTimeout( () => {
                this.controls.autoRotate = true;
            }, this.settings.autoRotateTimeout * 1000 );
        }

        if ( this.settings.haveSmoothCamera ) {

            new TWEEN.Tween( from )
                .to( toOffset, 1000 )
                .easing( TWEEN.Easing.Exponential.InOut )
                .onUpdate( () => {
                    this.camera.position.set( from.x, from.y, from.z );
                    this.camera.lookAt( new THREE.Vector3( to.x, to.y, to.z ) );
                    this.controls.target = new THREE.Vector3( to.x, to.y, to.z );
                } )
                .onComplete( () => {
                    this.camera.position.set( toOffset.x, toOffset.y, toOffset.z );
                    this.camera.lookAt( new THREE.Vector3( to.x, to.y, to.z ) );
                    this.controls.target = new THREE.Vector3( to.x, to.y, to.z );

                } )
                .start();

        } else {

            this.camera.position.set( toOffset.x, toOffset.y, toOffset.z );
            this.controls.target = to;

        }
    }

    changeSize = ( size: CanvasSettings ) => {
        this.size = size;
        this.renderer.setSize( this.size.width, this.size.height );
    }

    private getIndexFromRoomNumber = ( roomNumber: string ) => {
        roomNumber = roomNumber.toLowerCase();

        const indexes = this.models.map( ( model, index ) => {
            const temp = model.name.split( '_' ).map( value => ({
                percent: similarity( value.toLowerCase(), roomNumber ),
                index
            }) ).sort( ( x, y ) => y.percent - x.percent )
            if ( temp.length > 0 ) {
                return temp[0];
            } else {
                return null;
            }
        } )

        let filteredIndexes = indexes.filter( el => {
            return el != null;
        } ) as ({ index: number; percent: any })[];
        filteredIndexes = filteredIndexes.sort( ( x, y ) => y.percent - x.percent );

        if ( filteredIndexes.length < 10 ) {
            return filteredIndexes.map( v => v.index );
        } else {
            return filteredIndexes.slice( 0, 10 ).map( v => v.index );
        }
    }

    private dispose3 = (obj: any) => {
        const children = obj.children;
        let child;

        if (children) {
            for (let i=0; i<children.length; i+=1) {
                child = children[i];

                this.dispose3(child);
            }
        }

        const geometry = obj.geometry;
        const material = obj.material;

        if (geometry) {
            geometry.dispose();
        }

        if (material) {
            const texture = material.map;

            if (texture) {
                texture.dispose();
            }

            material.dispose();
        }
    }


    cleanUp = () => {

        return new Promise( (( resolve ) => {
            if ( this.settings.haveAutoRotate && this.controlsEventListeners ) {
                this.controls.removeEventListener( 'start', this.controlsEventListeners.start );
                this.controls.removeEventListener( 'end', this.controlsEventListeners.end );
            }

            this.models.forEach(model => {
                this.dispose3(model);
            })
            this.models = [];
            this.scene.dispose();
            this.renderer.dispose();
            this.doesStop = true;

            resolve();
        }) )

    }


}


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

interface DocumentEventListeners {
    focus: () => void;
    blur: () => void;
}

interface GeoLocation {
    latitude: number;
    longitude: number;
}

interface MapOffsets {
    xOffset: number;
    yOffset: number;
}

export class MapRenderer {

    public size: CanvasSettings
    public backupSize: CanvasSettings

    private readonly camera: THREE.Camera
    private readonly controls: OrbitControls.OrbitControls
    private readonly scene: THREE.Scene
    private readonly renderer: THREE.WebGLRenderer

    private models: THREE.Object3D[]

    private controlsEventListeners: ControlsEventListeners | null = null
    private documentEventListeners: DocumentEventListeners | null = null

    private settings: QualitySettings

    private selected: number[] = []

    private doesStop = false

    private rotateTimeoutHandler: number | null = null

    private isFullScreen = false

    private mapOffsets: MapOffsets;

    constructor(
        targetElement: HTMLElement,
        qualitySettings: QualitySettings,
        canvasSettings: CanvasSettings,
        mapOffsets: MapOffsets
    ) {
        this.mapOffsets = mapOffsets;
        const {
            mapQuality, haveShadow,
            haveSmoothCamera,
            haveAutoRotate
        } = qualitySettings;

        this.size = { ...canvasSettings };
        this.backupSize = { ...canvasSettings };
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
            sidelight.shadow.mapSize.width = (mapQuality) ** 2 * 150;
            sidelight.shadow.mapSize.height = (mapQuality) ** 2 * 150;
            sidelight.shadow.bias = -0.0000005;
        }

        this.scene.add( sidelight );


        // Ambient Light
        const ambientLight = new THREE.AmbientLight( '#fff', 0.2 );
        this.scene.add( ambientLight );


        // Set up Controls
        this.controls = new OrbitControls.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.rotateSpeed = 0.2;
        this.controls.zoomSpeed = 1;
        this.controls.panSpeed = 1;
        this.controls.enableZoom = true;

        if ( haveSmoothCamera ) {
            this.controls.enableDamping = true;
        }

        if ( haveAutoRotate ) {
            this.startRotationTimer();
            this.documentEventListeners = {
                blur: () => {
                    this.stopRotationTimer();
                },
                focus: () => {
                    this.startRotationTimer();
                }
            }
            window.addEventListener( 'blur', this.documentEventListeners.blur );
            window.addEventListener( 'focus', this.documentEventListeners.focus );

            this.controlsEventListeners = {
                start: () => {
                    this.stopRotationTimer();
                },
                end: () => {
                    this.startRotationTimer();
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

    private startRotationTimer = () => {
        if ( this.rotateTimeoutHandler ) {
            clearTimeout( this.rotateTimeoutHandler );
            this.controls.autoRotate = false;
        }
        this.rotateTimeoutHandler = setTimeout( () => {
            this.controls.autoRotate = true;
        }, this.settings.autoRotateTimeout * 1000 );
    }

    private stopRotationTimer = () => {
        if ( this.rotateTimeoutHandler ) {
            clearTimeout( this.rotateTimeoutHandler );
            this.rotateTimeoutHandler = null;
        }
        this.controls.autoRotate = false;
    }

    toggleFullScreen = ( to: boolean ) => {
        this.isFullScreen = to;
        if ( this.isFullScreen ) {
            const height = window.innerHeight;
            const width = window.innerWidth;

            this.backupSize = { ...this.size };
            this.size = { width, height };

            (this.camera as any).aspect = width / height;
            (this.camera as any).updateProjectionMatrix();

            this.renderer.setSize( width, height );
        } else {
            this.size = { ...this.backupSize };

            (this.camera as any).aspect = this.size.width / this.size.height;
            (this.camera as any).updateProjectionMatrix();
            this.renderer.setSize( this.size.width, this.size.height );
        }

    }

    loadMap = () => {
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
                try {
                    (this.models[index] as any).material.color.set( '#fff' );
                } catch ( e ) {
                    console.log(e);
                }
            } )
        }
    }

    focusObject = ( roomNumber: string ) => {
        if ( !roomNumber ) {
            return;
        }

        this.clearSelected();

        const indexes = this.getIndexFromRoomNumber( roomNumber );
        this.selected = indexes;

        // indexes.forEach( (( value, index ) => {
        //     if ( index === 0 ) {
        //         return;
        //     }
        //
        //     (this.models[value] as any).material.color.set( '#ba5d64' )
        // }) )

        const mostLikelyItem = (this.models[indexes[0]] as any);
        mostLikelyItem.material.color.set( '#b82832' );

        const from = this.camera.position.clone();
        const to = mostLikelyItem.position.clone();
        const toOffset = {
            x: from.x - to.x > 0 ? to.x + 30 : to.x - 30,
            y: to.y + 45,
            z: from.z - to.z > 0 ? to.z + 30 : to.z - 30
        };

        if ( this.settings.haveAutoRotate ) {
            this.startRotationTimer();
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

    onresize = () => {
        if ( this.isFullScreen ) {
            const height = window.innerHeight;
            const width = window.innerWidth;
            this.size = { width, height };

            (this.camera as any).aspect = width / height;
            (this.camera as any).updateProjectionMatrix();

            this.renderer.setSize( width, height );
        }
    }

    changeSize = ( size: CanvasSettings ) => {
        if ( size.width !== this.backupSize.width ) {
            this.backupSize = { ...size };
        }

        if ( !this.isFullScreen ) {
            this.size = size;
            this.renderer.setSize( this.size.width, this.size.height );
            (this.camera as any).aspect = this.size.width / this.size.height;
            (this.camera as any).updateProjectionMatrix();
        } else {
            const height = window.innerHeight;
            const width = window.innerWidth;
            this.size = { width, height };

            (this.camera as any).aspect = width / height;
            (this.camera as any).updateProjectionMatrix();

            this.renderer.setSize( width, height );
        }
    }

    private static getOffset( pointA: GeoLocation, pointB: GeoLocation ): GeoLocation {
        const latDif = pointA.latitude - pointB.latitude;
        const longDif = pointA.longitude - pointB.longitude;

        return {
            latitude: latDif * 111.32 * 1000,
            longitude: longDif * 40075 * Math.cos( latDif ) / 360 * 1000
        };
    }

    private setUserLocation = ( position: GeoLocation ) => {
        if ( !position ) {
            return;
        }

        const targetLat = -41.328232;
        const targetLong = 174.818269;
        const { longitude, latitude } = MapRenderer.getOffset( {
            latitude: targetLat,
            longitude: targetLong
        }, position );

        // Out of Bounds
        if ( longitude > 1000 || latitude > 1000 ) {
            return;
        }

        // filter code
        //     if (models.filter(m => m.name === 'Player').length > 0) {
        //         // Already exists, repositioning
        //         return;
        //     }

        const geometry = new THREE.BoxGeometry( 5, 14, 5 );
        const cubeMaterial = new THREE.MeshNormalMaterial();

        const mesh = new THREE.Mesh( geometry, cubeMaterial );
        mesh.name = 'User';

        mesh.position.x = (-longitude * (0.65)) - (68 + this.mapOffsets.xOffset);
        mesh.position.z = (latitude * (0.92)) - (22 + this.mapOffsets.yOffset);
        mesh.position.y = 25;

        this.scene.add( mesh );
    }

    getAndSetUserLocation = () => {
        if ( navigator.geolocation ) {
            navigator.geolocation.getCurrentPosition( position => {
                this.setUserLocation( position.coords )
            } )
        }
    }

    private getIndexFromRoomNumber = ( roomNumber: string ) => {
        roomNumber = roomNumber.toLowerCase();

        const indexes = this.models.map( ( model, index ) => {
            if (!(model as any).material) {
                return null;
            }

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

        if ( filteredIndexes.length < 3 ) {
            return filteredIndexes.map( v => v.index );
        } else {
            return filteredIndexes.slice( 0, 3 ).map( v => v.index );
        }
    }

    private static dispose = ( obj: any ) => {
        const children = obj.children;
        let child;

        if ( children ) {
            for ( let i = 0; i < children.length; i += 1 ) {
                child = children[i];
                MapRenderer.dispose( child );
            }
        }

        const geometry = obj.geometry;
        const material = obj.material;

        if ( geometry ) {
            geometry.dispose();
        }

        if ( material ) {
            const texture = material.map;

            if ( texture ) {
                texture.dispose();
            }

            material.dispose();
        }
    }


    cleanUp = () => {

        return new Promise( (( resolve ) => {
            if ( this.settings.haveAutoRotate && this.controlsEventListeners && this.documentEventListeners ) {
                this.controls.removeEventListener( 'start', this.controlsEventListeners.start );
                this.controls.removeEventListener( 'end', this.controlsEventListeners.end );
                this.controlsEventListeners = null;

                window.removeEventListener( 'blur', this.documentEventListeners.blur );
                window.removeEventListener( 'focus', this.documentEventListeners.focus );
                this.documentEventListeners = null;
            }

            this.models.forEach( model => {
                MapRenderer.dispose( model );
            } )
            this.scene.dispose();
            this.renderer.dispose();
            this.doesStop = true;

            resolve();
        }) )

    }


}


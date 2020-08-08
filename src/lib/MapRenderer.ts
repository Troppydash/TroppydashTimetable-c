import * as THREE from 'three';
import * as OrbitControls from 'three/examples/jsm/controls/OrbitControls.js';
import * as GLTFLoader from "three/examples/jsm/loaders/GLTFLoader";

import TWEEN from "@tweenjs/tween.js";
import similarity from 'similarity';
import { Interaction } from 'three.interaction';
import { Mesh, Object3D, Shader } from "three";
import moment from "moment";

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

interface OnHoverEvent {
    position: {
        x: number;
        y: number;
    };
    mesh: Mesh;
}

interface ToolTip {
    timeout: number;
    delay: number;
}

interface MapColors {
    [key: string]: TimeColor;
}

interface TimeColor {
    sunlight: string;
    ambient: string;
    toplight: string;
    sky: string;

    building: string;
    selectedBuilding: string;
    highlightBuilding: string;
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

    private interaction: any;

    private loaded = false;

    private isAnimating = false;

    private lastName = '';
    private countDown = -1;
    private isShowing = false;

    private toolTip: ToolTip = { delay: 0.5 * 1000, timeout: 1000 };
    private tooltipDelayTimeout = 0;
    private old = this.toolTip.timeout;

    private isisShowing = false;
    private oldPos: any;

    private readonly colors: MapColors = {
        morning: {
            sunlight: '#ffa24b',
            ambient: '#888',
            toplight: '#fff1e5',
            sky: '#485e6b',

            building: "#8e8e8e",
            selectedBuilding: "#b82832",
            highlightBuilding: "#ffffff",
        },
        afternoon: {
            sunlight: '#fdfbd3',
            ambient: '#dedede',
            toplight: '#fdfbd3',
            sky: '#87ceeb',

            building: "#8e8e8e",
            selectedBuilding: "#b82832",
            highlightBuilding: "#ffffff",
        },
        sunset: {
            sunlight: '#FDB813',
            ambient: '#ccc',
            toplight: '#d69800',
            sky: '#f5c6a1',

            building: "#8e8e8e",
            selectedBuilding: "#b82832",
            highlightBuilding: "#ffffff",
        },
        night: {
            sunlight: '#333',
            ambient: '#222',
            toplight: '#ffbb73',
            sky: '#87889c',

            building: "#8e8e8e",
            selectedBuilding: "#b82832",
            highlightBuilding: "#ffffff",
        },
    };
    private readonly selectedColor: TimeColor;

    // private composer: EffectComposer;
    //
    // private outlinePass: OutlinePass;

    getColorsFromTOD = () => {

        const h = moment().hour();
        // const h = 10;

        if ( h >= 5 && h < 11 ) {
            return this.colors["morning"];
        }
        if ( h >= 11 && h < 15 ) {
            return this.colors['afternoon'];
        }
        if ( h >= 15 && h < 17 ) {
            return this.colors['sunset'];
        }
        return this.colors['night'];
    }

    constructor(
        private targetElement: HTMLElement,
        qualitySettings: QualitySettings,
        canvasSettings: CanvasSettings,
        mapOffsets: MapOffsets,
        private mapLocation: string,
        toolTipSettings?: ToolTip,
    ) {
        if ( toolTipSettings ) {
            this.toolTip = toolTipSettings;
        }

        this.selectedColor = this.getColorsFromTOD();
        this.targetElement.innerHTML = '';
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
            this.renderer.shadowMap.autoUpdate = false;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        targetElement.appendChild( this.renderer.domElement );


        // Set up Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( this.selectedColor.sky );


        // Set up camera
        this.camera = new THREE.PerspectiveCamera( 45, 16 / 9, 0.1, 5000 );
        this.camera.position.set( 0, 200, 200 );
        this.scene.add( this.camera );

        this.interaction = new Interaction( this.renderer, this.scene, this.camera );

        // this.composer = new EffectComposer(this.renderer);
        //
        // const renderPass = new RenderPass( this.scene, this.camera );
        // this.composer.addPass( renderPass );
        //
        // this.outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), this.scene, this.camera );
        // this.composer.addPass(this.outlinePass);

        // Top Light
        const topLight = new THREE.DirectionalLight( this.selectedColor.toplight, 0.3 );
        topLight.position.set( 0, 25, 0 );
        topLight.target.position.set( 0, 0, 0 );

        if ( haveShadow ) {
            topLight.castShadow = true;
            topLight.shadow.camera.near = 18;
            topLight.shadow.camera.far = 60;
            topLight.shadow.mapSize.width = 2 ** (mapQuality + 6);
            topLight.shadow.mapSize.height = 2 ** (mapQuality + 6);
            topLight.shadow.bias = -0.000001;

            topLight.shadow.camera.left = -100;
            topLight.shadow.camera.right = 100;
            topLight.shadow.camera.top = 175;
            topLight.shadow.camera.bottom = -100;
        }

        this.scene.add( topLight );
        // this.scene.add(new THREE.CameraHelper(topLight.shadow.camera));


        // Side light
        const sidelight = new THREE.DirectionalLight( this.selectedColor.sunlight, 0.7 );
        sidelight.position.set( 50 * 2, 70 * 2, 120 * 2 );
        sidelight.target.position.set( 30, 0, 0, );

        if ( haveShadow ) {
            sidelight.castShadow = true;

            sidelight.shadow.mapSize.width = 2 ** (mapQuality + 6);
            sidelight.shadow.mapSize.height = 2 ** (mapQuality + 6);
            sidelight.shadow.bias = -0.01;

            sidelight.shadow.camera.left = -200;
            sidelight.shadow.camera.right = 200;
            sidelight.shadow.camera.top = 200;
            sidelight.shadow.camera.bottom = -200;

            sidelight.shadow.camera.near = 20;
            sidelight.shadow.camera.far = 450;
        }

        this.scene.add( sidelight );

        // this.scene.add(new THREE.CameraHelper(sidelight.shadow.camera));


        // const spotLightHelper = new THREE.DirectionalLightHelper( sidelight );
        // this.scene.add( spotLightHelper );


        // Ambient Light
        const ambientLight = new THREE.AmbientLight( this.selectedColor.ambient, 1 );
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
    loadMap = ( onHover?: ( ev: OnHoverEvent ) => void, onLeave?: () => void ) => {
        if ( this.loaded ) {
            return;
        }
        this.loaded = true;
        // Load Map
        return new Promise( (( resolve, reject ) => {
            const loader = new GLTFLoader.GLTFLoader();
            loader.load( this.mapLocation, gltf => {
                this.models = gltf.scene.children;

                const ground: THREE.Object3D[] = [];
                gltf.scene.traverse( child => {
                    if ( child instanceof THREE.Mesh && (child.material && !child.name.includes( 'Plane' )) ) {
                        // Buildings
                        (child.material as any).color.set( this.selectedColor.building );
                        if ( this.settings.haveShadow ) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                        const name = child.name.split( '_' )[0];
                        (child as any).cursor = 'pointer';
                        (child as any).on( 'mousedown', ( ev: any ) => {
                            const { screenX, screenY } = ev.data.originalEvent;
                            this.oldPos = { screenX, screenY };
                            (child as any).isMouseDown = true;
                        } );
                        (child as any).on( 'mouseup', ( ev: any ) => {
                            const { screenX, screenY } = ev.data.originalEvent;
                            if ( (child as any).isMouseDown === true
                                && Math.abs( this.oldPos.screenX - screenX ) < 15
                                && Math.abs( this.oldPos.screenY - screenY ) < 15 ) {
                                this.focusObject( name );
                                (child as any).isMouseDown = false;
                            }
                        } );
                        (child as any).on( 'mouseover', ( ev: any ) => {
                            if ( !(child as any).isSelected ) {
                                (child.material as any).color.set( this.selectedColor.highlightBuilding );
                            }
                        } );
                        (child as any).on( 'mousemove', ( ev: any ) => {
                            // TODO: Make this tooltip nicer
                            if ( this.isFullScreen && onHover ) {
                                const { clientX, clientY } = ev.data.originalEvent;
                                const currentPosition = { x: clientX, y: clientY };

                                if ( this.lastName !== ev.data.target.name ) {
                                    this.lastName = ev.data.target.name;
                                    clearInterval( this.countDown );
                                    this.isShowing = true;
                                    this.countDown = setInterval( () => {
                                        this.isisShowing = true;
                                        onHover( { position: currentPosition, mesh: ev.data.target } );
                                    }, this.toolTip.timeout );
                                } else {
                                    if ( !this.isShowing ) {
                                        this.isShowing = true;
                                        this.countDown = setInterval( () => {
                                            this.isisShowing = true;
                                            onHover( { position: currentPosition, mesh: ev.data.target } );
                                        }, this.toolTip.timeout );
                                    }
                                }
                            }
                        } );
                        (child as any).on( 'mouseout', () => {
                            if ( this.isFullScreen && onLeave && this.isShowing ) {
                                if ( this.isisShowing ) {
                                    clearTimeout( this.tooltipDelayTimeout );
                                    this.toolTip.timeout = this.old;
                                    this.old = this.toolTip.timeout;
                                    this.toolTip.timeout = 0.5 * 1000;
                                    this.tooltipDelayTimeout = setTimeout( () => {
                                        this.toolTip.timeout = this.old;
                                    }, this.toolTip.delay );
                                }
                                this.isisShowing = false;
                                this.isShowing = false;
                                clearInterval( this.countDown );
                                onLeave();
                            }

                            if ( !(child as any).isSelected ) {
                                (child.material as any).color.set( this.selectedColor.building );
                            }
                        } );
                    } else {
                        if ( this.settings.mapQuality < 2 ) {
                            ground.push( child );
                        }
                        if ( this.settings.haveShadow ) {
                            child.castShadow = false;
                            child.receiveShadow = true;
                        }
                    }
                } );

                if ( this.settings.mapQuality < 2 ) {
                    for ( let i = 0; i < ground.length; i++ ) {
                        gltf.scene.remove( ground[i] );
                    }
                }

                this.renderer.shadowMap.needsUpdate = true;
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
                    (this.models[index] as any).isSelected = false;
                    (this.models[index] as any).material.color.set( this.selectedColor.building );
                } catch ( e ) {
                    console.log( e );
                }
            } )
        }
    }

    focusObject = ( roomNumber: string ) => {
        if ( this.isAnimating ) {
            return;
        }
        if ( !roomNumber ) {
            return;
        }

        this.clearSelected();

        const indexes = this.getIndexFromRoomNumber( roomNumber );
        this.selected = indexes;

        const mostLikelyItem = (this.models[indexes[0]] as any);
        // this.displayWireframe( mostLikelyItem );
        mostLikelyItem.isSelected = true;
        // mostLikelyItem.material.color.set( '#b82832' );
        mostLikelyItem.material.color.set( this.selectedColor.selectedBuilding );

        const from = this.camera.position.clone();
        const to = mostLikelyItem.position.clone();
        const toOffset = {
            x: from.x - to.x > 0 ? to.x + 30 : to.x - 30,
            y: to.y + 45,
            z: from.z - to.z > 0 ? to.z + 30 : to.z - 30
        };

        const fromRot = this.camera.quaternion.clone();
        const oldRot = fromRot.clone();
        const oldPos = from.clone();
        this.camera.position.set( toOffset.x, toOffset.y, toOffset.z );
        this.camera.lookAt( new THREE.Vector3( to.x, to.y, to.z ) );

        const toRot = this.camera.quaternion.clone();
        this.camera.position.set( oldPos.x, oldPos.y, oldPos.z );
        this.camera.rotation.set( oldRot.x, oldRot.y, oldRot.z );

        if ( this.settings.haveAutoRotate ) {
            this.startRotationTimer();
        }

        if ( this.settings.haveSmoothCamera ) {
            this.isAnimating = true;
            setTimeout( () => {
                this.isAnimating = false;
            }, 1000 );
            const time = { t: 0 }
            new TWEEN.Tween( time )
                .to( { t: 1 }, 1000 )
                .easing( TWEEN.Easing.Exponential.InOut )
                .onUpdate( () => {
                    THREE.Quaternion.slerp( fromRot, toRot, this.camera.quaternion, time.t );
                } )
                .onComplete( () => {
                    this.camera.quaternion.copy( toRot );
                } )
                .start();

            new TWEEN.Tween( from )
                .to( toOffset, 1000 )
                .easing( TWEEN.Easing.Exponential.InOut )
                .onUpdate( () => {
                    this.camera.position.set( from.x, from.y, from.z );
                } )
                .onComplete( () => {
                    this.camera.position.set( toOffset.x, toOffset.y, toOffset.z );
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
            // this.composer.setSize(width, height);

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
            if ( !(model as any).material ) {
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
            this.loaded = false;

            try {
                this.interaction.destroy();
                this.interaction = null;
            } catch ( e ) {
                this.interaction = null;
            }

            resolve();
        }) )

    }


}


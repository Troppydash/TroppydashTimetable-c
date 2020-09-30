<template>
    <div id="schoolMap">

    </div>
</template>

<script>
    import { MapRenderer } from '@/lib/MapRenderer';
    import {
        getAutoRotate ,
        getAutoRotateTimeout , getEnableTexture , getMapXOffset , getMapYOffset ,
        getQuality ,
        getShadows ,
        getSmoothCamera , getTOD
    } from '@/StorageKeysGetters';

    export default {
        name: 'Map' ,
        data() {
            return {
                isFullScreen: false ,
                mapRenderer: null,
            };
        } ,
        methods: {
            focusObject( roomName ) {
                this.mapRenderer.focusObject(roomName);
            } ,
        },
        mounted() {
            const width = document.getElementById('schoolMap').clientWidth;
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
            this.mapRenderer.loadMap()
                .then(() => {
                    this.mapRenderer.autoresize();
                    window.addEventListener('resize' , this.mapRenderer.autoresize);
                })
                .catch(err => {
                    console.error(err);
                });

        }
    };
</script>

<style scoped>
    #schoolMap {
    }
</style>

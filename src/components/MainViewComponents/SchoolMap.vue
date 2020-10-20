<template>
    <div class="map-container">
        <span id="map-tooltip" v-bind:style="{ top: relPos.relY - 15 + 'px', left: relPos.relX + 15 + 'px' }">{{ ttText }}</span>
        <div id="schoolMap"></div>
    </div>
</template>

<script>
    import {
        getEnableTexture ,
        getQuality ,
        getShadows ,
        getSmoothCamera , getTOD
    } from '@/StorageKeysGetters';
    import { MapRendererBuilder } from '@stimetable/map-renderer/lib/renderer';
    import { AutoResizeFeature } from '@/lib/AutoResizeFeature';
    import { HighlightingFeature , TooltipFeature } from '@stimetable/map-renderer/lib/features';

    export default {
        name: 'Map' ,
        data() {
            return {
                mapRendererBuilder: null,
                ttText: '',
                relPos: { relX: -1, relY: -1}
            };
        } ,
        methods: {
            focusObject( roomName ) {
                if (this.mapRendererBuilder.ref) {
                    this.mapRendererBuilder.ref.focusBuildingByName(roomName);
                }
            } ,
        } ,
        beforeDestroy() {
            if (this.mapRendererBuilder) {
                this.mapRendererBuilder.dispose();
            }
            this.mapRendererBuilder = null;
        } ,
        mounted() {
            const width = document.getElementById('schoolMap').clientWidth;
            const tod = getTOD();
            const builder = new MapRendererBuilder({
                targetElement: document.getElementById('schoolMap') ,
                gltfLocation: getEnableTexture() ? '/maps/compressed/scots.gltf' : '/maps/compressed/scots-notex.gltf' ,
                quality: getQuality() ,
                createSettingsFromQuality: quality => {
                    return {
                        quality: {
                            antialias: quality > 4 ,
                            postprocessing: quality > 7 ,
                        }
                    };
                }
            } , {
                quality: {
                    shadow: getShadows()
                } ,
                camera: {
                    smooth: getSmoothCamera() ,
                } ,
                canvas: {
                    size: {
                        width ,
                        height: width / 16 * 9
                    }
                } ,
                map: {
                    timeDependedGetTimeOfDay: () => 'afternoon'
                }
            });

            builder.addFeature(new AutoResizeFeature());
            builder.addFeature(new TooltipFeature(
                document.getElementById('schoolMap'),
                document.getElementById('map-tooltip'),
                (newText, relativePosition) => {
                    this.relPos = relativePosition;
                    this.ttText = newText;
                }
            ));
            builder.addFeature(new HighlightingFeature({
                postprocessing: getQuality() > 7,
            }))
            builder.register();
            this.mapRendererBuilder = builder;
        }
    };
</script>

<style scoped>
    .map-container {
        position: relative;
    }

    #map-tooltip {
        background-color: var(--background-color);
        position: absolute;
        margin: 0;
        padding: 0;
        pointer-events: none;
    }

</style>

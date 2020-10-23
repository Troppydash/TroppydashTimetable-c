import { Feature } from "@stimetable/map-renderer/lib/features";
import { CanvasSize, THREEObject } from "@stimetable/map-renderer/lib/renderer";
import { MapRenderer, MapRendererRefs } from "@stimetable/map-renderer/lib/renderer/mapRenderer";

export class FullscreenWatcherFeature extends Feature {
    constructor() {
        super();
    }

    onClickBuilding( building: THREEObject, event: PointerEvent ): void {
    }

    onControlEnd(): void {
    }

    onControlStart(): void {
    }

    onExitBuilding( building: THREEObject, event: PointerEvent ): void {
    }

    onFocusBuilding( newBuilding: THREEObject, oldBuilding?: THREEObject ): void {
    }

    onHoverBuilding( building: THREEObject, event: PointerEvent ): void {
    }

    onMoveBuilding( building: THREEObject, event: PointerEvent ): void {
    }

    onResizeCanvas( newSize: CanvasSize ): void {
    }

    onToggleFullscreen( isFullscreen: boolean ): void {
        if ( isFullscreen ) {
            window.addEventListener( 'resize', this.autoResize )
        } else {
            window.addEventListener( 'resize', this.autoResize )
        }
    }

    private autoResize = () => {
        if ( !this.mapRenderer.isFullscreen ) {
            window.addEventListener( 'resize', this.autoResize )
            return;
        }
        this.mapRenderer.resize( {
            width: window.innerWidth,
            height: window.innerHeight
        } )
    }

    onTraverseChild( child: THREEObject ): void {
    }

    runCleanup(): void {
    }

    private mapRenderer!: MapRenderer

    runSetup( refs: MapRendererRefs, mapRenderer: MapRenderer ): void {
        this.mapRenderer = mapRenderer;
    }

}

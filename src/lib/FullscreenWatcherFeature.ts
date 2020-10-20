import { Feature } from "@stimetable/map-renderer/lib/features";
import { CanvasSize, THREEObject } from "@stimetable/map-renderer/lib/renderer";
import { MapRenderer, MapRendererRefs } from "@stimetable/map-renderer/lib/renderer/mapRenderer";

export class FullscreenWatcherFeature extends Feature {
    constructor(private callback: (isFullscreen: boolean) => void) {
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
        this.callback(isFullscreen);
    }

    onTraverseChild( child: THREEObject ): void {
    }

    runCleanup(): void {
    }

    runSetup( refs: MapRendererRefs, mapRenderer: MapRenderer ): void {
    }

}

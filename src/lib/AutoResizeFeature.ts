import { Feature } from "@stimetable/map-renderer/lib/features";
import { CanvasSize, THREEObject } from "@stimetable/map-renderer/lib/renderer";
import { MapRenderer, MapRendererRefs } from "@stimetable/map-renderer/lib/renderer/mapRenderer";

export class AutoResizeFeature extends Feature {
    private ref!: MapRenderer;
    private target!: HTMLElement;

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
    }

    onTraverseChild( child: THREEObject ): void {
    }

    runCleanup(): void {
        window.removeEventListener('resize' , this.autoresize);
    }

    private autoresize = () => {
        const width = this.target.clientWidth;
        this.ref.resize({
            width,
            height: width / 16 * 9
        })
    }

    runSetup( refs: MapRendererRefs, mapRenderer: MapRenderer ): void {
        this.ref = mapRenderer;
        this.target = mapRenderer.settings.basic.targetElement;
        window.addEventListener('resize' , this.autoresize);
    }

}

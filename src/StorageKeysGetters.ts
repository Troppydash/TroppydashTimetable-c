import { clamp, GetFromLocalStorageOrDefault, isMobileBrowser } from "@/Helpers";
import {
    AUTO_ROTATE,
    AUTO_ROTATE_TIMEOUT, DISABLE_HIGHLIGHTING_LIKE_TERMS, DISPLAY_PREVIOUS_DAYS, ENABLE_TEXTURES,
    MAP_QUALITY,
    MAP_XOFFSET, MAP_YOFFSET,
    SHADOWS_ON, SHOW_ROOM_NAME,
    SMOOTH_CAMERA,
    USER_PREFERENCES
} from "@/StorageKeys";

export const getShadows = () => GetFromLocalStorageOrDefault( SHADOWS_ON, !(window.innerWidth < 1024), USER_PREFERENCES, value => value === 'true' );

export const getQuality = () => GetFromLocalStorageOrDefault( MAP_QUALITY, 5, USER_PREFERENCES, value => {
    return clamp( parseInt( value ), 1, 10 );
} );

export const getMapXOffset = () => GetFromLocalStorageOrDefault( MAP_XOFFSET, 0, USER_PREFERENCES, value => {
    return clamp( parseInt( value ), -50, 50 );
} );
export const getMapYOffset = () => GetFromLocalStorageOrDefault( MAP_YOFFSET, 0, USER_PREFERENCES, value => {
    return clamp( parseInt( value ), -50, 50 );
} );

export const getSmoothCamera = () => GetFromLocalStorageOrDefault( SMOOTH_CAMERA, true, USER_PREFERENCES, value => value === 'true' );


export const getAutoRotate = () => GetFromLocalStorageOrDefault( AUTO_ROTATE, false, USER_PREFERENCES, value => value === 'true' );
export const getAutoRotateTimeout = () => GetFromLocalStorageOrDefault( AUTO_ROTATE_TIMEOUT, 3, USER_PREFERENCES, value => {
    return clamp( parseInt( value ), 1, 10 );
} );

export const getDisplayNearbyWeeks = () => GetFromLocalStorageOrDefault( DISPLAY_PREVIOUS_DAYS, false, USER_PREFERENCES, value => value === 'true' );
export const getDisableHighlighting = () => GetFromLocalStorageOrDefault( DISABLE_HIGHLIGHTING_LIKE_TERMS, false, USER_PREFERENCES, value => value === 'true' );
export const getShowRoomName = () => GetFromLocalStorageOrDefault( SHOW_ROOM_NAME, 'default', USER_PREFERENCES )
export const getEnableTexture = () => GetFromLocalStorageOrDefault( ENABLE_TEXTURES, !isMobileBrowser(), USER_PREFERENCES, value => value === 'true' );

export const clamp = ( target: number, min: number, max: number ) => {
    return Math.min( Math.max( target, min ), max );
}

export const GetFromLocalStorageOrDefault = (
    key: string, defaultValue: any,
    collectionName: string | null = null,
    compareFunction: (( input: any ) => any) | null = null ) => {

    if ( collectionName !== null ) {
        let collection: any = localStorage.getItem( collectionName );
        if ( collection === null ) {
            return defaultValue
        } else {
            collection = JSON.parse( collection );

            if ( compareFunction !== null ) {
                if (collection[key]) {
                    return compareFunction( collection[key] );
                }
                return defaultValue;
            }

            if (collection[key] === null) {
                return defaultValue;
            }
            return collection[key];
        }
    } else {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue
        }
        return item;
    }
}

export const GetFromLocalStorageOrNull = (
    key: string,
    collectionName: string | null = null,
    compareFunction: (( input: any ) => any) | null = null
) => {
    if (collectionName !== null) {
        return GetFromLocalStorageOrDefault(key, null, collectionName, compareFunction);
    }

    const item = localStorage.getItem(key);
    if (item === null) {
        return null;
    }

    if (compareFunction !== null) {
        return compareFunction(item);
    }
    return item;
}

export const SetLocalStorage = ( key: string, value: any, collectionName: string | null = null, ) => {
    if ( collectionName !== null ) {
        if ( localStorage.getItem( collectionName ) === null ) {
            localStorage.setItem( collectionName, JSON.stringify( {
                [key]: value
            } ) );
        } else {
            let collection: any = localStorage.getItem( collectionName );
            collection = JSON.parse( collection );

            collection[key] = value;
            localStorage.setItem( collectionName, JSON.stringify( collection ) );
        }
    } else {
        return localStorage.setItem( key, value );
    }
}

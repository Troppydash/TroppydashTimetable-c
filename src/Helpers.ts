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
                if ( collection[key] ) {
                    return compareFunction( collection[key] );
                }
                return defaultValue;
            }

            if ( collection[key] ) {
                return collection[key];
            }
            return defaultValue;
        }
    } else {
        const item = localStorage.getItem( key );
        if ( item === null ) {
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
    if ( collectionName !== null ) {
        return GetFromLocalStorageOrDefault( key, null, collectionName, compareFunction );
    }

    const item = localStorage.getItem( key );
    if ( item === null ) {
        return null;
    }

    if ( compareFunction !== null ) {
        return compareFunction( item );
    }
    return item;
}

export const RemoveFromLocalStorage = ( key: string, collectionName: string | null = null ) => {
    if ( collectionName === null ) {
        localStorage.removeItem( key );
        return;
    }

    let item: any = localStorage.getItem( collectionName );
    item = JSON.parse( item );
    const filtered = Object.keys( item )
        .filter( k => k !== key )
        .reduce( ( obj: any, k ) => {
            obj[k] = item[k];
            return obj;
        }, {} );
    localStorage.setItem( collectionName, JSON.stringify( filtered ) );
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


export function isMobileBrowser() {
    let check = false;
    (function ( a ) {
        if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test( a ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test( a.substr( 0, 4 ) ) ) check = true;
    })( navigator.userAgent || navigator.vendor || (window as any).opera );
    return check;
}

export function getFakeTableData() {
    return JSON.parse( "[{\"Date\":\"12/10/2020 00:00:00\",\"DateFormatted\":\"Monday 12th October, 2020\",\"weekDay\":\"Monday\",\"periodData\":[{\"PeriodID\":\"1\",\"Heading\":\"Lesson 1\",\"FromTime\":\"8.45\",\"ToTime\":\"9.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"1\",\"Room\":\"18\",\"Abbrev\":\"11MATA\",\"Desc\":\"Maths - Abstract\",\"Teacher\":\"Mr C P Zachariassen\"}},{\"PeriodID\":\"2\",\"Heading\":\"Lesson 2\",\"FromTime\":\"9.45\",\"ToTime\":\"10.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"2\",\"Room\":\"P10\",\"Abbrev\":\"11FRE\",\"Desc\":\"French\",\"Teacher\":\"Mr G M Wilson\"}},{\"PeriodID\":\"3\",\"Heading\":\"Lesson 3\",\"FromTime\":\"11.15\",\"ToTime\":\"12.15\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"3\",\"Room\":\"C12\",\"Abbrev\":\"11RED\",\"Desc\":\"Religious Education\",\"Teacher\":\"Miss K G Jones\"}},{\"PeriodID\":\"4\",\"Heading\":\"Lesson 4\",\"FromTime\":\"12.15\",\"ToTime\":\"13.15\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"4\",\"Room\":\"MCK13A\",\"Abbrev\":\"11DVC\",\"Desc\":\"Design and Visual Communication\",\"Teacher\":\"Mr B P Nelson\"}},{\"PeriodID\":\"5\",\"Heading\":\"House Meeting\",\"FromTime\":\"14.00\",\"ToTime\":\"14.30\",\"AdditionalData\":{\"Year\":\"11\",\"Period\":\"5\",\"Room\":\"CL1\",\"Abbrev\":\"TUTOR\",\"Desc\":\"House Tutor\",\"Teacher\":\"Mr S J Lawrenson\"}},{\"PeriodID\":\"6\",\"Heading\":\"Lesson 5\",\"FromTime\":\"14.30\",\"ToTime\":\"15.30\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"6\",\"Room\":\"HSC\",\"Abbrev\":\"11PHF\",\"Desc\":\"Physical Fitness\",\"Teacher\":\"Mr P C Connell\"}}]},{\"Date\":\"13/10/2020 00:00:00\",\"DateFormatted\":\"Tuesday 13th October, 2020\",\"weekDay\":\"Tuesday\",\"periodData\":[{\"PeriodID\":\"1\",\"Heading\":\"Lesson 1\",\"FromTime\":\"8.45\",\"ToTime\":\"9.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"1\",\"Room\":\"SL4\",\"Abbrev\":\"11PHY\",\"Desc\":\"Physics (Semester)\",\"Teacher\":\"Mr R B Hawley\"}},{\"PeriodID\":\"2\",\"Heading\":\"Lesson 2\",\"FromTime\":\"9.45\",\"ToTime\":\"10.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"2\",\"Room\":\"18\",\"Abbrev\":\"11MATA\",\"Desc\":\"Maths - Abstract\",\"Teacher\":\"Mr C P Zachariassen\"}},{\"PeriodID\":\"3\",\"Heading\":\"Lesson 3\",\"FromTime\":\"11.15\",\"ToTime\":\"12.15\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"3\",\"Room\":\"P10\",\"Abbrev\":\"11FRE\",\"Desc\":\"French\",\"Teacher\":\"Mr G M Wilson\"}},{\"PeriodID\":\"4\",\"Heading\":\"Lesson 4\",\"FromTime\":\"12.15\",\"ToTime\":\"13.15\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"4\",\"Room\":\"SL11\",\"Abbrev\":\"11PHCM\",\"Desc\":\"Physics and Chemistry\",\"Teacher\":\"Mr A N Slack\"}},{\"PeriodID\":\"5\",\"Heading\":\"Tutor Time\",\"FromTime\":\"14.00\",\"ToTime\":\"14.30\",\"AdditionalData\":{\"Year\":\"11\",\"Period\":\"5\",\"Room\":\"N1\",\"Abbrev\":\"TUTOR\",\"Desc\":\"House Tutor\",\"Teacher\":\"Mr S J Lawrenson\"}},{\"PeriodID\":\"6\",\"Heading\":\"Lesson 5\",\"FromTime\":\"14.30\",\"ToTime\":\"15.30\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"6\",\"Room\":\"MCK13A\",\"Abbrev\":\"11DVC\",\"Desc\":\"Design and Visual Communication\",\"Teacher\":\"Mr B P Nelson\"}}]},{\"Date\":\"14/10/2020 00:00:00\",\"DateFormatted\":\"Wednesday 14th October, 2020\",\"weekDay\":\"Wednesday\",\"periodData\":[{\"PeriodID\":\"1\",\"Heading\":\"Lesson 1\",\"FromTime\":\"8.45\",\"ToTime\":\"9.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"1\",\"Room\":\"19\",\"Abbrev\":\"11ENG\",\"Desc\":\"English\",\"Teacher\":\"Mrs T Tanuvasa\"}},{\"PeriodID\":\"2\",\"Heading\":\"Lesson 2\",\"FromTime\":\"9.45\",\"ToTime\":\"10.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"2\",\"Room\":\"SL4\",\"Abbrev\":\"11PHY\",\"Desc\":\"Physics (Semester)\",\"Teacher\":\"Mr R B Hawley\"}},{\"PeriodID\":\"3\",\"Heading\":\"Lesson 3\",\"FromTime\":\"11.15\",\"ToTime\":\"12.15\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"3\",\"Room\":\"18\",\"Abbrev\":\"11MATA\",\"Desc\":\"Maths - Abstract\",\"Teacher\":\"Mr C P Zachariassen\"}},{\"PeriodID\":\"4\",\"Heading\":\"Assembly\",\"FromTime\":\"12.15\",\"ToTime\":\"13.15\",\"AdditionalData\":{\"Year\":\"11\",\"Period\":\"4\",\"Room\":\"H1\",\"Abbrev\":\"TUTOR\",\"Desc\":\"House Tutor\",\"Teacher\":\"Mr S J Lawrenson\"}},{\"PeriodID\":\"5\",\"Heading\":\"Lunch - House Activities\",\"FromTime\":\"13.15\",\"ToTime\":\"14.30\",\"AdditionalData\":{}},{\"PeriodID\":\"6\",\"Heading\":\"Lesson 4\",\"FromTime\":\"14.30\",\"ToTime\":\"15.30\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"6\",\"Room\":\"P10\",\"Abbrev\":\"11FRE\",\"Desc\":\"French\",\"Teacher\":\"Mr G M Wilson\"}}]},{\"Date\":\"15/10/2020 00:00:00\",\"DateFormatted\":\"Thursday 15th October, 2020\",\"weekDay\":\"Thursday\",\"periodData\":[{\"PeriodID\":\"1\",\"Heading\":\"Lesson 1\",\"FromTime\":\"8.45\",\"ToTime\":\"9.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"1\",\"Room\":\"SL11\",\"Abbrev\":\"11PHCM\",\"Desc\":\"Physics and Chemistry\",\"Teacher\":\"Mr A N Slack\"}},{\"PeriodID\":\"2\",\"Heading\":\"Lesson 2\",\"FromTime\":\"9.45\",\"ToTime\":\"10.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"2\",\"Room\":\"N2\",\"Abbrev\":\"11PROJ\",\"Desc\":\"Project\",\"Teacher\":\"Mr C W Morrison\"}},{\"PeriodID\":\"3\",\"Heading\":\"Lesson 3\",\"FromTime\":\"11.15\",\"ToTime\":\"12.15\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"3\",\"Room\":\"19\",\"Abbrev\":\"11ENG\",\"Desc\":\"English\",\"Teacher\":\"Mrs T Tanuvasa\"}},{\"PeriodID\":\"4\",\"Heading\":\"Lesson 4\",\"FromTime\":\"12.15\",\"ToTime\":\"13.15\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"4\",\"Room\":\"SL4\",\"Abbrev\":\"11PHY\",\"Desc\":\"Physics (Semester)\",\"Teacher\":\"Mr R B Hawley\"}},{\"PeriodID\":\"5\",\"Heading\":\"Tutor Time\",\"FromTime\":\"14.00\",\"ToTime\":\"14.30\",\"AdditionalData\":{\"Year\":\"11\",\"Period\":\"5\",\"Room\":\"N1\",\"Abbrev\":\"TUTOR\",\"Desc\":\"House Tutor\",\"Teacher\":\"Mr S J Lawrenson\"}},{\"PeriodID\":\"6\",\"Heading\":\"Lesson 5\",\"FromTime\":\"14.30\",\"ToTime\":\"15.30\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"6\",\"Room\":\"18\",\"Abbrev\":\"11MATA\",\"Desc\":\"Maths - Abstract\",\"Teacher\":\"Mr C P Zachariassen\"}}]},{\"Date\":\"16/10/2020 00:00:00\",\"DateFormatted\":\"Friday 16th October, 2020\",\"weekDay\":\"Friday\",\"periodData\":[{\"PeriodID\":\"1\",\"Heading\":\"Lesson 1\",\"FromTime\":\"8.45\",\"ToTime\":\"9.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"1\",\"Room\":\"P10\",\"Abbrev\":\"11FRE\",\"Desc\":\"French\",\"Teacher\":\"Mr G M Wilson\"}},{\"PeriodID\":\"2\",\"Heading\":\"Lesson 2\",\"FromTime\":\"9.45\",\"ToTime\":\"10.45\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"2\",\"Room\":\"SL11\",\"Abbrev\":\"11PHCM\",\"Desc\":\"Physics and Chemistry\",\"Teacher\":\"Mr A N Slack\"}},{\"PeriodID\":\"3\",\"Heading\":\"Lesson 3\",\"FromTime\":\"11.15\",\"ToTime\":\"12.15\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"3\",\"Room\":\"MCK13A\",\"Abbrev\":\"11DVC\",\"Desc\":\"Design and Visual Communication\",\"Teacher\":\"Mr B P Nelson\"}},{\"PeriodID\":\"4\",\"Heading\":\"Lunch then Chapel (1 pm)\",\"FromTime\":\"12.15\",\"ToTime\":\"13.30\",\"AdditionalData\":{\"Year\":\"11\",\"Period\":\"4\",\"Room\":\"H1\",\"Abbrev\":\"TUTOR\",\"Desc\":\"House Tutor\",\"Teacher\":\"Mr S J Lawrenson\"}},{\"PeriodID\":\"5\",\"Heading\":\"Lesson 4\",\"FromTime\":\"13.30\",\"ToTime\":\"14.30\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"5\",\"Room\":\"19\",\"Abbrev\":\"11ENG\",\"Desc\":\"English\",\"Teacher\":\"Mrs T Tanuvasa\"}},{\"PeriodID\":\"6\",\"Heading\":\"Lesson 5\",\"FromTime\":\"14.30\",\"ToTime\":\"15.30\",\"AdditionalData\":{\"Year\":\"SS\",\"Period\":\"6\",\"Room\":\"SL4\",\"Abbrev\":\"11PHY\",\"Desc\":\"Physics (Semester)\",\"Teacher\":\"Mr R B Hawley\"}}]}]" );
}


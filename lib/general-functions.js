import { getOneMap, getMMDPublicUser, getMMDCustomersClients } from "./api";

export function formatDate(oldDate) {
    const date = new Date(oldDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function fileSizeReadable(fileSize) {
    let size = fileSize;
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

export const getMapData = async (id) => {
    let manualArray = [];
    let data = null;
    try {
        if (id) {
            data = await getOneMap({ id: id }, null, false);
            data.tags = data.tags.map(item => Number(item.id));
            [...data.mmdpublicusers, ...data.mmdcustomers].map((item) => {
                if (item.is_approved) {
                    manualArray.push(
                        {
                            type: "Feature",
                            geometry: item.geometry,
                            icon: item.icon,
                            properties: {
                                id: item.id,
                                ...item.properties,
                                type: item.public_user ? 'public' : 'customer',
                            }
                        })
                }
            })

        }
    } catch (e) {
        throw e;
    }
    finally {
        return { manualArray, data };
    }
}


export const getPublicMapData = async (publiUserId, mapId) => {
    let manualArray = [];
    try {
        if (mapId) {
            const data = await getMMDPublicUser({ map: mapId }, null, false)
            data.map((item) => {
                if (item.is_approved || Number(item.public_user.id) === publiUserId) {
                    manualArray.push(
                        {
                            type: "Feature",
                            geometry: item.geometry,
                            icon: item.icon,
                            properties: {
                                id: item.id,
                                ...item.properties,
                                type: 'public'
                            }
                        })
                }
            })

        }
    } catch (e) {
        throw e;
    }
    finally {
        return manualArray;
    }
}



export const getPublicAuthenticatedMapData = async (publiUserId, mapId) => {
    let manualArray = [];
    try {
        if (mapId) {
            const data = await getMMDPublicUser({ map: mapId, public_user: publiUserId, is_approved: false })
            data.map((item) => {
                manualArray.push(
                    {
                        type: "Feature",
                        geometry: item.geometry,
                        icon: item.icon,
                        properties: {
                            id: Number(item.id),
                            ...item.properties,
                            type: 'public'
                        }
                    })
            })

        }
    } catch (e) {
        throw e;
    }
    finally {
        return manualArray;
    }
}


export const getCustomerMapData = async (mapId) => {
    let manualArray = [];
    try {
        if (mapId) {
            const data = await getMMDCustomersClients({ map: mapId, is_approved: true }, null, false);
            data.map((item) => {
                manualArray.push(
                    {
                        type: "Feature",
                        geometry: item.geometry,
                        icon: item.icon,
                        properties: {
                            ...item.properties,
                            id: Number(item.id),
                            type: 'customer',
                        }
                    })
            })
        }
    } catch (e) {
        console.log(e)
        throw e;
    }
    finally {
        return manualArray;
    }
}


export const extractMapData = async (data) => {
    let manualArray = [];
    try {
        if (data) {
            [...data.mmdpublicusers, ...data.mmdcustomers].map((item) => {
                if (item.is_approved) {
                    manualArray.push(
                        {
                            type: "Feature",
                            geometry: item.geometry,
                            icon: item.icon,
                            properties: {
                                ...item.properties,
                                id: Number(item.id),
                                type: item.public_user ? 'public' : 'customer',
                            }
                        })
                }
            })

        }
    } catch (e) {
        throw e;
    }
    finally {
        return manualArray;
    }
}



export const getSpecifictPopup = (properties, type, allowedProperies) => {
    switch (type) {
        case 'dark-mode': return `<div class='dark-mode'>${generateData(properties, type, allowedProperies)}</div>`
        case 'white-mode': return `<div class='white-mode'>${generateData(properties, type, allowedProperies)}</div>`
        case 'color-mode': return `<div class='color-mode '>${generateData(properties, type, allowedProperies)}</div>`
        default: return `<div class='white-mode'>${generateData(properties, type, allowedProperies)}</div>`
    }
}

const generateData = (properties, type, allowedProperies) => {
    let details = '';
    let index = 0;
    Object.entries(properties).map((item) => {
        if (allowedProperies.find((obj) => obj.toLowerCase() === item[0].toLowerCase()) || !(allowedProperies.length > 0)
         && item[0].toLocaleLowerCase() !== 'id' && item[0].toLocaleLowerCase() !== 'editlayerid') {
            details += `<div class=" padding-10 ${type === 'color-mode' && index++ === 0 ? 'popup-header' : ''}">
                          <div>${item[0].toUpperCase()}</div>
                            <div  class='popup-bold'>${item[1]}</div>
                        </div>`
        }
    })
    return details;
}


export const generateImageLinkFormStyleUrl = (str) => {
    const a = str.indexOf("tiles");
    const b = str.indexOf("access_token");
    return str.replace(str.substring(a, b), 'static/-87.0186,32.4055,10/70x60?');
}



const changeJsonToArray=(rows,cols)=>{

    var result=[];
       rows.map((row)=>{
           var item=Array(cols.size);
           for(var i in row){
                for(var j in cols){
                    if(cols[j]==i){
                        item[j]=row[i];
                    }
                    // if(cols[j]=='is_approved'){
                    //     cols[j]=DATASET.APPROVED;
                    // }
                    // else if(cols[j]=='publicAddress'){
                    //     cols[j]=DATASET.PUBLIC_USERS;
                    // }
                }
           }
           result.push(item);
       })

    return result;
  }

  



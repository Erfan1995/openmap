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

            [...data.mmdpublicusers, ...data.mmdcustomers].map((item) => {
                if (item.is_approved) {
                    manualArray.push(
                        {
                            type: "Feature",
                            geometry: item.geometry,
                            properties: {
                                id: item.id,
                                title: item.title,
                                description: item.description,
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
                item.public_user.id = Number(item.public_user.id);
                if (item.is_approved || item.public_user.id === publiUserId) {
                    manualArray.push(
                        {
                            type: "Feature",
                            geometry: item.geometry,
                            properties: {
                                id: item.id,
                                title: item.title,
                                description: item.description,
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
                        properties: {
                            id: Number(item.id),
                            title: item.title,
                            description: item.description,
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
                        properties: {
                            id: Number(item.id),
                            title: item.title,
                            description: item.description,
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
                            properties: {
                                id: Number(item.id),
                                title: item.title,
                                description: item.description,
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
    let index=0;
    Object.entries(properties).map((item) => {
        if (allowedProperies.find((obj) => obj.toLowerCase() === item[0].toLowerCase())) {
            details += `<div class=" padding-10 ${type === 'color-mode' && index++ === 0 ? 'popup-header' : ''}">
                          <div>${item[0].toUpperCase()}</div>
                            <div  class='popup-bold'>${item[1]}</div>
                        </div>`
        }
    })
    return details;
}
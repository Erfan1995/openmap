import { message } from "antd";
import Router from "next/router";
import { getOneMap, getMMDPublicUser, getMMDCustomersClients, putMethodPublicUser, checkPublicUsersMapBased, getPublicUsers, postMethodPublicUser, getMapVisits, getIp, putMethod } from "./api";

export function formatDate(oldDate) {
    const date = new Date(oldDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function fileSizeReadable(fileSize) {
    let size = fileSize;
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

export const getMapData = async (id) => {
    let manualArray = [];
    let data = null;
    try {
        if (id) {
            data = await getOneMap({ id: id }, null, false);
            data.tags = data.tags.map(item => Number(item.id));

            let temp = null;
            data?.surveys?.map((obj) => {
                temp = data?.mapsurveyconfs?.find((ele) => parseInt(ele.survey.id) === parseInt(obj.id));
                [...obj.mmdpublicusers, ...obj.mmdcustomers].map((item) => {
                    if (item.is_approved) {
                        manualArray.push(
                            {
                                type: "Feature",
                                geometry: item.geometry,
                                icon: item.icon,
                                mapSurveyConf: temp,
                                properties: {
                                    ...item.properties,
                                    id: Number(item.id),
                                    type: item.public_user ? 'public' : 'customer',
                                }
                            })
                    }
                })
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
            let temp = null;
            data?.surveys?.map((obj) => {
                temp = data?.mapsurveyconfs?.find((ele) => parseInt(ele.survey.id) === parseInt(obj.id));
                [...obj.mmdpublicusers, ...obj.mmdcustomers].map((item) => {
                    if (item.is_approved) {
                        manualArray.push(
                            {
                                type: "Feature",
                                geometry: item.geometry,
                                icon: item.icon,
                                mapSurveyConf: temp,
                                pubDate: item.updated_at,
                                address: item.address,
                                properties: {
                                    ...item.properties,
                                    id: Number(item.id),
                                    type: item.public_user ? 'public' : 'customer',
                                }
                            })
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





export const extractMapDataPublicUser = async (data, publicAddress) => {
    let manualArray = [];
    try {
        if (data) {
            let temp = null;
            data?.surveys?.map((obj) => {
                temp = data?.mapsurveyconfs?.find((ele) => parseInt(ele.survey.id) === parseInt(obj.id));
                [...obj.mmdpublicusers].map((item) => {
                    if (!item.is_approved) {
                        manualArray.push(
                            {
                                type: "Feature",
                                geometry: item.geometry,
                                icon: item.icon,
                                mapSurveyConf: temp,
                                pubDate: item.updated_at,
                                address: item.address,
                                properties: {
                                    ...item.properties,
                                    id: Number(item.id),
                                    type: 'public',
                                }
                            })
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



export const extractMapDataPublic = async (data) => {
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
                            // mapSurveyConf:item?.survey?.mapsurveyconfs,
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



export const getSpecifictPopup = (properties, type, allowedProperies, newTitleProp) => {
    const result = generateData(properties, type, allowedProperies, newTitleProp);
    switch (type) {
        case 'dark-mode': return `<div class='dark-mode'>${result}</div>`
        case 'white-mode': return `<div class='white-mode'>${result}</div>`
        case 'color-mode': return `<div class='color-mode '>${result}</div>`
        default: return `<div class='white-mode'>${result}</div>`
    }
}

const generateData = (properties, type, allowedProperies, newTitleProp) => {
    let details = '';
    let index = 0;
    Object.entries(properties).map((item) => {
        if (allowedProperies.find((obj) => obj.toLowerCase() === item[0].toLowerCase()) || !(allowedProperies.length > 0)
            && item[0].toLocaleLowerCase() !== 'id' && item[0].toLocaleLowerCase() !== 'editlayerid') {
            details += `<div class=" padding-10 ${type === 'color-mode' && index++ === 0 ? 'popup-header' : ''}">
                          <div>${newTitleProp && Object.entries(newTitleProp).find(ele => ele[0] === item[0]) ?
                    newTitleProp[item[0]].toUpperCase() : item[0].toUpperCase()
                }</div >
            <div class='popup-bold'>${item[1]}</div>
                        </div > `
        }
    })
    return details;
}
export const generateListViewDataset = (datasets, survey) => {
    let listviewData = [];
    datasets.map((data) => {
        data.datasetcontents.map((content) => {
            let eachDatasetResult = [];
            Object.entries(content.properties).map((item) => {
                if (data.config.listview_dataset_properties && data.config.listview_dataset_properties.find((obj) => obj === item[0]) && data.config.listview_dataset_properties.length > 0
                    && item[0] != 'id') {
                    if (data.config.listview_edited_dataset_properties) {
                        let propertyNames = Object.entries(data.config.listview_edited_dataset_properties)
                        propertyNames.find((element) => {
                            if (element[0] === item[0]) {
                                let obj = {};
                                obj[element[1]] = item[1];
                                eachDatasetResult.push(obj);
                            }
                        })

                    } else if (data.config.listview_dataset_properties.length > 0) {
                        data.config.listview_dataset_properties.find((element) => {
                            if (element === item[0]) {
                                let obj = {};
                                obj[element] = item[1];
                                eachDatasetResult.push(obj);
                            }
                        })
                    }
                }
            });
            if (eachDatasetResult.length > 0) {
                listviewData.push({
                    'data': eachDatasetResult, 'address': content.properties?.address ? content.properties?.address : content.properties?.Address, 'pubDate': data?.updated_at,
                    'metaData': { 'title': content.properties?.title, 'description': content.properties?.description },
                    'progressbar': {
                        'steps': data.config.dataset_progressbars, 'acitveStep': data.config.selected_step,
                        'progressbarStyle': data.config.progress_bar_default_style, 'progressbarColor': data.config.progressbar_color,
                        'progressbarStatus': data.config.progressbar_selected
                    }
                })
            }
        })
    })
    return listviewData;
}
export const generateListViewSurvey = (manualMapData, survey) => {
    let listviewData = [];
    manualMapData.map((data) => {
        let eachSurveyResult = [];
        Object.entries(data.properties).map((item) => {
            if (data.mapSurveyConf.listview_survey_properties?.find((obj) => obj === item[0]) && data.mapSurveyConf.listview_survey_properties.length > 0
                && item[0] != 'id' && item[0] != 'geolocation') {
                if (data.mapSurveyConf.listview_edited_survey_properties) {
                    let propertyNames = Object.entries(data.mapSurveyConf.listview_edited_survey_properties)
                    propertyNames.find((element) => {
                        if (element[0] === item[0]) {
                            let obj = {};
                            if (typeof item[1] !== 'object') {
                                obj[element[1]] = item[1];
                                eachSurveyResult.push(obj);
                            }
                        }
                    })

                } else {
                    data.mapSurveyConf.listview_survey_properties.find((element) => {
                        if (element === item[0]) {
                            let obj = {};
                            if (typeof item[1] !== 'object') {
                                obj[element[1]] = item[1];
                                eachSurveyResult.push(obj);
                            }
                        }
                    })
                }
            }
        });
        let surveyInfo;
        survey.map((item) => {
            if (item.id == data.mapSurveyConf.survey.id) {
                surveyInfo = { 'title': item.forms.title, 'description': item.forms.description };
            }
        })
        listviewData.push({
            'data': eachSurveyResult, 'pubDate': data.pubDate, 'metaData': surveyInfo, 'address': data.address,
            'progressbar': {
                'steps': data.mapSurveyConf.survey_progressbars, 'acitveStep': data.mapSurveyConf.selected_step,
                'progressbarStyle': data.mapSurveyConf.progress_bar_default_style, 'progressbarColor': data.mapSurveyConf.progressbar_color,
                'progressbarStatus': data.mapSurveyConf.progressbar_selected
            },
            'latlng': data.properties.geolocation
        });
    });
    listviewData.sort(function (obj1, obj2) {
        let objDate1 = new Date(obj1.pubDate);
        let objDate2 = new Date(obj2.pubDate);
        if (objDate2 < objDate1) return -1;
        if (objDate2 > objDate1) return 1;
        return 0
    })
    return listviewData;
}
export const timeSince = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;

    if (interval > 1) {
        return "More than " + Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return "More than " + Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return "More than " + Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return "More than " + Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return "More than " + Math.floor(interval) + " minutes ago";
    }
    return "More than " + Math.floor(seconds) + " seconds ago";
}
export const generateImageLinkFormStyleUrl = (str) => {
    const a = str.indexOf("tiles");
    const b = str.indexOf("access_token");
    return str.replace(str.substring(a, b), 'static/-87.0186,32.4055,10/70x60?');
}



const changeJsonToArray = (rows, cols) => {

    var result = [];
    rows.map((row) => {
        var item = Array(cols.size);
        for (var i in row) {
            for (var j in cols) {
                if (cols[j] == i) {
                    item[j] = row[i];
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



const handleVisits = async (mapData) => {
    const res = await getMapVisits({ id: mapData.id })
    if (res) {
        await putMethodPublicUser(`maps/${mapData.id}`, { visits: (res.visits + 1) })
    }
}



export const publicUserOperation = async (publicAddress, mapData) => {
    try {
        handleVisits(mapData);
        const res = await getPublicUsers({ publicAddress: publicAddress })
        if ((res?.length > 0)) {
            const ipResponse = await getIp();
            if (ipResponse) {
                await putMethod(`public-users/${res[0].id}`, { ip: ipResponse.ip })
            }

            let mapIds = [];
            res[0]?.maps.map((data) => {
                mapIds.push(Number(data.id));
            })
            mapIds.map(id => {
                if (id !== Number(mapData.id)) {
                    mapIds.push(Number(mapData.id))
                }
            })
            const checkUser = await checkPublicUsersMapBased({ publicAddress: publicAddress, maps: mapData.id });
            if (checkUser.publicUsers.length === 0) {
                const update = await putMethodPublicUser(`public-users/${res[0].id}`, { maps: mapIds.map(dd => dd) });
                if (update) {
                    Router.push({
                        pathname: '/client/map',
                        query: { mapToken: mapData.mapId, id: mapData.id, publicUserId: res[0].id, publicUserAddress: publicAddress }
                    });
                }
            } else {
                Router.push({
                    pathname: '/client/map',
                    query: { mapToken: mapData.mapId, id: mapData.id, publicUserId: res[0].id, publicUserAddress: publicAddress }
                });
            }
        } else {
            const ipResponse = await getIp();
            const response = await postMethodPublicUser('public-users', { publicAddress: publicAddress, maps: mapData.id, ip: ipResponse.ip });
            if (response) {
                Router.push({
                    pathname: '/client/map',
                    query: { mapToken: mapData.mapId, id: mapData.id, publicUserId: response.id, publicUserAddress: publicAddress }
                });
            }
        }
    } catch (e) {
        message.error(e.message);
        return;
    }


};

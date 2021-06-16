import { getMethod } from "./api";

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
    try {
        if (id) {
            const data = await getMethod(`maps/${id}`, null, true);
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
    finally{
        return manualArray;
    }
}
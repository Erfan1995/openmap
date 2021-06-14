export function formatDate(oldDate) {
    const date = new Date(oldDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function fileSizeReadable(fileSize) {
    let size = fileSize;
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}


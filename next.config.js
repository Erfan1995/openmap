const withImages = require('next-images')
module.exports = withImages()
module.exports = {
    env: {
        NEXT_PUBLIC_STRAPI_API_URL: 'http://localhost:1337',
        NEXT_PUBLIC_MAPBOX_TOKEN: 'sk.eyJ1IjoibWJzaGFiYW4iLCJhIjoiY2tvam1zajVyMGZuajJxcHY1ZDIzYnBrbiJ9.zkBD6Rn9vn8lscIdh9MeNg',
        NEXT_PUBLIC_MAPBOX_API_URL: 'https://api.mapbox.com',
        NEXT_PUBLIC_MAPBOX_DEFAULT_MAP: 'cknmtc2iz285r17pb0pdidcj8',
        NEXT_PUBLIC_SECRET_KEY:'cknmtc2iz285r17pb0pdidcj8'

    },
}
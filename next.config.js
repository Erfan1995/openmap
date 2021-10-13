const withImages = require('next-images')
module.exports = withImages()
module.exports = {
    env: {
        // NEXT_PUBLIC_STRAPI_API_URL: 'https://openmaps1.herokuapp.com',
        NEXT_PUBLIC_STRAPI_API_URL: 'http://localhost:1337',
        NEXT_PUBLIC_BASEPATH_URL: 'https://openmap-pro.vercel.app',
        NEXT_PUBLIC_MAPBOX_TOKEN: 'sk.eyJ1IjoibWJzaGFiYW4iLCJhIjoiY2tvam1zajVyMGZuajJxcHY1ZDIzYnBrbiJ9.zkBD6Rn9vn8lscIdh9MeNg',
        NEXT_PUBLIC_MAPBOX_API_URL: 'https://api.mapbox.com',
        NEXT_PUBLIC_MAPBOX_DEFAULT_MAP: 'https://api.mapbox.com/styles/v1/mbshaban/cknmtc2iz285r17pb0pdidcj8/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWJzaGFiYW4iLCJhIjoiY2tubXBlOHN4MDZzMzJubGFlNXYzemphbSJ9.03KzYzfwzZnWULV-WphldQ',
        NEXT_PUBLIC_SECRET_KEY: 'cknmtc2iz285r17pb0pdidcj8',
        NEXT_PUBLIC_MAPBOX_IMAGES_STYLE: 'cknmtc2iz285r17pb0pdidcj8',
        NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY: 'AIzaSyB_VDWRbprK5cMsT-mj0dgAR-G2bMyHLKU',
        NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID: '607167356748-sdjmef39r0691gitear1td49g7r427be.apps.googleusercontent.com',
        NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: 'pk_live_DF5FB90D1FB9EBB8',
        MAGIC_SECRET_KEY: 'sk_live_FAE1E93394E6DD2C',
        NEXT_PUBLIC_BASEPATH_URL: 'http://localhost:3000'
    },
    webpack: (config, { isServer }) => {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
            config.node = {
                fs: 'empty'
            }
        }

        return config
    }
}
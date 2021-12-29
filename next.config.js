const withImages = require('next-images')
module.exports = withImages()
module.exports = {
    env: {
       NEXT_PUBLIC_STRAPI_API_URL: 'https://openmaps1.herokuapp.com',
        // NEXT_PUBLIC_STRAPI_API_URL: 'http://localhost:1337',
        // NEXT_PUBLIC_BASEPATH_URL: 'http://localhost:3000',
        NEXT_PUBLIC_BASEPATH_URL: 'https://openmaps.link',
        NEXT_PUBLIC_MAPBOX_TOKEN: 'sk.eyJ1IjoiaW50ZWxsaW5ldHdvcmsiLCJhIjoiY2t2MG00aWZwMmlzNDJ2bzBleGVsNWcxeiJ9.al2buRR819pFr268RJ0-kQ',
        NEXT_PUBLIC_MAPBOX_API_URL: 'https://api.mapbox.com',
        NEXT_PUBLIC_MAPBOX_DEFAULT_MAP: 'https://api.mapbox.com/styles/v1/intellinetwork/cks24vvb70v3n17oq94jm4h0e/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaW50ZWxsaW5ldHdvcmsiLCJhIjoiY2tkcTRiaHp4MWp2ajJxcGpvbGJ4cXplYiJ9.aza6_kJaqBTFzXj4jTCWVg',
        NEXT_PUBLIC_SECRET_KEY: 'cknmtc2iz285r17pb0pdidcj8',
        NEXT_PUBLIC_MAPBOX_IMAGES_STYLE: 'cknmtc2iz285r17pb0pdidcj8',
        NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY: 'AIzaSyBNAqRQb04cDRy_J000ZExO9BP059njz6w',
        NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID: '444357902281-6dtv2fm157sdr3kil7nn0744e0r1olps.apps.googleusercontent.com',
        NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: 'pk_live_821D777D0B037D7F',
        MAGIC_SECRET_KEY: 'sk_live_630CF475890D028F',
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


import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const LeafletgeoSearch = () => {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider,
            style: 'button',
            showMarker: false,
            searchLabel: 'Enter address',
            animateZoom: true,
            
        });

        map.addControl(searchControl);

        return () => map.removeControl(searchControl);
    }, []);

    return null;
}

export default LeafletgeoSearch;
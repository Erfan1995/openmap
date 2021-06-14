import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip,GeoJSON,Polygon,Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
const MapImage = ({style}) => {

  const defaultPosition = [40,-74];

  return (

    <MapContainer
      center={defaultPosition}
      zoom={8}
      scrollWheelZoom={false}
      style={style} >
      <TileLayer
        url={`${process.env.NEXT_PUBLIC_MAPBOX_API_URL}/styles/v1/mbshaban/cknmtc2iz285r17pb0pdidcj8/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
      />
    </MapContainer>

  );
};



export default MapImage;
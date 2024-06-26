import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";


const MapImage = ({  mapData, manualMapData, datasets }) => {

  return (
    <MapContainer
      center={mapData.center}
      zoom={mapData.zoomLevel}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{ height: "100vh" }} >

      <TileLayer
        url={mapData.mapstyle?.link || process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP}
      />
      {
        datasets && datasets.map((item) => {
          return <GeoJSON key={item.title + item.id} data={item.datasetcontents} />
        })
      }
      {
        manualMapData &&
        <GeoJSON key={'manual'} data={manualMapData} />
      }
    </MapContainer>

  );
};



export default MapImage;
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import EditableGroup from "./Map";


const EditMap = ({ styleId, style, manualMapData, draw, edit,onUpdateEvent,mapData }) => {

  let dataLayer = new L.GeoJSON(manualMapData);

  const defaultPosition =dataLayer.getBounds().getCenter();

  const onUpdate = (e) => {
    let data = null;
    e.layers.getLayers().forEach(layer => {
      if (manualMapData.geometry.type.toLowerCase() === 'polygon') {
        data = { type: 'Polygon', coordinates: [layer.getLatLngs()[0].map((item) => [item.lng, item.lat])] };
      } else {
        data = { type: 'Point', coordinates: [layer._latlng.lng, layer._latlng.lat] };
      }
    });
    onUpdateEvent(data);
  }

  const onDeleted = (e) => {
    console.log('ondelete');
  }


  return (
    <MapContainer
      center={defaultPosition}
      zoom={mapData.zoomLevel}
      scrollWheelZoom={false}
      zoomControl={false}
      style={style} >
      <ZoomControl position='bottomleft' />
      <TileLayer
        url={`${process.env.NEXT_PUBLIC_MAPBOX_API_URL}/styles/v1/mbshaban/${styleId || process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP}/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
      />
      <EditableGroup dataLayer={dataLayer} onUpdate={onUpdate} draw={draw} edit={edit} onDeleted={onDeleted} manualMapData={manualMapData} />
    </MapContainer>

  );
};

export default EditMap;
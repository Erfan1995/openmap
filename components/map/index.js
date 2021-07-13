import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useState } from "react";
import Preview from "./Preview";
import EditControlExample from "./map2";
import { Button, message } from "antd";
import styled from 'styled-components';
import { getSpecifictPopup } from "lib/general-functions";
import L from 'leaflet';
import LeafletgeoSearch from "./MapSearch";
import { getStrapiMedia } from "lib/media";
import { MapIconSize } from "lib/constants";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
});

const SaveButton = styled(Button)`
  margin-bottom: 10px;
  margin-right:10px;
  float: right !important;
`;

const ZoomButton = styled.div`
width: 34px;
height: 32px;
line-height: 30px;
background-color:#ffffff;
text-align:center;
bottom:74px;
left:10px;
font-size: 18px;
border-radius:3px ;
border: 1px solid #aaa;

`;



const TopButtonWrapper = styled.div`
  margin-top: -60px;
  margin-right:-10px;
  float: right !important;

  @media (max-width: 990px) {

    margin-top: 10px;
    margin-right:-10px;
  }
`;


const Map = ({ styleId, center, setCenter, style, mapData, manualMapData, datasets, edit, draw, userType, userId, onMapDataChange }) => {

  const [openModal, setOpenModal] = useState(null);
  const [place, setPlace] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(mapData.zoomLevel);

  const closePlaceDetails = () => {
    setOpenModal(false)
  }

  const MapEvents = () => {
    const map = useMapEvents({
      zoom(e) {
        const zoom = e.target._zoom;
        localStorage.setItem('zoom', zoom)
        setZoomLevel(zoom);
      }
    })
    return <div></div>
  }

  const changeCountryColor = (event) => {
    setPlace(event.target.feature);
    setOpenModal(true);
  }




  const onChange = async () => {
    onMapDataChange();
  }

  function setMapCenter() {

    const arr = [];
    datasets?.map(item => item.datasetcontents).map(obj => obj.map(j => arr.push(j)));
    let leafletGeoJSON = new L.GeoJSON([...manualMapData, ...arr]);
    // console.log('center', JSON.stringify());

    setCenter(leafletGeoJSON.getBounds().getCenter());
  }

  return (
    <div>
      {
        userType === 'customer' &&
        <TopButtonWrapper >
          <SaveButton icon={<img style={{ marginTop: '-5px' }} src='/focus.png' />} onClick={setMapCenter} />
        </TopButtonWrapper>
      }
      <div style={{ clear: 'both' }}>

        <MapContainer
          center={center || [10, 20]}
          zoom={zoomLevel || 8}
          scrollWheelZoom={false}
          zoomControl={false}
          style={style} >

          <ZoomControl position='bottomleft' />
          <TileLayer
            url={`${process.env.NEXT_PUBLIC_MAPBOX_API_URL}/styles/v1/mbshaban/${styleId || process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP}/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
          />
          <LeafletgeoSearch />
          <MapEvents />
          <EditControlExample onChange={onChange} draw={draw}
            edit={edit} manualMapData={manualMapData} mapData={mapData} userType={userType} userId={userId} />

          {
            datasets && datasets.map((item) => {
              return <GeoJSON pointToLayer={(feature, latlng) => {
                const iconUrl = getStrapiMedia(item.config.icon?.icon[0]);

                if (!iconUrl) return L.marker(latlng);

                return L.marker(latlng, {
                  icon: new L.icon({ iconUrl: iconUrl, iconSize: MapIconSize })
                })
              }} key={item.title + item.id} data={item.datasetcontents} onEachFeature={(feature, layer) => {
                const { properties } = feature;
                if (!properties) return;
                layer.bindPopup(`<div>${getSpecifictPopup(properties, item.config.default_popup_style_slug || '', item.config.selected_dataset_properties || [])}</div>`)

              }} />
            })
          }

          {openModal &&
            <Preview
              isVisible={openModal}
              onDataSaved={onchange}
              place={place}
              mapData={mapData}
              dataType={'dataset'}
              userType={userType}
              closePlaceDetails={closePlaceDetails}
            />
          }

          {
            userType === 'customer' &&
            <ZoomButton className='leaflet-control leaflet-bottom leaflet-left' style={{ bottom: '74px', left: '10px' }} type='default'>{zoomLevel}</ZoomButton>
          }
        </MapContainer>

      </div>
    </div>
  );
};



export default Map;
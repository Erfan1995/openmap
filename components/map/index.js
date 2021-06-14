import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from "react";
import Preview from "./Preview";
import EditControlExample from "./map2";
import { getMethod } from "lib/api";
import { Button, message } from "antd";
import styled from 'styled-components';
const SaveButton = styled(Button)`
  margin-bottom: 10px;
  margin-right:10px;
  float: right !important;
`;

const TopButtonWrapper = styled.div`
  margin-top: -67px;
  margin-right:70px;
  float: right !important;

  @media (max-width: 990px) {

    margin-top: 10px;
    margin-right:-10px;
  }
`;


const Map = ({ styleId, center, setCenter, style, mapData, manualMapData, datasets, edit, draw, userType, userId }) => {

  const [openModal, setOpenModal] = useState(null);
  const [place, setPlace] = useState(null);
  const [customMapData, setCustomMapData] = useState(manualMapData || []);
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
    let manualArray = [];
    try {
      if (mapData) {
        const data = await getMethod(`maps/${mapData.id}`, null, true);
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
      message.error(e.message);
    }
    setCustomMapData(manualArray);
  }



  function setMapCenter() {
    setCenter(JSON.parse(localStorage.getItem('center')));
  }
  return (

    <div>
      {
        userType === 'customer' &&
        <TopButtonWrapper >

          <SaveButton type='primary' onClick={setMapCenter}>set Center</SaveButton>

          <SaveButton type='default'>{zoomLevel}</SaveButton>

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

          <MapEvents />
          <EditControlExample onChange={onChange} draw={draw}
            edit={edit} manualMapData={customMapData} mapData={mapData} userType={userType} userId={userId} />

          {
            datasets && datasets.map((item) => {
              return <GeoJSON key={item.title + item.id} data={item.datasetcontents} onEachFeature={(item, layer) => {
                layer.on({
                  click: changeCountryColor
                })
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

        </MapContainer>
      </div>
    </div>
  );
};



export default Map;
import { Popup, MapContainer, TileLayer, Marker, GeoJSON, ZoomControl, useMapEvents, useMap, MapConsumer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useState } from "react";
import Preview from "./Preview";
import EditControlExample from "./map2";
import { getMethod } from "lib/api";
import { message } from "antd";
import { getCustomerMapData, getMapData, getPublicMapData } from "lib/general-functions";



const PublicMap = ({ styleId, mapZoom, style, mapData, manualMapData, datasets, edit, draw, userType, userId }) => {

    const [openModal, setOpenModal] = useState(null);
    const [place, setPlace] = useState(null);
    const [customMapData, setCustomMapData] = useState(manualMapData);

    const closePlaceDetails = () => {
        setOpenModal(false)
    }

    const MapEvents = () => {
        const map = useMapEvents({
            zoom(e) {
                const zoom = e.target._zoom;
                localStorage.setItem('zoom', zoom)
            }
        })
        return <div></div>
    }


    const showDetails = (event) => {
        setPlace(event.target.feature);
        setOpenModal(true);
    }

    const onChange = async () => {
        try {
            setCustomMapData([...await getCustomerMapData(mapData.id), ...await getPublicMapData(userId, mapData.id)]);
        } catch (e) {
            message.error(e.message);
        }
    }


    return (


        <MapContainer
            center={mapData.center}
            zoom={mapZoom}
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
                            click: showDetails
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

    );
};



export default PublicMap;
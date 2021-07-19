import dynamic from "next/dynamic";
import LayoutPage from "components/client/layout";
import { useEffect, useState } from "react";
import UseAuth from "hooks/useAuth";
import {  getOneMap, getDatasetsByMap, getInjectedCodes } from "lib/api";
import { extractMapData, getPublicAuthenticatedMapData } from "lib/general-functions";
const Map = ({ manualMapData, mapData, datasets, injectedcodes }) => {

  const [loading, setLoading] = useState(true);
  const [publicUser, setPublicUser] = useState(true);
  const [datasetData, setDatasetData] = useState(datasets);
  const [zoomLevel, setZoomLevel] = useState(mapData.zoomLevel);

  const { login, logout } = UseAuth();

  useEffect(async () => {
    const res = await login(mapData);
    if (res) {
      setPublicUser(res[0]);
      setLoading(false);
    }
    // setDatasetData(datasets);
  }, [])

  const onDataSetChange = (list) => {
    let arr = [];
    list.map(item => {
      datasets.map(obj => {
        if (obj.id === item) {
          arr.push(obj);
        }
      })
    })
    setZoomLevel(localStorage.getItem('zoom') || mapData.zoomLevel);
    setDatasetData(arr);
  }
  const MapWithNoSSR = dynamic(() => import("../../components/map/publicMap"), {
    ssr: false
  });

  return (
    <div>
      {!loading &&
        
        <LayoutPage injectedcodes={injectedcodes} walletAddress={publicUser.publicAddress} datasets={datasets}  onDataSetChange={onDataSetChange}
          mapInfo={mapData} userId={publicUser.id} publicUser={publicUser} mapData={mapData}  >
          <MapWithNoSSR
            mapZoom={zoomLevel}
            styleId={mapData.mapstyle.link || ''}
            edit={{
              edit: false,
              remove: false,
            }}
            draw={{
              rectangle: false,
              polygon: false,
              circle: false,
              circlemarker: false,
              polyline: false
            }}
            userType='public'
            manualMapData={manualMapData}
            datasets={datasetData}
            mapData={mapData}
            userId={publicUser.id}
            style={{ height: "100vh" }} />
        </LayoutPage>
      }
     
    </div>
  );
}
export default Map;

export async function getServerSideProps(ctx) {
  let mapData = null;
  let injectedcodes = null;
  const { mapToken, id, publicUser } = ctx.query;
  try {
    let datasets = [];
    if (id) {
      mapData = await getOneMap({ id: id });
      if (mapData) {
        datasets = await getDatasetsByMap({ maps: id }, null, false);
        datasets = datasets.map((item) => {
          let temp = mapData.mapdatasetconfs.find((obj) => obj.dataset.id === item.id);
          return { ...item, config: temp ? temp : null }
        })
      }

      injectedcodes = await getInjectedCodes({ map: id }, null, false);
    }

    return {
      props: {
        manualMapData: [...await extractMapData(mapData), ...await getPublicAuthenticatedMapData(publicUser, mapData.id)]
        , mapData: mapData,
        datasets: datasets,
        injectedcodes: injectedcodes
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: '/server-error',
        permanent: false,
      }
    }
  }

}

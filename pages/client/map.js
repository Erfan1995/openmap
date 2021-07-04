import dynamic from "next/dynamic";
import LayoutPage from "components/client/layout";
import { useEffect, useState } from "react";
import UseAuth from "hooks/useAuth";
import { getMethod, getOneMap, getAllMaps } from "lib/api";
import { extractMapData, getPublicAuthenticatedMapData } from "lib/general-functions";
const Map = ({ manualMapData, mapData, datasets }) => {

  const [loading, setLoading] = useState(true);
  const [publicUser, setPublicUser] = useState(true);
  const [datasetData, setDatasetData] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(mapData.zoomLevel);

  const { login, logout } = UseAuth();

  useEffect(async () => {
    const res = await login(mapData);
    if (res) {
      setPublicUser(res[0]);
      setLoading(false);
    }
    setDatasetData(datasets);
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
        <LayoutPage walletAddress={publicUser.publicAddress} datasets={datasets} onDataSetChange={onDataSetChange} mapInfo={mapData}  >
          <MapWithNoSSR draw={{
            rectangle: false,
            polygon: false,
            circle: false,
            circlemarker: false,
            polyline: false
          }}
            mapZoom={zoomLevel}
            styleId={mapData ? mapData.styleId : process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP}
            edit={{
              edit: false,
              remove: false,
            }}
            userType='public'
            userId={publicUser.id}
            manualMapData={manualMapData} datasets={datasetData} mapData={mapData}
            style={{ height: "100vh" }} />
        </LayoutPage>
      }
    </div>
  );
}
export default Map;

export async function getServerSideProps(ctx) {
  let mapData = null;
  let datasetData = null;
  const { mapToken, id, publicUser } = ctx.query;
  try {
    if (id) {
      mapData = await getMethod(`maps?id=${id}&mapId=${mapToken}`, null, false);
      // mapData = await getOneMap({ mapId: mapToken, id: id }, null, false);
      // console.log(mapData, '>>>>>>>');
      if (!mapData.length > 0) {
        return {
          redirect: {
            destination: '/server-error',
            permanent: false,
          }
        }
      }
      datasetData = await getMethod(`datasets?_where[0][maps.id]=${id}`, null, false);

    }

    return {
      props: {
        manualMapData: [...await extractMapData(mapData[0]), ...await getPublicAuthenticatedMapData(publicUser, mapData[0].id)]
        , mapData: mapData[0],
        datasets: datasetData
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

import dynamic from "next/dynamic";
import LayoutPage from "components/client/layout";
import { useEffect, useState } from "react";
import UseAuth from "hooks/useAuth";
import { getMethod } from "lib/api";
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
    setZoomLevel(localStorage.getItem('zoom'));
    setDatasetData(arr);
  }
  const MapWithNoSSR = dynamic(() => import("../../components/map/publicMap"), {
    ssr: false
  });

  return (
    <div>
      { !loading &&
        <LayoutPage walletAddress={publicUser.publicAddress} datasets={datasets} onDataSetChange={onDataSetChange}  >
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
  let manualArray = [];
  const { mapToken, id } = ctx.query;
  try {
    if (id) {
      mapData = await getMethod(`maps?id=${id}&mapId=${mapToken}`, null, false);
      if(!mapData.length > 0){
        return {
          redirect: {
            destination: '/server-error',
            permanent: false,
          }
        }
      }
      datasetData = await getMethod(`datasets?_where[0][maps.id]=${id}`, null, false);

      [...mapData[0].mmdpublicusers, ...mapData[0].mmdcustomers].map((item) => {
        if (item.is_approved) {
          manualArray.push(
            {
              type: "Feature",
              geometry: item.geometry,
              properties: {
                id: item.id,
                title: item.title,
                description: item.description,
                type: item.geometry.type
              }
            })
        }
      })

    }

    return {
      props: {
        manualMapData:
          manualArray
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

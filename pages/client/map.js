import dynamic from "next/dynamic";
import LayoutPage from "components/client/layout";
import { useEffect, useState } from "react";
import UseAuth from "hooks/useAuth";
import { Spin } from 'antd';
import { getDatasetsByMap, getClientMapData } from "lib/api";
import { extractMapData, getCustomerMapData, getPublicAuthenticatedMapData, getPublicMapData } from "lib/general-functions";
const Map = ({ manualMapData, mapData, datasets, injectedcodes }) => {

  const [intiLoading, setInitLoading] = useState(true);
  const [publicUser, setPublicUser] = useState(true);
  const [datasetData, setDatasetData] = useState(datasets);
  const [zoomLevel, setZoomLevel] = useState(mapData.zoomLevel);
  const [customMapData, setCustomMapData] = useState(manualMapData);
  const [loading, setLoading] = useState(false);

  const { login, logout } = UseAuth();

  useEffect(async () => {
    const res = await login(mapData);
    if (res) {
      setPublicUser(res[0]);
      setInitLoading(false);
    }
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

  const onCustomeDataChange = async () => {
    setLoading(true);
    try {
      const customerData = await getCustomerMapData(mapData.id);
      const publicData = await getPublicMapData(publicUser.id, mapData.id)
      if (customerData && publicData) {
        setCustomMapData([...customerData, ...publicData]);
        setLoading(false)
      }
    } catch (e) {
      setLoading(false);
      message.error(e.message);
    }
  }


  const injectCode = (isEnd) => {

    let text = '';
    injectedcodes?.map((item) => {
      if (item.isEndOfBody === isEnd) {
        text += `<div>${item.body}</div>`
      }
    })
    return { __html: text };
  }




  return (
    <div>
      <div dangerouslySetInnerHTML={injectCode(false)}>
      </div>
      {!intiLoading &&

        <LayoutPage injectedcodes={injectedcodes} walletAddress={publicUser.publicAddress} datasets={datasets} onDataSetChange={onDataSetChange}
          mapInfo={mapData} userId={publicUser.id} publicUser={publicUser} mapData={mapData}  >
          <Spin spinning={loading}>

          </Spin>
          <MapWithNoSSR
            mapZoom={zoomLevel}
            styleId={mapData.mapstyle?.link || process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP}
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
            manualMapData={customMapData}
            datasets={datasetData}
            onCustomeDataChange={onCustomeDataChange}
            mapData={mapData}
            userId={publicUser.id}
            style={{ height: "100vh" }} />
        </LayoutPage>
      }
      <div dangerouslySetInnerHTML={injectCode(true)}>
      </div>
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
      const data = await getClientMapData(id);
      mapData = data?.maps[0];
      if (mapData) {
        datasets = await getDatasetsByMap({ maps: id }, null, false);
        datasets = datasets.map((item) => {
          let temp = mapData.mapdatasetconfs.find((obj) => obj.dataset.id === item.id);
          return { ...item, config: temp ? temp : null }
        })
      }
      injectedcodes = data?.injectedcodes;
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
        destination: '/errors/500',
        permanent: false,
      }
    }
  }

}

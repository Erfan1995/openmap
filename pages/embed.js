import dynamic from "next/dynamic";
import LayoutPage from "components/client/layout";
import { useContext, useEffect, useState } from "react";
// import UseAuth from "hooks/useAuth";
import { Spin } from 'antd';
import { getDatasetsByMap, getClientMapData } from "lib/api";
import { extractMapData, getCustomerMapData, getPublicAuthenticatedMapData, getPublicMapData } from "lib/general-functions";
import { UserContext } from "lib/UserContext";
import UseAuth from "hooks/useAuth";

const EmbedIfram = ({ manualMapData, mapData, datasets, injectedcodes }) => {

  const [datasetData, setDatasetData] = useState(datasets);
  const [zoomLevel, setZoomLevel] = useState(mapData.zoomLevel);
  const [customMapData, setCustomMapData] = useState(manualMapData);


  const MapWithNoSSR = dynamic(() => import("../components/map/publicMap"), {
    ssr: false
  });
  const EmbedIfram = dynamic(() => import("../components/map/EmbedIfram"), {
    ssr: false
  });



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
      <MapWithNoSSR
        mapZoom={zoomLevel}
        styleId={mapData.mapstyle?.link || process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP}
        edit={{
          edit: false,
          remove: false,
          create: false

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
        mapData={mapData}
        style={{ height: "100vh" }} />
      <EmbedIfram />
      <div dangerouslySetInnerHTML={injectCode(true)}>
      </div>
    </div>
  );
}
export default EmbedIfram;

export async function getServerSideProps(ctx) {
  let mapData = null;
  let injectedcodes = null;
  const { mapToken, id } = ctx.query;
  try {
    let datasets = [];
    if (id) {
      const data = await getClientMapData(id, mapToken);
      if (!(data?.maps?.length > 0)) {
        return {
          redirect: {
            destination: '/errors/404',
            permanent: false,
          }
        }
      } else {
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
    }

    return {
      props: {
        manualMapData: [...await extractMapData(mapData)]
        , mapData: mapData,
        datasets: datasets,
        injectedcodes: injectedcodes,
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

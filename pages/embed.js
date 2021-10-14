import dynamic from "next/dynamic";
import {  useState } from "react";
import { Spin } from 'antd';
import { getClientMapData, getPublicMap } from "lib/api";
import { extractMapData, extractMapDataPublicUser } from "lib/general-functions";

const Embed = ({ manualMapData, mapData, datasets, injectedcodes, publicUser }) => {

  const [customMapData, setCustomMapData] = useState(manualMapData);
  const [loading, setLoading] = useState(false);

  const MapWithNoSSR = dynamic(() => import("../components/map/publicMap"), {
    ssr: false
  });

  const onCustomeDataChange = async () => {
    setLoading(true);
    try {
      const data = await getPublicMap(mapData.id);
      const customerData = await extractMapData(data);
      const publicData = await extractMapDataPublicUser(data, publicUser.publicAddress);
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
      {/* {!intiLoading && */}

        <Spin spinning={loading}>


          <MapWithNoSSR
            mapZoom={mapData.zoomLevel}
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
            datasets={datasets}
            onCustomeDataChange={onCustomeDataChange}
            mapData={mapData}
            userId={publicUser.id}
            style={{ height: "100vh" }} />
        </Spin>
     
      {/* } */}
      <div dangerouslySetInnerHTML={injectCode(true)}>
      </div>
    </div>
  );
}
export default Embed;

export async function getServerSideProps(ctx) {
  let mapData = null;
  let injectedcodes = null;
  const { mapToken, id, publicUserId, publicUserAddress } = ctx.query;
  try {
    let datasets = [];
    if (id) {
      const data = await getClientMapData(id, mapToken);
      if (!(data?.maps.length > 0)) {
        return {
          redirect: {
            destination: '/errors/404',
            permanent: false,
          }
        }
      } else {
        mapData = data?.maps[0];
        if (mapData) {
          datasets = mapData?.datasets.map((item) => {
            let temp = mapData.mapdatasetconfs.find((obj) => obj.dataset.id === item.id);
            return { ...item, config: temp ? temp : null }
          })
        }
        injectedcodes = data?.injectedcodes;
      }
    }

    return {
      props: {
        manualMapData: [...await extractMapData(mapData), ...await extractMapDataPublicUser(mapData, publicUserAddress)]
        , mapData: mapData,
        datasets: datasets,
        injectedcodes: injectedcodes,
        publicUser: { id: publicUserId, publicAddress: publicUserAddress }
      },
    };
  } catch (e) {
    console.log(e);

    return {
      redirect: {
        destination: '/errors/500',
        permanent: false,
      }
    }
  }

}

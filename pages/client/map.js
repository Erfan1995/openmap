import dynamic from "next/dynamic";
import LayoutPage from "components/client/layout";
import { useContext, useEffect, useState } from "react";
// import UseAuth from "hooks/useAuth";
import { Spin } from 'antd';
import { getDatasetsByMap, getClientMapData, getPublicMap } from "lib/api";
import { extractMapData, extractMapDataPublicUser, getCustomerMapData, getPublicAuthenticatedMapData, getPublicMapData } from "lib/general-functions";
import { UserContext } from "lib/UserContext";
import UseAuth from "hooks/useAuth";
import styled from "styled-components";
import VideoWidget from './../../components/client/widget/VideoWidget';
import TextWidget from './../../components/client/widget/TextWidget';
import SocialWidget from './../../components/client/widget/SocialWidget';
import ListItem from "components/client/widget/ListItem";


import { Tabs, Row, Col, Card, List, Steps } from 'antd';
import { nodeName } from "jquery";
import { redirect } from "next/dist/next-server/server/api-utils";
import Content from "components/client/layout/content";
const { TabPane } = Tabs;
const { Meta } = Card;
const { Step } = Steps;

const Map = ({ manualMapData, mapData, datasets, injectedcodes, publicUser }) => {

  const [intiLoading, setInitLoading] = useState(true);
  const [publicUserObject, setPublicUserObject] = useState(publicUser);
  const [datasetData, setDatasetData] = useState(datasets);
  const [zoomLevel, setZoomLevel] = useState(mapData.zoomLevel);
  const [customMapData, setCustomMapData] = useState(manualMapData);
  const [loading, setLoading] = useState(false);

  const { login, logout } = UseAuth();

  useEffect(async () => {
    const user = JSON.parse(localStorage.getItem('magicUser'));
    if (!user?.issuer) {
      const res = await login(mapData);
      if (res) {
        setPublicUserObject(res[0]);
        // setInitLoading(false);
      }
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


  const Content = styled.div`
    height:700px;
    width:100%;
    padding:10px;
    overflow-y: scroll
  `;


  const RightSide = styled.div`
    padding:10px;
    width:100%;
    height:700px;
    overflow-y: scroll
  `;



  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];



  return (
    <div>
      <div dangerouslySetInnerHTML={injectCode(false)}>
      </div>
      {/* {!intiLoading && */}

      <LayoutPage injectedcodes={injectedcodes} walletAddress={publicUserObject.publicAddress} datasets={datasets} onDataSetChange={onDataSetChange}
        mapInfo={mapData} userId={publicUserObject.id} publicUser={publicUserObject} mapData={mapData}  >
        <Spin spinning={loading}>
          <Tabs defaultActiveKey="1" centered >
            <TabPane tab="Map" key="1">
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
            </TabPane>
            <TabPane tab="List" key="2">
              <Row>
                <Col span={16}>
                  <Content >
                    <List
                      size="small"
                      dataSource={data}
                      renderItem={item => <List.Item>
                          <ListItem item={item}></ListItem>
                      </List.Item>}
                    />
                  </Content>
                </Col>
                <Col span={8} >
                  <RightSide>
                    <VideoWidget></VideoWidget>
                    <TextWidget></TextWidget>
                    <SocialWidget data={data}></SocialWidget>
                  </RightSide>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Spin>
      </LayoutPage>

      {/* } */}
      <div dangerouslySetInnerHTML={injectCode(true)}>
      </div>
    </div>
  );
}
export default Map;

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

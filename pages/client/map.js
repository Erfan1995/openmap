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
import { ClockCircleOutlined, InfoCircleFilled } from "@ant-design/icons";

import { Tabs, Row, Col, Card, Avatar, List, Divider } from 'antd';
import { nodeName } from "jquery";
import { redirect } from "next/dist/next-server/server/api-utils";
import Content from "components/client/layout/content";
const { TabPane } = Tabs;
const { Meta } = Card;

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
    padding:10px
  `;


  const RightSide = styled.div`
    padding:10px;
    width:100%;
    height:700px;
  `;

  const ListItem = styled.div`
      height:80px;
      width:100%;
      border-radius:10px;
      background-color:white;
      padding:10px;
      box-shadow:0 16px 16px hsl(0deg 0% 0% / 0.075)
    ;
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



  const VideoWidget=()=>{
    return <Card
    bodyStyle={{ padding: "0" }}
    style={{
      width: 300,
      border: '1px solid #ddd',
      borderTopRightRadius: 5, borderTopLeftRadius: 5,
      boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)"
    }}
    cover={
      <div style={{ height: 50, width: '100%', backgroundColor: '#542344', borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
        <h2 style={{ color: "white", padding: 10 }}>
          Care Opinion in 2 Minute
        </h2>
      </div>
    }
  >
    <div class="embed-responsive embed-responsive-1by1">
      <iframe style={{width:'100%'}} class="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" ></iframe>
    </div>
  </Card>
  }


  const TextWidget=()=>{
    return <Card
    bodyStyle={{ padding: '0px 10px 10px 10px' }}
    style={{
      width: 300,
      marginTop: 10,
      border: '1px solid #ddd',
      borderTopRightRadius: 5, borderTopLeftRadius: 5,
      boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)"
    }}
    cover={
      <div style={{ width: '100%', backgroundColor: '#542344', borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
        <h2 style={{ color: "white", padding: 10 }}>
          <InfoCircleFilled style={{ fontSize: 20, color: '#00b0ff' }} /> Who's listening to your stories?
        </h2>
      </div>
    }
  >
    <Row>
      <Col span={8} style={{ color: '#8e4362', fontSize: 20,fontWeight:'bold' }}>4567</Col>
      <Col span={16} style={{ color: '#646464'}} style={{paddingTop:6}}>
          <div>
          Stories Told
          </div>
      </Col>
    </Row>
    <Row>
      <Col span={8} style={{ color: '#8e4362', fontSize: 20,fontWeight:'bold' }}>1234</Col>
      <Col span={16} style={{paddingTop:6}}>
        <a style={{color:'#653b58'}}>Staff Listening</a>
      </Col>
    </Row>
    <Row style={{color:'#4a4a4a',fontSize:20,fontWeight:'bold'}}>
      In the past month
    </Row>
    <Row>
      <Col span={8} style={{color:'#8e4362',fontSize:20,fontWeight:'bold'}}>74 %</Col>
      <Col span={16} style={{paddingTop:6}}><a style={{color:'#653b58'}}>of stories received</a></Col>
    </Row>
    <Row>
      <Col span={8} style={{color:'#5fb47b',fontSize:20,fontWeight:'bold'}}>
        91 %
      </Col>
      <Col span={16} style={{color:'#4e4e4e',paddingTop:6}}>
        of rated response
      </Col>
    </Row>
  </Card>
  }


  const SocialWidget=()=>{
    return <Card
    bodyStyle={{ padding: '0px 10px 10px 10px' }}
    style={{
      width: 300,
      marginTop: 10,
      border: '1px solid #ddd',
      borderTopRightRadius: 5, borderTopLeftRadius: 5,
      boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)",
    }}
    cover={
      <div style={{ width: '100%', backgroundColor: '#542344', borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
        <h2 style={{ color: "white", padding: 10 }}>
          Recent blog posts
        </h2>
      </div>
    }
  >


    <div style={{ height: 150, overflowY: 'scroll' }}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              description={
                <div>
                  <Row>
                    <InfoCircleFilled style={{ fontSize: 20, color: '#00b0ff' }} />
                  </Row>
                  <Row style={{ color: '#702959' }}> Focus 500</Row>
                  <Row style={{ color: 'red' }}>{item}</Row>
                  <p><ClockCircleOutlined style={{ fontSize: 12 }} /> Last Week</p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>

  </Card>
  }


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
                  <Content style={{overflowY:'scroll'}}>
                    <List
                      size="small"
                      dataSource={data}
                      renderItem={item => <List.Item>
                        <ListItem>
                          {item}
                        </ListItem>
                      </List.Item>}
                    />
                  </Content>
                </Col>
                <Col span={8} >
                  <RightSide style={{ overflowY: 'scroll' }}>
                    <VideoWidget></VideoWidget>
                    <TextWidget></TextWidget>
                    <SocialWidget></SocialWidget>

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

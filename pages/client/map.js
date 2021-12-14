import dynamic from "next/dynamic";
import LayoutPage from "components/client/layout";
import { useContext, useEffect, useState } from "react";
// import UseAuth from "hooks/useAuth";
import { getDatasetsByMap, getClientMapData, getPublicMap } from "lib/api";
import { extractMapData, extractMapDataPublicUser, getCustomerMapData, getPublicAuthenticatedMapData, getPublicMapData } from "lib/general-functions";
import { UserContext } from "lib/UserContext";
import UseAuth from "hooks/useAuth";
import styled from "styled-components";
import VideoWidget from './../../components/client/widget/VideoWidget';
import TextWidget from './../../components/client/widget/TextWidget';
import SocialWidget from './../../components/client/widget/SocialWidget';
import ListItem from "components/client/widget/ListItem";
import { generateListViewData } from "../../lib/general-functions"
import { Tabs, Row, Col, Card, List, Modal, Spin, Button } from 'antd';
import { nodeName } from "jquery";
import { redirect } from "next/dist/next-server/server/api-utils";
import Content from "components/client/layout/content";
import ListItemDetails from "components/client/widget/ListeItemDetails";
const { TabPane } = Tabs;
const { Meta } = Card;

const Map = ({ serverSideManualMapData, mapData, datasets, injectedcodes, publicUser }) => {
  console.log(mapData);
  let widgets = mapData.widget;
  let manualMapData = serverSideManualMapData;
  console.log(manualMapData);
  const [intiLoading, setInitLoading] = useState(true);
  const [publicUserObject, setPublicUserObject] = useState(publicUser);
  const [datasetData, setDatasetData] = useState(datasets);
  const [zoomLevel, setZoomLevel] = useState(mapData.zoomLevel);
  const [customMapData, setCustomMapData] = useState(manualMapData);
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState(generateListViewData(manualMapData, mapData.surveys));
  const { login, logout } = UseAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [ip, setIP] = useState('');
  Request.ServerVariables
  useEffect(async () => {
    getData();
    const user = JSON.parse(localStorage.getItem('magicUser'));
    if (!user?.issuer) {
      const res = await login(mapData);
      if (res) {
        setPublicUserObject(res[0]);
        // setInitLoading(false);
      }
    }
  }, [])

  // fetches users ip address and location details
  const getData = async () => {
    const res = await fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
  }
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
  const onSurveySelectChange = (list) => {
    let arr = [];
    list.map(item => {
      manualMapData.map(obj => {
        if (obj.mapSurveyConf.survey.id === item) {
          arr.push(obj)
        }
      })
    });
    setListData(generateListViewData(arr, mapData.surveys));
    setCustomMapData(arr);
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
        manualMapData = [...customerData, ...publicData]
        setListData(generateListViewData([...customerData, ...publicData], mapData.surveys));
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

  const ListItemWrapper = styled.div`
  &hover{
    cursor:pointer;
  }
`
  const makeModalVisible = (item) => {
    setModalVisible(true);
    setSelectedItem(item);
  }

  return (
    <div>
      <div dangerouslySetInnerHTML={injectCode(false)}>
      </div>
      {/* {!intiLoading && */}

      <LayoutPage injectedcodes={injectedcodes} walletAddress={publicUserObject.publicAddress} datasets={datasets} onDataSetChange={onDataSetChange}
        mapInfo={mapData} userId={publicUserObject.id} publicUser={publicUserObject} mapData={mapData}
        surveys={mapData.surveys} onSurveySelectChange={onSurveySelectChange}
      >
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
                      dataSource={listData}
                      renderItem={item => <List.Item>
                        <ListItem item={item} makeModalVisible={makeModalVisible} />
                      </List.Item>}
                    />
                  </Content>
                </Col>
                <Col span={8} >
                  <RightSide>
                    {mapData.selected_widgets[0].checked && (
                      <VideoWidget videoWidget={widgets.video} />
                    )}
                    {mapData.selected_widgets[1].checked && (
                      <TextWidget textWidget={widgets.text} />
                    )}
                    {mapData.selected_widgets[2].checked && (
                      <SocialWidget newsFeedWidget={widgets.news_feeds} />
                    )}
                  </RightSide>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          <Modal
            centered
            bodyStyle={{ overflowX: 'scroll' }}
            width={800}
            visible={modalVisible}
            // destroyOnClose={true}
            onCancel={() => {
              setModalVisible(false)
            }}
            footer={[
              <Button key="close" onClick={() => { setModalVisible(false) }}> close</Button>
            ]}
          >
            <ListItemDetails item={selectedItem} />
          </Modal>
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
        console.log(mapData);
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
        serverSideManualMapData: [...await extractMapData(mapData), ...await extractMapDataPublicUser(mapData, publicUserAddress)]
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

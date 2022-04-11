import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useState } from 'react';
import { Row, Col, Divider, Typography,Modal,Button,List, message, Spin,Tabs } from 'antd';
import ListItemDetails from "components/client/widget/ListeItemDetails";
import styled from 'styled-components';
import nookies from 'nookies';
import dynamic from "next/dynamic";
import { useEffect } from 'react';
import {
  putMethod, getOneMap, getDatasetsByMap, getMapGeneralData
} from 'lib/api';
import {
  getMapData,extractMapData, extractMapDataPublicUser, generateListViewDataset, generateListViewSurvey
} from "lib/general-functions";
import ListItem from "components/client/widget/ListItem";
import { useRouter } from 'next/router';
import { DATASET } from '../../static/constant'
import MapConf from 'components/customer/generalComponents/MapConf';
import Publish from 'components/customer/mapComponents/Publish';
import TextWidget from 'components/client/widget/TextWidget';
import VideoWidget from 'components/client/widget/VideoWidget';
import SocialWidget from 'components/client/widget/SocialWidget';
const { TabPane } = Tabs;

const { Title } = Typography;
const MapsWrapper = styled.div`
background:#ffffff;
height:100%;
padding:10px 20px;
margin:10px;
`;


const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;

const Content = styled.div`
  height:700px;
  width:100%;
  padding:10px;
  overflow-y: scroll
`;


const RightSide = styled.div`
  padding:10px;
  width:100%;
  overflow-y: scroll
  background-color:white
  height:800px
`;


const CreateMapContainer = ({ authenticatedUser, collapsed, styledMaps, tags, serverSideMapData, injectedcodes,
  manualMapData, serverSideDatasets, token, icons, serverSideMapSurveys }) => {
    let widgets = serverSideMapData.widget;
  const [mapStyle, setMapStyle] = useState(serverSideMapData?.mapstyle?.link || process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP);
  const [datasets, setDatasets] = useState(serverSideDatasets);
  const [mapData, setMapData] = useState(serverSideMapData);
  const [center, setCenter] = useState(serverSideMapData?.center);
  const [customMapData, setCustomMapData] = useState(manualMapData);
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [layerClicked, setLayerClicked] = useState(true);

  const MapWithNoSSR = dynamic(() => import("../../components/map"), {
    ssr: false
  });


  Request.ServerVariables
  useEffect(async () => {
    let datasetData = generateListViewDataset(serverSideDatasets)
    let surveyData = generateListViewSurvey(manualMapData, serverSideMapData.surveys);
    setListData([...surveyData, ...datasetData]);
  }, [])

  const key = 'updatable';

  const router = useRouter();

  const onDatasetChange = () => {
    try {
      setLoading(true);
      setTimeout(async () => {
        const data = await getOneMap({ id: mapData.id }, token);
        if (data) {
          const res = await getDatasetsByMap({ maps: mapData.id }, token);
          if (res) {
            setLoading(false);
          }
          setDatasets(res.map((item) => {
            let temp = data.mapdatasetconfs.find((obj) => obj.dataset.id === item.id);
            return { ...item, config: temp ? temp : null }
          }));

        }
      }, 3000)
    } catch (e) {
      message.error(e.message);
      setLoading(false);
    }
  }


  const onCustomDataChange = () => {
    try {
      setLoading(true);
      setTimeout(async () => {
        const { manualArray, data } = await getMapData(mapData.id);
        if (manualArray) {
          setLoading(false);
        }
        setMapData(data);
        setCustomMapData(manualArray);
      }, 3000)
    } catch (e) {
      setLoading(false);
      message.error(e.message);
    }
  }

  const changeMapCenter = async (center) => {
    try {
      const zoom = localStorage.getItem('zoom');
      message.loading({ content: 'Loading...', key });
      const res = await putMethod(`maps/${mapData.id}`, {
        center: center,
        zoomLevel: zoom ? zoom : mapData.zoomLevel
      });

      if (res) {
        mapData.zoomLevel = zoom ? zoom : mapData.zoomLevel;
        const { manualArray } = await getMapData(mapData.id);
        setCustomMapData(manualArray);
        setCenter(center);
        message.success({ content: 'Success!', key, duration: 2 });
      }
    } catch (e) {
      message.error(e.message);
    }

  }


  const showGeneratedLink = () => {
    router.push({
      pathname: '/',
      query: { mapToken: mapData.mapId, id: mapData.id }
    });
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


  const callback = (key) => {
    if (key === '1') {
      // setSelectedDatasets(selectedDatasets);
      // setListData([...generateListViewSurvey(selectedSurveys, mapData.surveys), ...generateListViewDataset(selectedDatasets)]);
      // setZoomLevel(localStorage.getItem('zoom') || mapData.zoomLevel);
      // setDatasetData(selectedDatasets);
    }
  }



  const makeModalVisible = (item) => {
    console.log('selectedModal '+JSON.stringify(item))
    setModalVisible(true);
    setSelectedItem(item);
  }


  return (
    <div>
      <div dangerouslySetInnerHTML={injectCode(false)}>
      </div>
      <Layout collapsed={collapsed} user={authenticatedUser}>
        <MapsWrapper  >
          <CardTitle level={4}>
            {DATASET.ADD_NEW}
          </CardTitle>


          <Divider />

          <Row gutter={[24, 24]}>

            <Col xs={24} sm={24} md={24} lg={7} xl={7} >

              <MapConf

                authenticatedUser={authenticatedUser}
                styledMaps={styledMaps}
                tags={tags}
                mapData={mapData}
                serverSideDatasets={serverSideDatasets}
                token={token}
                icons={icons}
                setMapStyle={setMapStyle}
                setDataset={onDatasetChange}
                onMapDataChange={onCustomDataChange}
                injectedcodes={injectedcodes}
                onConfigTabChanged={setLayerClicked}
                serverSideMapSurveys={serverSideMapSurveys}
              />

              <Publish mapData={mapData} />
            </Col>

            <Col xs={24} sm={24} md={24} lg={17} xl={17}>
              <Spin spinning={loading}>
                <Tabs defaultActiveKey="1" centered onChange={callback}>
                  <TabPane tab="Map" key="1">
                    <MapWithNoSSR
                      manualMapData={customMapData}
                      styleId={mapStyle}
                      style={{ height: "71vh" }}
                      datasets={datasets}
                      mapData={mapData}
                      userType='customer'
                      userId={authenticatedUser.id}
                      center={center}
                      setCenter={changeMapCenter}
                      onMapDataChange={onCustomDataChange}
                      injectedcodes={injectedcodes}
                      layerClicked={layerClicked}
                      draw={{
                        rectangle: true,
                        polygon: true,
                        circle: false,
                        circlemarker: false,
                        polyline: false
                      }}
                      edit={
                        {
                          edit: false,
                          remove: false,
                        }
                      }
                    />
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
                          {serverSideMapData.selected_widgets && serverSideMapData.selected_widgets[0].checked && (
                            <VideoWidget videoWidget={widgets.video} width={220} height={150} />
                          )}
                          {serverSideMapData.selected_widgets && serverSideMapData.selected_widgets[1].checked && (
                            <TextWidget textWidget={widgets.text} width={220} height={150} />
                          )}
                          {serverSideMapData.selected_widgets && serverSideMapData.selected_widgets[2].checked && (
                            <SocialWidget newsFeedWidget={widgets.news_feeds} width={220} height={150} />
                          )}
                        </RightSide>
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
                {/* <MapWithNoSSR
                  manualMapData={customMapData}
                  styleId={mapStyle}
                  style={{ height: "71vh" }}
                  datasets={datasets}
                  mapData={mapData}
                  userType='customer'
                  userId={authenticatedUser.id}
                  center={center}
                  setCenter={changeMapCenter}
                  onMapDataChange={onCustomDataChange}
                  injectedcodes={injectedcodes}
                  layerClicked={layerClicked}
                  draw={{
                    rectangle: true,
                    polygon: true,
                    circle: false,
                    circlemarker: false,
                    polyline: false
                  }}
                  edit={
                    {
                      edit: false,
                      remove: false,
                    }
                  }
                /> */}
              </Spin>
            </Col>
          </Row>
        </MapsWrapper>


      </Layout>
      <Modal
        centered
        bodyStyle={{ overflowX: 'scroll' }}
        width={800}
        visible={modalVisible}
        destroyOnClose={true}
        onCancel={() => {
          setModalVisible(false)
        }}
        footer={[
          <Button key="close" onClick={() => { setModalVisible(false) }}> close</Button>
        ]}
      >
        <ListItemDetails item={selectedItem} />
      </Modal>

      {/* <div dangerouslySetInnerHTML={injectCode(true)}>
      </div> */}
    </div>
  )
}
export const getServerSideProps = withPrivateServerSideProps(
  async (ctx, verifyUser) => {
    try {
      const { token } = nookies.get(ctx);
      const { id, mapToken } = ctx.query;

      if (id && mapToken) {
        let mapData = null;
        mapData = await getMapGeneralData(id, mapToken, token);
        if (mapData?.maps?.length > 0) {
          let map = mapData?.maps[0];

          map.tags = map?.tags.map(item => Number(item.id));

          const manualArray = await extractMapData(map);

          let datasets = map?.datasets;
          datasets = datasets.map((item) => {
            let temp = map.mapdatasetconfs.find((obj) => obj.dataset.id === item.id);
            return { ...item, config: temp ? temp : null }
          })
          let surveys = map?.surveys;
          surveys.map((item) => {
            item.id = Number(item.id);
            item.key = item.id;
          })


          // const data = await getCreateMapData(id, token);
          const mapStyles = mapData?.mapstyles;
          const tags = mapData?.tags;
          const injectedcodes = mapData?.injectedcodes;
          const icons = mapData?.icons;
          injectedcodes?.map((item) => {
            item.id = Number(item.id);
          })
          icons?.map((icon) => {
            icon.id = Number(icon.id);
          })
          tags?.map((item) => {
            item.id = Number(item.id);
          })
          console.log(manualArray, 'arrayaaaaaa');
          return {
            props: {
              authenticatedUser: verifyUser, styledMaps: mapStyles, tags: tags, injectedcodes: injectedcodes,
              serverSideMapData: map, manualMapData: manualArray, serverSideDatasets: datasets, token: token, icons: icons,
              serverSideMapSurveys: surveys

            }
          }
        } else {
          return {
            redirect: {
              destination: '/errors/404',
              permanent: false,
            },
          }
        }
      }
      else {
        return {
          redirect: {
            destination: '/errors/404',
            permanent: false,
          },
        }
      }

    } catch (error) {

      console.log(error);
      return {
        redirect: {
          destination: '/errors/500',
          permanent: false,
        },
      }

    }
  },
);
export default CreateMapContainer;
import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useState, useRef, useEffect } from 'react';
import { Row, Col, Divider, Typography, Card, Tabs, Button, Modal, List, Spin, message } from 'antd';
import styled from 'styled-components';
import nookies from 'nookies';
import dynamic from "next/dynamic";
import CreateMap from 'components/customer/Forms/CreateMap';
import StyledMaps from 'components/customer/generalComponents/ListMapboxStyle';
import { fetchApi, putMethod, getOneMap, getDatasetsByMap, getTags, getDatasets, getIcons } from 'lib/api';
import SelectNewMapDataset from 'components/customer/mapComponents/SelectNewMapDataset';
import { formatDate, fileSizeReadable, getMapData } from "../../lib/general-functions";
import { ArrowLeftOutlined, DeleteTwoTone } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { DATASET } from '../../static/constant'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DatasetConf from 'components/customer/generalComponents/DetasetConf';
import MapMarkers from 'components/customer/mapComponents/MapMarkers';
import { Scrollbars } from 'react-custom-scrollbars';
const { Title } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;
const MapsWrapper = styled.div`
background:#ffffff;
height:100%;
padding:10px 20px;
margin:10px;
`;

const DatasetsWrapper = styled.div`
border: 1px solid #eeeeee;
 border-radius: 5px;
 padding:0 10px;
 margin-bottom:10px;
 &:hover{
  border:1px solid #5bc0de;
  cursor:pointer
 }
`;




const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;

const SaveButton = styled(Button)`
  margin-bottom: 10px;
  margin-right:10px;
  float: right !important;
`;

const CreateMapContainer = ({ authenticatedUser, collapsed, styledMaps, tags, mapData,
  manualMapData, serverSideDatasets, token, icons }) => {
  const [styleId, setStyleID] = useState(mapData.styleId || process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP);
  const childRef = useRef();
  const selectDatasetChildRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [datasets, setDatasets] = useState();
  const [selectedDataset, setSelectedDataset] = useState(serverSideDatasets);
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState(mapData.center);
  const [customMapData, setCustomMapData] = useState(manualMapData);
  const [file, setFile] = useState();
  const [layerClicked, setLayerClicked] = useState(true);

  const MapWithNoSSR = dynamic(() => import("../../components/map"), {
    ssr: false
  });
  const key = 'updatable';
  const router = useRouter();
  const changeStyle = (item) => {
    setStyleID(item.id);
  }
  const chooseDataset = async () => {
    setLoading(true);
    let res = await getDatasets({ user: authenticatedUser.id }, token);
    setLoading(false);
    if (res) {
      let finalDatasets = [];
      let i = 0;
      res.forEach(element => {
        element.size = fileSizeReadable(element.size);
        element.title = element.title.split(".")[0];
        element.updated_at = formatDate(element.updated_at);
        element.key = element.id;
        finalDatasets[i] = element;
        i++;
      });
      setDatasets(finalDatasets);
    }
    setModalVisible(true)
  }
  const addSelectedDataset = async (selectedRow) => {
    let alreadyExist = false;
    selectedDataset.map((dd) => {
      if (dd.id === selectedRow.id) {
        alreadyExist = true;
      }
    })

    if (alreadyExist === false) {
      setLoading(true);
      selectedDataset.push(selectedRow);
      try {
        const res = await putMethod(`maps/${mapData.id}`, { datasets: selectedDataset.map(item => item.id) });
        if (res) {
          setModalVisible(false);
          message.success(DATASET.SUCCESS);
        }
      } catch (e) {
        setLoading(false);
        message.error(e);
      }
      setLoading(false);
    } else {
      message.error(DATASET.DUPLICATE_DATASET);
    }
  }
  const onModalClose = (res) => {
    router.push({
      pathname: 'maps'
    })
  }
  const addImageFile = (file) => {
    setFile(file);
  }
  const deleteDataset = async (id) => {
    setLoading(true);
    const dd = selectedDataset.filter(dData => dData.id !== id)
    try {
      const res = await putMethod(`maps/${mapData.id}`, { datasets: dd.map(item => item.id) });
      if (res) {
        setSelectedDataset(dd);
        message.success(DATASET.SUCCESS);
      }
    } catch (e) {
      setLoading(false);
      message.error(e);
    }
    setLoading(false);
  }
  function showConfirm(id) {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>{DATASET.DELETE_CONFIRM}</p>,
      onOk() {
        deleteDataset(id)
      },
      onCancel() {
      },
    });
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
        setCustomMapData(await getMapData(mapData.id));
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

  return (
    <Layout collapsed={collapsed} user={authenticatedUser}>
      <MapsWrapper  >
        <CardTitle level={4}>
          {DATASET.ADD_NEW}
        </CardTitle>

        <SaveButton type='primary' onClick={() => {
          childRef.current.saveData(styleId, file);
        }}>{DATASET.SAVE}</SaveButton>
        <Divider />

        <Spin spinning={loading}>

          <Row gutter={[24, 24]}>

            <Col xs={24} sm={24} md={24} lg={7} xl={7} >
              {/* <Scrollbars style={{ height: '70vh' }}  autoHide autoHideTimeout={500} autoHideDuration={200}> */}

                <Card style={{ height: '71vh',overflowY:'scroll'}}>

                  {layerClicked ?
                    <Tabs defaultActiveKey="1">
                      <TabPane tab={DATASET.META_DATA} key="1" >
                        <CreateMap ref={childRef} mapData={mapData} serverSideTags={tags} user={authenticatedUser} onModalClose={onModalClose} addImageFile={addImageFile} />
                      </TabPane>

                      <TabPane tab={DATASET.MAP_STYLE} key="2" >
                        <StyledMaps
                          changeStyle={changeStyle}
                          mapData={styledMaps}
                        />

                      </TabPane>
                      <TabPane tab={DATASET.LAYERS} key="3" >
                        <Button type="dashed" size='large' block onClick={() => chooseDataset()}>
                          {DATASET.ADD_NEW_LAYER}
                        </Button>
                        <Modal
                          title={DATASET.CHOOSE_DATASET}
                          centered
                          width={700}
                          visible={modalVisible}
                          destroyOnClose={true}
                          footer={[
                            <Button key="close" onClick={() => { setModalVisible(false) }}> {DATASET.CLOSE}</Button>
                          ]}
                          destroyOnClose={true}
                        >
                          <SelectNewMapDataset datasets={datasets} ref={selectDatasetChildRef} addSelectedDataset={addSelectedDataset} />
                        </Modal>
                        <List
                          className='margin-top-10'
                          dataSource={selectedDataset}
                          renderItem={item => (
                            <DatasetsWrapper onClick={() => setLayerClicked(false)}>
                              <List.Item className='margin-top-10' actions={[<a onClick={() => showConfirm(item.id)} ><span><DeleteTwoTone twoToneColor="#eb2f96" /></span></a>]}>
                                {item.title.split(".")[0]}
                              </List.Item>
                            </DatasetsWrapper>

                          )}
                        />
                      </TabPane>
                    </Tabs>
                    :
                    <div>

                      <Button style={{ marginLeft: -20, marginTop: -30 }} icon={<ArrowLeftOutlined />} onClick={() => {
                        setLayerClicked(true);
                      }} type='link'>back</Button>
                      <DatasetConf icons={icons} />
                    </div>

                  }




                </Card>
              {/* </Scrollbars> */}

              <Button type={'primary'} onClick={showGeneratedLink} className='margin-top-10' size='large'>Publish</Button>

            </Col>
            <Col xs={24} sm={24} md={24} lg={17} xl={17}>
              <MapWithNoSSR
                manualMapData={customMapData}
                styleId={styleId}
                style={{ height: "71vh" }}
                datasets={selectedDataset}
                mapData={mapData}
                userType='customer'
                userId={authenticatedUser.id}
                center={center}
                setCenter={changeMapCenter}
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
            </Col>
          </Row>
        </Spin>
      </MapsWrapper>
    </Layout>
  )
}
export const getServerSideProps = withPrivateServerSideProps(
  async (ctx, verifyUser) => {
    try {
      const { token } = nookies.get(ctx);
      const { id } = ctx.query;
      let mapData = null;
      let manualArray = [];
      let datasets = [];
      if (id) {
        mapData = await getOneMap({ id: id }, token);
        if (mapData) {
          mapData.tags = mapData.tags.map(item => Number(item.id));
          [...mapData.mmdpublicusers, ...mapData.mmdcustomers].map((item) => {
            if (item.is_approved) {
              manualArray.push(
                {
                  type: "Feature",
                  geometry: item.geometry,
                  properties: {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    type: item.public_user ? 'public' : 'customer',
                  }
                })
            }
          })
          datasets = await getDatasetsByMap({ maps: id }, token);
        }
      }
      const data = await fetchApi('styles/v1/mbshaban');
      const tags = await getTags(token);
      const icons = await getIcons(token);
      icons.map((icon) => {
        icon.id = Number(icon.id);
      })

      tags.map((item) => {
        item.id = Number(item.id);
      })
      return {
        props: {
          authenticatedUser: verifyUser, styledMaps: data, tags: tags,
          mapData: mapData, manualMapData: manualArray, serverSideDatasets: datasets, token: token, icons: icons
        }
      }
    } catch (error) {
      console.log(error);
      return {
        redirect: {
          destination: '/server-error',
          permanent: false,
        },
      }

    }
  },
);
export default CreateMapContainer;
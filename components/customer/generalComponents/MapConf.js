import { useState, useRef } from 'react';
import { Divider, Typography, Card, Tabs, Button, Modal, List, Spin, message, Menu, Dropdown, Row, Col } from 'antd';
import styled from 'styled-components';
import CreateMap from 'components/customer/Forms/CreateMap';
import StyledMaps from 'components/customer/generalComponents/ListMapboxStyle';
import {
    putMethod, getDatasets,
    postMethod, deleteMethod, getMapDatasetConf, getDatasetConfContent, getMapPopupProperties, getDatasetDetails, getIcons
} from '../../../lib/api';
import SelectNewMapDataset from 'components/customer/mapComponents/SelectNewMapDataset';
import { formatDate, fileSizeReadable } from "../../../lib/general-functions";
import { ArrowLeftOutlined, DeleteTwoTone } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { DATASET } from '../../../static/constant'
import { ExclamationCircleOutlined, DownOutlined, } from '@ant-design/icons';
import DatasetConf from './DetasetConf';
import InjectCode from '../Forms/CodeInjection/index.js';

const { TabPane } = Tabs;
const { confirm } = Modal;


const DatasetsWrapper = styled.div`
border: 1px solid #eeeeee;
 border-radius: 5px;
 width:100%;
 height:70px;
`;

const SaveButton = styled(Button)`
  margin-top: 20px;
  float: right !important;
`;

const DatasetName = styled.p`
    &:hover{
        text-decoration:underline;
        cursor:pointer;
    }
    margin-top:23px;
    margin-left:10px;
`;
const DatasetDeleteButton = styled.span`
    font-size:20px;
    font-weight:bold;
    &:hover{
        font-size:22px;
    }
    padding:4px;
`;
const MapConf = ({ authenticatedUser, styledMaps, tags, mapData, serverSideDatasets, token, icons, setMapStyle,
    setDataset, onMapDataChange, injectedcodes }) => {
    const [styleId, setStyleID] = useState(mapData.styleId || process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP);
    const childRef = useRef();
    const selectDatasetChildRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [datasets, setDatasets] = useState();
    const [selectedDataset, setSelectedDataset] = useState(serverSideDatasets);
    const [layerClicked, setLayerClicked] = useState(true);
    const [mdcId, setmdcId] = useState();
    const [selectedDIcons, setSelectedDIcons] = useState();
    const [selectedDatasetProperties, setSelectedDatasetProperties] = useState();
    const [datasetProperties, setDatasetProperties] = useState();
    const [layerType, setLayerType] = useState();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState();
    const [datasetId, setDatasetId] = useState();
    const router = useRouter();

    const menu = (
        <Menu >
            <Menu.Item key="1" style={{ padding: "3px 20px" }}><a onClick={() => showConfirm()} >{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );
    const changeStyle = async (item) => {
        setLoading(true);
        const res = await putMethod(`maps/${mapData.id}`, { mapstyle: item.id });
        if (res) {
            message.success("map style updated successfully");
            setStyleID(item.id);
            setMapStyle(res.mapstyle.link);
        }
        setLoading(false)

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

            try {
                const res = await putMethod(`maps/${mapData.id}`, { datasets: [...selectedDataset.map(item => item.id), selectedRow.id] });
                if (res) {
                    const dd = await postMethod('mapdatasetconfs', { map: mapData.id, dataset: selectedRow.id });
                    if (dd) {
                        selectedDataset.push({ ...selectedRow, config: dd });
                        setDataset();

                        message.success(DATASET.SUCCESS);
                    }
                    setModalVisible(false);
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
                const mapDatasetConf = await getMapDatasetConf({ dataset: id }, token);
                if (mapDatasetConf) {
                    const deleteMDC = await deleteMethod('mapdatasetconfs/' + mapDatasetConf[0].id);
                }
                setSelectedDataset(dd);
                setDataset();
                message.success(DATASET.SUCCESS);
            }
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
        setLoading(false);
    }
    function showConfirm() {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                deleteDataset(datasetId)
            },
            onCancel() {
            },
        });
    }

    //this function gets called whenever the user click on a dataset or main map popup styles button
    const mdc = async (id, state, type) => {
        setLayerClicked(state)
        setLayerType(type);
        setSelectedDIcons([]);
        setSelectedDatasetProperties([]);
        setDatasetProperties([]);
        if (type === "dataset") {
            const datasetDetails = await getDatasetDetails({ dataset: id }, token);
            if (datasetDetails.length !== 0) {
                setDatasetProperties(datasetDetails[0]?.properties)
            }
            const mapDatasetConf = await getMapDatasetConf({ dataset: id, map: mapData.id }, token);
            if (mapDatasetConf) setmdcId(Number(mapDatasetConf[0]?.id));
            const selectedIcons = await getDatasetConfContent({ id: mapDatasetConf[0]?.id }, token);
            if (selectedIcons.length > 0) {
                if (selectedIcons[0].icon !== null) {
                    let arr = [];
                    arr[0] = selectedIcons[0].icon;
                    setSelectedDIcons(arr);
                } else {
                    setSelectedDIcons([]);
                }
                setSelectedDatasetProperties(selectedIcons[0]?.selected_dataset_properties);
            }
        } else if (type === "main") {
            const mmdProperties = await getMapPopupProperties({ id: mapData.id }, token);
            setmdcId(mapData.id);
            if (mmdProperties) {
                if (mmdProperties[0]?.icons !== null) {
                    let i = 0;
                    let arr = [];
                    mmdProperties[0]?.icons.map((data) => {
                        arr[i] = data;
                        i++;
                    })
                    setSelectedDIcons(arr);
                    setSelectedDatasetProperties(mmdProperties[0]?.mmd_properties)
                    setDatasetProperties(['title', 'description']);
                }
            }
        }
    }



    return (
        <Spin spinning={loading}>
            <Card style={{ height: '70vh', overflowY: 'scroll' }}>
                {layerClicked ?
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={DATASET.META_DATA} key="1" >
                            <CreateMap ref={childRef} mapData={mapData} serverSideTags={tags} user={authenticatedUser} onModalClose={onModalClose} addImageFile={addImageFile} />
                            <SaveButton type='primary' onClick={() => {
                                childRef.current.saveData(styleId, file);
                            }}>{DATASET.SAVE}</SaveButton>
                        </TabPane>

                        <TabPane tab={DATASET.MAP_STYLE} key="2" >
                            <StyledMaps
                                changeStyle={changeStyle}
                                mapData={styledMaps}
                            />

                        </TabPane>


                        <TabPane tab={DATASET.MAP_INJECT} key="3" >
                            <InjectCode mapData={mapData} injectedcodes={injectedcodes} />

                        </TabPane>

                        <TabPane tab={DATASET.LAYERS} key="4" >
                            <Button type="dashed" size='large' block onClick={() => mdc(mapData.id, false, "main")}>
                                {DATASET.ADD_MAIN_POPUPS_AND_MARKER}
                            </Button>
                            <Divider />
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
                                dataSource={selectedDataset}
                                renderItem={item => (
                                    <List.Item>
                                        <DatasetsWrapper >
                                            <Row>
                                                <Col span={21}>
                                                    <DatasetName onClick={() => mdc(item.id, false, "dataset")}>{item.title.split(".")[0]}</DatasetName>
                                                </Col>
                                                <Col span={3}>
                                                    <div style={{ marginTop: "13px", padding: "4px" }}>
                                                        <Dropdown size="big" overlay={menu} trigger={['click']} >
                                                            <a className="ant-dropdown-link"
                                                                onClick={(e) => {
                                                                    setDatasetId(item.id);
                                                                }} >
                                                                <DatasetDeleteButton>:</DatasetDeleteButton>
                                                            </a>
                                                        </Dropdown>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </DatasetsWrapper>
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                    </Tabs>
                    :
                    <div>

                        <Button style={{ marginLeft: -20, marginTop: -30 }} icon={<ArrowLeftOutlined />} onClick={() => {
                            setLayerClicked(true);
                        }} type='link'>back</Button>
                        <DatasetConf setDataset={setDataset} onMapDataChange={onMapDataChange} icons={icons} mdcId={mdcId} selectedDIcons={selectedDIcons}
                            datasetProperties={datasetProperties} selectedDatasetProperties={selectedDatasetProperties} layerType={layerType} />
                    </div>
                }
            </Card>
        </Spin>
    );

}

export default MapConf;
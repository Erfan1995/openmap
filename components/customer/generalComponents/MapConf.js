import { useState, useRef } from 'react';
import { Divider, Typography, Card, Tabs, Button, Modal, List, Spin, message, Menu, Dropdown, Row, Col, Image } from 'antd';
import styled from 'styled-components';
import CreateMap from 'components/customer/Forms/CreateMap';
import StyledMaps from 'components/customer/generalComponents/ListMapboxStyle';
import {
    putMethod, getDatasets, getMapSurveyConf, getSurveyForms, getSurveyConfContent,
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
import MapSurveys from './MapSurveys';
import EditSurveyMeta from '../mapComponents/EditSurveyMeta';
import SelectNewMapSurvey from '../mapComponents/SelectNewMapSurvey';

const { TabPane } = Tabs;
const { confirm } = Modal;


const DatasetsWrapper = styled.div`
border: 1px solid #eeeeee;
 border-radius: 5px;
 width:100%;
 height:70px;
`;
const SurveyWrapper = styled.div`
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
const SurveyDeleteButton = styled.span`
    font-size:20px;
    font-weight:bold;
    &:hover{
        font-size:22px;
    }
    padding:4px;
`;
const MapConf = ({ authenticatedUser, styledMaps, tags, mapData, serverSideDatasets, token, icons, setMapStyle,
    setDataset, onMapDataChange, injectedcodes, onConfigTabChanged, serverSideMapSurveys }) => {
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
    const [surveyForms, setSurveyForms] = useState(serverSideMapSurveys);
    const [editedProperties, setEditedProperties] = useState();
    const [selectedSurveys, setSelectedSurveys] = useState(surveyForms);
    const [surveyId, setSurveyId] = useState();
    const [surveys, setSurveys] = useState();
    const [editModalVisible, setEditModalVisible] = useState();
    const [editableSurvey, setEditableSurvey] = useState();
    const router = useRouter();
    const [surveyModalVisible, setSurveyModalVisible] = useState();

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

    const updateSurveyForms = (surveys) => {
        setSurveyForms(surveys);
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
                const mapDatasetConf = await getMapDatasetConf({ dataset: id, map: mapData.id }, token);
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

    const changeSelectedIcons = (newIcons) => {
        setSelectedDIcons(newIcons);
    }
    //this function gets called whenever the user click on a dataset or main map popup styles button
    const mdc = async (id, state, type) => {
        setLayerClicked(state);
        onConfigTabChanged(state);
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
                setEditedProperties(selectedIcons[0]?.edited_dataset_properties)
            }
        } else if (type === "main") {
            surveyForms.map(data => {
                if (data.id === id) {
                    setEditableSurvey(data);
                    let arr = [];
                    let surveyFormElements = data.forms;
                    surveyFormElements.pages.map((data) => {
                        data.elements.map((element) => {
                            arr.push({ 'title': element.name, 'dataIndex': element.name, 'key': element.name })
                        })
                    })
                    setDatasetProperties(arr);
                }
            });
            const mapSurveyConf = await getMapSurveyConf({ survey: id, map: mapData.id }, token);
            if (mapSurveyConf) {
                setmdcId(Number(mapSurveyConf[0]?.id));
                const selectedproperties = await getSurveyConfContent({ id: mapSurveyConf[0]?.id }, token);
                if (selectedproperties) {
                    setSelectedDatasetProperties(selectedproperties[0]?.selected_survey_properties);
                    setEditedProperties(selectedproperties[0]?.edited_survey_properties);
                }
            }
        }
    }

    //survey parts..............................................................
    const surveyMenu = (
        <Menu >
            <Menu.Item key="1" style={{ padding: "3px 20px" }}><a onClick={() => editSurvey()} >{DATASET.EDIT}</a></Menu.Item>
            <Menu.Item key="2" style={{ padding: "3px 20px" }}><a onClick={() => showSurveyConfirm()} >{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );
    const chooseSurvey = async () => {
        setLoading(true);
        const res = await getSurveyForms({ user: authenticatedUser.id }, token);
        if (res) {
            res.map((data) => {
                data.title = data.forms.title;
                data.updated_at = formatDate(data.updated_at);
                data.id = Number(data.id);
            })
            setSurveys(res);
            setLoading(false);
        }
        setSurveyModalVisible(true);

    }
    const editSurvey = () => {
        setEditModalVisible(true);
        surveyForms.map(data => {
            if (data.id === surveyId) {
                setEditableSurvey(data);
            }
        })
    }
    const addSelectedSurvey = async (selectedRow) => {
        console.log(selectedRow, 'selected row');
        let alreadyExist = false;
        selectedSurveys.map((dd) => {
            if (dd.id === selectedRow.id) {
                alreadyExist = true;
            }
        })
        if (alreadyExist === false) {
            setLoading(true);
            try {
                const res = await putMethod(`maps/${mapData.id}`, { surveys: [...selectedSurveys.map(item => item.id), selectedRow.id] });
                if (res) {
                    const dd = await postMethod('mapsurveyconfs', { map: mapData.id, survey: selectedRow.id });
                    if (dd) {
                        console.log(dd, 'res')
                        setSelectedSurveys(res.surveys);
                        message.success(DATASET.SUCCESS);
                        setSurveyModalVisible(false);
                        updateSurveyForms(res.surveys);
                    }
                }
            } catch (e) {
                setLoading(false);
                message.error(e);
            }
            setLoading(false);
        } else {
            message.error(DATASET.DUPLICATE_SURVEY);
        }
    }
    const deleteMapSurvey = async (id) => {
        setLoading(true);
        const dd = selectedSurveys.filter(dData => dData.id !== id)
        try {
            const res = await putMethod(`maps/${mapData.id}`, { surveys: dd.map(item => item.id) });
            if (res) {
                const mapSurveyConf = await getMapSurveyConf({ survey: id, map: mapData.id }, token);
                if (mapSurveyConf) {
                    const deleteMDC = await deleteMethod('mapsurveyconfs/' + mapSurveyConf[0].id);
                }
                setSelectedSurveys(dd);
                message.success(DATASET.SUCCESS);
            }
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
        setLoading(false);
    }
    function showSurveyConfirm() {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                deleteMapSurvey(surveyId)
            },
            onCancel() {
            },
        });
    }
    const onModalSurveyClose = (res) => {
        setEditModalVisible(false);
    }

    return (
        <Spin spinning={loading}>
            <Card style={{ height: '70vh', overflowY: 'scroll' }}>
                {layerClicked ?
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={DATASET.META_DATA} key="1" >
                            <CreateMap ref={childRef} mapData={mapData} serverSideTags={tags} user={authenticatedUser} onModalClose={onModalClose} addImageFile={addImageFile} />
                            <SaveButton type='primary' onClick={() => {
                                var res=childRef.current.saveData(styleId, file);
                                if(res){
                                    onMapDataChange()
                                }
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
                            {/* <Button type="dashed" size='large' block onClick={() => mdc(mapData.id, false, "main")}>
                                {DATASET.ADD_MAIN_POPUPS_AND_MARKER}
                            </Button> */}
                            <Button type="dashed" size='large' block onClick={() => chooseDataset()}>
                                {DATASET.ADD_NEW_LAYER}
                            </Button>
                            <Modal
                                title={DATASET.CHOOSE_DATASET}
                                centered
                                width={700}
                                visible={modalVisible}
                                destroyOnClose={true}
                                onCancel={() => {
                                    setModalVisible(false)
                                }}
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
                        <TabPane tab={DATASET.SURVEYS} key="5" >
                            <Button type="dashed" size='large' block onClick={() => chooseSurvey()}>
                                {DATASET.ADD_SURVEY}
                            </Button>
                            <Modal
                                title={DATASET.COOSE_SURVEY}
                                centered
                                width={700}
                                visible={surveyModalVisible}
                                destroyOnClose={true}
                                footer={[
                                    <Button key="close" onClick={() => { setSurveyModalVisible(false) }}> {DATASET.CLOSE}</Button>
                                ]}
                                destroyOnClose={true}
                            >
                                <SelectNewMapSurvey surveys={surveys} addSelectedSurvey={addSelectedSurvey} />
                            </Modal>
                            <Modal
                                title={DATASET.EDIT}
                                centered
                                width={700}
                                visible={editModalVisible}
                                onOk={() => childRef.current.saveData(file)}
                                destroyOnClose={true}
                                onCancel={() => setEditModalVisible(false)}>
                                <EditSurveyMeta editableSurvey={editableSurvey} onModalClose={onModalSurveyClose} ref={childRef} addImageFile={addImageFile} />
                            </Modal>
                            <List
                                dataSource={selectedSurveys}
                                renderItem={item => (
                                    <List.Item>
                                        <SurveyWrapper >
                                            <Row>
                                                <Col span={5}>
                                                    <div style={{ marginTop: '16px', marginLeft: '5px' }}>
                                                        <Image width={30} src={item.forms.logo} />
                                                    </div>
                                                </Col>
                                                <Col span={16}>
                                                    <DatasetName onClick={() => mdc(item.id, false, 'main')} >{item.forms.title}</DatasetName>
                                                </Col>

                                                <Col span={3}>
                                                    <div style={{ marginTop: "13px", padding: "4px" }}>
                                                        <Dropdown size="big" overlay={surveyMenu} trigger={['click']} >
                                                            <a className="ant-dropdown-link"
                                                                onClick={(e) => {
                                                                    setSurveyId(item.id);
                                                                }} >
                                                                <SurveyDeleteButton>:</SurveyDeleteButton>
                                                            </a>
                                                        </Dropdown>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </SurveyWrapper>
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                    </Tabs>
                    :
                    <div>
                        <Button style={{ marginLeft: -20, marginTop: -30 }} icon={<ArrowLeftOutlined />} onClick={() => {
                            setLayerClicked(true);
                            onConfigTabChanged(true);
                        }} type='link'>back</Button>
                        <DatasetConf setDataset={setDataset} onMapDataChange={onMapDataChange}
                            icons={icons} mdcId={mdcId} selectedDIcons={selectedDIcons} token={token}
                            datasetProperties={datasetProperties} selectedDatasetProperties={selectedDatasetProperties}
                            layerType={layerType} changeSelectedIcons={changeSelectedIcons} editedProperties={editedProperties} />
                    </div>
                }
            </Card>
        </Spin>
    );

}

export default MapConf;
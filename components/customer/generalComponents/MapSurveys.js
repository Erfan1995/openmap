import { Divider, Typography, Card, Tabs, Button, Modal, List, Spin, message, Menu, Dropdown, Row, Col, Image } from 'antd';
import { useState, useRef } from 'react';
import styled from 'styled-components';
import {
    putMethod, getSurveyForms
} from '../../../lib/api';
import { DATASET } from '../../../static/constant'
import SelectNewMapSurvey from '../mapComponents/SelectNewMapSurvey';
import { formatDate, fileSizeReadable } from "../../../lib/general-functions";
import { ExclamationCircleOutlined, DownOutlined, DeleteTwoTone } from '@ant-design/icons';
import EditSurveyMeta from '../mapComponents/EditSurveyMeta';

const { confirm } = Modal;

const SurveyWrapper = styled.div`
border: 1px solid #eeeeee;
 border-radius: 5px;
 width:100%;
 height:70px;
`;

const SurveyName = styled.p`
    margin-top:23px;
    margin-left:10px;
`;
const SurveyDeleteButton = styled.span`
    font-size:20px;
    font-weight:bold;
    &:hover{
        font-size:22px;
    }
    padding:4px;
`;
const MapSurveys = ({ mapData, token, user, surveyForms, updateSurveyForms }) => {
    console.log('sssss', surveyForms);
    const childRef = useRef();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSurveys, setSelectedSurveys] = useState(surveyForms);
    const [surveyId, setSurveyId] = useState();
    const [surveys, setSurveys] = useState();
    const [editModalVisible, setEditModalVisible] = useState();
    const [editableSurvey, setEditableSurvey] = useState();
    const [file, setFile] = useState();

    const menu = (
        <Menu >
            <Menu.Item key="1" style={{ padding: "3px 20px" }}><a onClick={() => editSurvey()} >{DATASET.EDIT}</a></Menu.Item>
            <Menu.Item key="2" style={{ padding: "3px 20px" }}><a onClick={() => showConfirm()} >{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );
    const chooseSurvey = async () => {
        setLoading(true);
        const res = await getSurveyForms({ user: user.id }, token);
        if (res) {
            res.map((data) => {
                data.title = data.forms.title;
                data.updated_at = formatDate(data.updated_at);
                data.id = Number(data.id);
            })
            setSurveys(res);
            setLoading(false);
        }
        setModalVisible(true);

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
                    res.surveys.map((item) => {
                        item.forms = item.forms;
                    })
                    setSelectedSurveys(res.surveys);
                    message.success(DATASET.SUCCESS);
                    setModalVisible(false);
                    updateSurveyForms(res.surveys);
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
                setSelectedSurveys(dd);
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
                deleteMapSurvey(surveyId)
            },
            onCancel() {
            },
        });
    }
    const onModalClose = (res) => {
        console.log(res, 'res')
        setEditModalVisible(false);
    }
    const addImageFile = (file) => {
        setFile(file);
    }
    return (
        <Spin spinning={loading}>
            <Button type="dashed" size='large' block onClick={() => chooseSurvey()}>
                {DATASET.ADD_SURVEY}
            </Button>
            <Modal
                title={DATASET.COOSE_SURVEY}
                centered
                width={700}
                visible={modalVisible}
                destroyOnClose={true}
                footer={[
                    <Button key="close" onClick={() => { setModalVisible(false) }}> {DATASET.CLOSE}</Button>
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
                <EditSurveyMeta editableSurvey={editableSurvey} onModalClose={onModalClose} ref={childRef} addImageFile={addImageFile} />
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
                                        {/* {item.name} */}
                                    </div>
                                </Col>
                                <Col span={16}>
                                    <SurveyName >{item.forms.title}</SurveyName>
                                </Col>

                                <Col span={3}>
                                    <div style={{ marginTop: "13px", padding: "4px" }}>
                                        <Dropdown size="big" overlay={menu} trigger={['click']} >
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
                    // <List.Item style={{ margin: "0px 30px" }} actions={[<a onClick={() => showConfirm(item.id)} >
                    //     <DeleteTwoTone twoToneColor="#eb2f96" /></a>]}>
                    //     <List.Item.Meta
                    //         title={item.forms.title}
                    //     // description={item.forms.title}
                    //     />
                    // </List.Item>
                )}
            />
        </Spin>
    )
}
export default MapSurveys;
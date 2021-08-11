import { Modal, Form, Button, Col, Row, Input, message, List, Card, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getSurveyForms, postMethod, putMethod } from 'lib/api';
import { API, MAP } from '../../static/constant';
import { getStrapiMedia } from 'lib/media';
import * as Survey from "survey-react"
import styled from 'styled-components';

import "survey-creator/survey-creator.css";
import "survey-react/survey.css";

const { Title } = Typography;
const Photo = styled.img`
  width:43px;
  height:43px;
  :hover{
      opacity:0.8;
  }
`

const MarkerCard = styled(Card)`
:hover{
    cursor:pointer;
}
`

const SurveyCard = styled(Card)`
 height:170px;
 :hover{
    cursor:pointer;
}
`



const AddMap = ({ onDataSaved, myVisible, geoData, mapData, modalClose, userType, userId }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [mainMapData, setMainMapData] = useState(null);
    const [mapManualData, setMapManualData] = useState(null);
    const [icons, setIcons] = useState(mapData?.icons.map(item => ({ ...item, isSelected: false })));
    const [selectedIcons, setSelectedIcons] = useState();
    const [loading, setLoading] = useState(false);
    const [surveys, setSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurveys] = useState();


    const onCompleteSurvey =async (data) => {
        setLoading(true);
        try {
            let values={};
            values.map = mainMapData.id;
            values.geometry = mapManualData;
            values.properties= data.valuesHash;
            if (geoData.type === 'Point') {
                values.icon = selectedIcons ? selectedIcons.id : null;
            }
            let res = null;
            if (userType === 'public') {
                values.is_approved = false;
                values.public_user = userId;
                res = await postMethod('mmdpublicusers', values,false);
            } else {
                values.is_approved = true;
                values.user = userId;
                res = await postMethod('mmdcustomers', values);
            }


            if (res) {
                setVisible(false);
                form.resetFields();
                onDataSaved();
                setLoading(false)
            }
        }
        catch (info) {
            setLoading(false)
            console.error(info);
        };

    }

    const closeDrawer = () => {
        setVisible(false)
        modalClose();
    }

    const selectMarker = (item) => {
        setSelectedIcons(item);
        setIcons(mapData?.icons.map((obj) => {
            if (item.id === obj.id) {
                return { ...obj, isSelected: true }
            } else {
                return { ...obj, isSelected: false }
            }
        }));
    }


    const selectSurvey = (item) => {
        setSelectedSurveys(JSON.parse(item.forms));
        setSurveys(surveys.map((obj) => {
            if (item.id === obj.id) {
                return { ...obj, isSelected: true }
            } else {
                return { ...obj, isSelected: false }
            }
        }));
    }


    const callback = async () => {
        setLoading(true);
        try {
            let res = await getSurveyForms({ maps: mapData.id },null,false);
            if (res) {
                setSurveys(res);
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
        }

    }

    useEffect(() => {
        callback();
        setVisible(myVisible);
        setMapManualData(geoData);
        setMainMapData(mapData);
    }, [])




    const saveData = () => {
        setLoading(true);
        form
            .validateFields()
            .then(async (values) => {
                values.map = mainMapData.id;
                values.geometry = mapManualData;
                if (geoData.type === 'Point') {
                    values.icon = selectedIcons ? selectedIcons.id : null;
                }
                let res = null;
                if (userType === 'public') {
                    values.is_approved = false;
                    values.public_user = userId;
                    res = await postMethod('mmdpublicusers', values, false);
                } else {
                    values.is_approved = true;
                    values.user = userId;
                    res = await postMethod('mmdcustomers', values);
                }

                if (res) {
                    setVisible(false);
                    form.resetFields();
                    onDataSaved();
                    setLoading(false)
                }
            })
            .catch((info) => {
                setLoading(false)
                message.error(info.message);
            });
    }


    return <>
        <Modal
            title={MAP.CREATE_NEW_ACCOUNT}
            width={850}
            onClose={closeDrawer}
            visible={visible}
            destroyOnClose={true}
            footer={[

                <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
                    {MAP.CANCEl}
                </Button>,
                <Button onClick={saveData} type="primary">
                    {MAP.SUBMIT}
                </Button>]
            }
        >
            <Spin spinning={loading} >



                <Row>

                    {!selectedSurvey &&
                        <Col span={24} className='padding-20 text-center'>
                            <List
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    xxl: 3,
                                }}
                                dataSource={surveys}
                                renderItem={(item, index) => (
                                    <List.Item key={'dd' + index}>
                                        <SurveyCard className={item.isSelected ? 'selectedBox' : ''} onClick={() => selectSurvey(item)} >
                                            <img src={JSON.parse(item.forms)?.logo} style={{ height: 70 }} />

                                            <Title level={5} className='margin-top-10 text-center'>
                                                {JSON.parse(item.forms)?.title}
                                            </Title>

                                        </SurveyCard>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    }
                    {
                        selectedSurvey &&
                        <Col span={24}>
                            <Form style={{ padding: 10 }} layout="vertical" preserve={false} form={form} hideRequiredMark>
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        {/* <Form.Item
                                            name="title"
                                            label={MAP.TITLE}
                                            rules={[{ required: true, message: MAP.ENTER_TITLE }]}
                                        >
                                            <Input placeholder={MAP.ENTER_TITLE} />
                                        </Form.Item>
                                        <Form.Item
                                            name="description"
                                            label={MAP.DESCRIPTION}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: MAP.ENTER_DESCRIPTION,
                                                },
                                            ]}
                                        >
                                            <Input.TextArea rows={4} placeholder={MAP.ENTER_DESCRIPTION} />
                                        </Form.Item> */}
                                        <Survey.Survey
                                            json={selectedSurvey}
                                            showCompletedPage={true}
                                            onComplete={data => onCompleteSurvey(data)}>
                                        </Survey.Survey>

                                    </Col>
                                    {
                                        geoData.type === 'Point' &&
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <Form.Item
                                                name="icon"
                                                label={MAP.SELECT_ICON}
                                            >
                                                <List
                                                    // pagination={true}
                                                    grid={{
                                                        gutter: 10,
                                                        column: 4

                                                    }}
                                                    dataSource={icons || []}
                                                    renderItem={(item) => (
                                                        <List.Item key={`listItem` + item.id} >
                                                            <MarkerCard className={item.isSelected ? 'selectedBox' : ''} onClick={() => selectMarker(item)} >
                                                                <Photo src={getStrapiMedia(item.icon[0])} />
                                                            </MarkerCard>
                                                        </List.Item>
                                                    )}
                                                />
                                            </Form.Item>

                                        </Col>
                                    }

                                </Row>
                            </Form>
                        </Col>
                    }
                </Row>

            </Spin>

        </Modal>

    </>


}

export default AddMap;
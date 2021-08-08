import { Modal, Form, Button, Col, Row, Input, message, List, Card, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getSurveyForms, postMethod, putMethod } from 'lib/api';
import { API, MAP } from '../../static/constant';
import { getStrapiMedia } from 'lib/media';

import styled from 'styled-components';
import Modal from 'antd/lib/modal/Modal';

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

import * as Survey from "survey-react"

const AddMap = ({ onDataSaved, myVisible, geoData, mapData, modalClose, userType, userId }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [mainMapData, setMainMapData] = useState(null);
    const [mapManualData, setMapManualData] = useState(null);
    const [icons, setIcons] = useState(mapData?.icons.map(item => ({ ...item, isSelected: false })));
    const [selectedIcons, setSelectedIcons] = useState();
    const [loading, setLoading] = useState(false);


    const onCompleteSurvey = (data) => {
        console.log('data1 : ', data.valuesHash)
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


    const callback = async () => {
        setLoading(true);
        try {

            const res = await getSurveyForms({ user: userId });
            if (res) {
                res.map((data) => {
                    data.id = Number(data.id);
                })
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }

    }

    useEffect(() => {
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
            width={350}
            onClose={closeDrawer}
            visible={visible}
            destroyOnClose={true}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
                        {MAP.CANCEl}
                    </Button>
                    <Button onClick={saveData} type="primary">
                        {MAP.SUBMIT}
                    </Button>
                </div>
            }
        >
            <Spin spinning={loading} >

                <Survey.Survey
                    json={Json}
                    showCompletedPage={true}
                    onComplete={data => onCompleteSurvey(data)}
                >
                </Survey.Survey>

                <Form layout="vertical" preserve={false} form={form} hideRequiredMark>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label={MAP.TITLE}
                                rules={[{ required: true, message: MAP.ENTER_TITLE }]}
                            >
                                <Input placeholder={MAP.ENTER_TITLE} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
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
                            </Form.Item>
                        </Col>

                        {
                            geoData.type === 'Point' &&
                            <Col span={24}>
                                <Form.Item
                                    name="icon"
                                    label={MAP.SELECT_ICON}
                                >
                                    <List
                                        pagination={true}
                                        grid={{
                                            gutter: 10,
                                            column: 3

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
            </Spin>

        </Modal>

    </>


}

export default AddMap;
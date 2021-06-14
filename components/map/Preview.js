import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Button, Row, Col, Form, Input, message } from "antd";
import { deleteMethod, putMethod } from "lib/api";
import { useEffect, useState } from "react";
import styled from 'styled-components';
import EditMap from "./EditMap";
import { API, MAP } from '../../static/constant';

const { confirm } = Modal;

const ContentWrapper = styled.div`
padding:10px;

`
const Content = styled.div`
padding:10px;
border-bottom:1px solid #ededed;
`

const Preview = ({ isVisible, place, closePlaceDetails, mapData, onDataSaved, dataType, userType }) => {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [initialValues, setInitialValues] = useState({});

    useEffect(() => {
        setVisible(isVisible);
        setInitialValues(place.properties);
    }, [])

    const saveData = (geometry = null) => {
        form
            .validateFields()
            .then(async (values) => {
                if (geometry) {
                    values.geometry = geometry;
                }
                let url = place.properties.type === 'public' ? 'mmdpublicusers' : 'mmdcustomers';

                const res = await putMethod(`${url}/${place.properties.id}`, values);
                if (res) {
                    setVisible(false);
                    form.resetFields();
                    onDataSaved();
                }
            })
            .catch((info) => {
                message.error(info);
            });
    }

    const onUpdate = (data) => {
        saveData(data);
    }

    const deleteFeature = async () => {
        try {
            let url = place.properties.type === 'public' ? 'mmdpublicusers' : 'mmdcustomers';

            const res = await deleteMethod(`${url}/${place.properties.id}`);
            if (res) {
                onDataSaved();
            }
        } catch (e) {
            message.error(MAP.CHECK_INTERNET_CONNECTION);
        }

    }

    const onDelete = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{MAP.CONFIRM_DELETE}</p>,
            onOk() {
                deleteFeature()
            },
            onCancel() {
            },
        });
    }

    return (
        <Modal
            title={MAP.Place_DETAILS}
            visible={visible}
            style={{ top: 20 }}
            onCancel={closePlaceDetails}
            destroyOnClose={true}
            width={900}
            footer={[
                <Button key="close" onClick={closePlaceDetails}> close</Button>,
                dataType !== 'dataset' && userType !== 'public' ? <Button key="delete" onClick={onDelete} > {MAP.DELETE}</Button> : '',
                dataType !== 'dataset' && userType !== 'public' ? <Button key="save" type='primary' color='red' onClick={() => {
                    saveData();
                }}> {MAP.SAVE}</Button> : '',
            ]}
        >

            <ContentWrapper>
                {dataType === 'dataset' || userType === 'public' ?

                    Object.keys(place.properties).map((key) => [key, place.properties[key]]).map((item, index) => {
                        return <Content key={`prop${index}`} > <strong>{item[0]}</strong>{' : ' + item[1]}  </Content>
                    })
                    :
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={24} md={24} lg={9} xl={9} >

                            <Form layout="vertical" preserve={false} form={form} initialValues={initialValues} hideRequiredMark>
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
                                </Row>
                            </Form>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={15} xl={15}>
                            <EditMap
                                manualMapData={place}
                                styleId={mapData.styleId}
                                style={{ height: "50vh" }}
                                option={{ zoom: 5 }}
                                mapData={mapData}
                                onUpdateEvent={onUpdate}
                                draw={{
                                    rectangle: false,
                                    polygon: false,
                                    circle: false,
                                    circlemarker: false,
                                    polyline: false,
                                    marker: false
                                }}
                                edit={
                                    {
                                        edit: true,
                                        remove: false,
                                    }
                                }
                            />
                        </Col>
                    </Row>
                }
            </ContentWrapper>



        </Modal>
    );
};

export default Preview;

import { Drawer, Form, Button, Col, Row, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { postMethod, putMethod } from 'lib/api';
import { API, MAP } from '../../static/constant';

const AddMap = ({ onDataSaved, myVisible, geoData, mapData, modalClose, userType, userId }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [mainMapData, setMainMapData] = useState(null);
    const [mapManualData, setMapManualData] = useState(null);


    const closeDrawer = () => {
        setVisible(false)
        modalClose();
    }

    useEffect(() => {
        setVisible(myVisible);
        setMapManualData(geoData);
        setMainMapData(mapData);

    }, [])

    const saveData = () => {
        form
            .validateFields()
            .then(async (values) => {
                values.map = mainMapData.id;
                values.geometry = mapManualData;

                let res = null;
                if (userType === 'public') {
                    values.is_approved = false;
                    values.public_user = userId;
                    res = await postMethod('mmdpublicusers', values, false);
                } else {
                    values.is_approved = true;
                    values.users = userId;
                    res = await postMethod('mmdcustomers', values);
                }

                if (res) {
                    setVisible(false);
                    form.resetFields();
                    onDataSaved();
                }
            })
            .catch((info) => {
                message.error( info.message);
            });
    }


    return <>
        <Drawer
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
                </Row>
            </Form>
        </Drawer>
    </>


}

export default AddMap;
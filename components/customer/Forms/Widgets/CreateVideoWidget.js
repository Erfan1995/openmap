
import 'rc-color-picker/assets/index.css';
import { Col, Row, Input, Button, Space, Form, Spin } from "antd";
import ColorPicker from 'rc-color-picker';
import { useEffect, useState } from 'react';
import { putMethod } from 'lib/api';
import { message } from 'antd';
import { DATASET } from 'static/constant';


const CreateVideoWidget = ({ widget }) => {

    const [form] = Form.useForm();
    const [colorCode, setColorCode] = useState(null);
    const [loading, setLoading] = useState(false);


    const onSubmit = async (e) => {
        setLoading(true);
        form
            .validateFields()
            .then(async (values) => {
                let currentVideo = { 'title': values.title, 'video_link': values.video_link, 'color': colorCode !== null ? colorCode : widget?.video?.color };
                const res = await putMethod('widgets/' + widget.id, { 'video': currentVideo });
                if (res) {
                    message.success(DATASET.SUCCESSFULY_UPDATE_MESSAGE);
                    setColorCode(res?.color);
                }
                setLoading(false);
            }).catch(e => {
                message.error(DATASET.OCCURE_ERROR_MESSAGE)
                setLoading(false);
            })
    }



    return (
        <Spin spinning={loading}>
            <Form form={form} name='videoForm' initialValues={widget.video} onFinish={onSubmit}>
                <br />
                <Row>{DATASET.TITLE}</Row>
                <Row>
                    <Form.Item style={{ width: '100%' }} name="title" rules={[{ required: true, message: DATASET.TITLE_PLACEHOLDER }]} >
                        <Input placeholder={DATASET.TITLE_PLACEHOLDER}></Input>
                    </Form.Item>
                </Row>
                <Row>
                    <Col span={20}>
                        {DATASET.HEADER_COLOR}
                    </Col>
                    <Col span={4}>
                        <ColorPicker color={colorCode !== null ? colorCode : widget?.video?.color} onChange={(color) => setColorCode(color.color)} />
                    </Col>
                </Row>
                <br />
                <Row >
                    <Form.Item style={{ width: '100%' }} name="video_link" rules={[{ required: true, message: DATASET.REQUIRED_FIELD }, { type: "url", message: DATASET.CORRECT_URL_MESSAGE }]}>
                        <Input placeholder="https://www.youtube.com/watch?v=7O9ZDygWZ58"></Input>
                    </Form.Item>
                </Row>
                <Row>
                    <Button type='primary' htmlType="submit">
                        {DATASET.SAVE}
                    </Button>
                </Row>
            </Form>
        </Spin>
    )
}

export default CreateVideoWidget
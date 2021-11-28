
import 'rc-color-picker/assets/index.css';
import { Col, Row, Input, Button, Space, Form, Spin } from "antd";
import ColorPicker from 'rc-color-picker';
import { useEffect, useState } from 'react';
import { putMethod } from 'lib/api';
import { message } from 'antd';
import { DATASET } from 'static/constant';


const CreateVideoWidget = ({ widget }) => {

    const [form] = Form.useForm();
    const [colorCode, setColorCode] = useState(widget?.video?.color);
    const [loading, setLoading] = useState(false);


    const onSubmit = async (e) => {
        setLoading(true);
            form
            .validateFields()
            .then(async (values) => {
                let currentVideo = { 'title': values.title, 'video_link': values.video_link, 'color': colorCode };
                const res = await putMethod('widgets/' + widget.id, { 'video': currentVideo });
                if (res) {
                    message.success(DATASET.SUCCESSFULY_UPDATE_MESSAGE);
                }
                setLoading(false);
            }).catch(e => {
                message.error(DATASET.OCCURE_ERROR_MESSAGE)
                setLoading(false);
            })
    }



    return (typeof widget.video !== 'undefined' && widget.video.length !== 0) ?  <div>
        <Spin spinning={loading}>
            <Form form={form} name='videoForm' initialValues={widget.video} onFinish={onSubmit}>
                <Space direction='vertical'>
                    <Row>{DATASET.TITLE}</Row>
                    <Row>
                        <Form.Item name="title" rules={[{ required: true, message: DATASET.TITLE_PLACEHOLDER }]} >
                            <Input placeholder={DATASET.TITLE_PLACEHOLDER}></Input>
                        </Form.Item>
                    </Row>
                    <br />
                    <Row>
                        <Col span={20}>
                            {DATASET.HEADER_COLOR}
                        </Col>
                        <Col span={4}>
                            <ColorPicker color={widget?.video?.color} onChange={(color) => setColorCode(color.color)} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                    </Row>
                    <Row>
                        <Form.Item name="video_link" rules={[{ required: true, message: DATASET.REQUIRED_FIELD }, { type: "url", message: DATASET.CORRECT_URL_MESSAGE }]}>
                            <Input placeholder="https://www.youtube.com/watch?v=7O9ZDygWZ58"></Input>
                        </Form.Item>
                    </Row>
                    <br />
                    <br />
                    <br />
                    <Row>
                        <Button type='primary' htmlType="submit">
                            {DATASET.SAVE}
                        </Button>
                    </Row>
                </Space>
            </Form>

        </Spin>
    </div> :<div></div>
}

export default CreateVideoWidget
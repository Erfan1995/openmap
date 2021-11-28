
import 'rc-color-picker/assets/index.css';
import { Col, Row, Input, Button, Space, Form, Spin } from "antd";
import ColorPicker from 'rc-color-picker';
import { useEffect, useState } from 'react';
import { putMethod } from 'lib/api';
import { message } from 'antd';
import { DATASET } from 'static/constant';


const CreateVideoWidget = ({ widget }) => {

    const [form] = Form.useForm();
    const [colorCode, setColorCode] = useState("#f80e38");
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState(null);


    useEffect(()=>{
        setVideo(widget?.video);
        setColorCode(widget?.video?.color);
    });


    const onSubmit = async () => {
        setLoading(true);
            form
            .validateFields()
            .then(async (values) => {
                let currentVideo = { 'title': values.title, 'video_link': values.video_link, 'color': colorCode };
                const res = await putMethod('widgets/' + widget.id, { 'video': currentVideo });
                if (res) {
                    setVideo(res?.video);
                    message.success(DATASET.SUCCESSFULY_UPDATE_MESSAGE);
                }
                setLoading(false);
            }).catch(e => {
                message.error(DATASET.OCCURE_ERROR_MESSAGE)
                setLoading(false);
            })
    }



    return <div>
        <Spin spinning={loading}>
            <Form form={form} name='videoForm' initialValues={video} onFinish={onSubmit}>
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
                            <ColorPicker color={colorCode} onChange={(color) => setColorCode(color.color)} />
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
    </div>
}

export default CreateVideoWidget

import 'rc-color-picker/assets/index.css';
import { Col, Row, Form, Input, Button, Space, Spin, message } from "antd";
import ColorPicker from 'rc-color-picker';
import { putMethod } from 'lib/api';
const { TextArea } = Input;
import { DATASET } from 'static/constant';
import { useState } from 'react';

const CreateNewsFeedWidget = ({ widget }) => {

    const [form] = Form.useForm();
    const [colorCode, setColorCode] = useState("ff0000");
    const [loading, setLoading] = useState(false);


    const onSubmit = async () => {
        setLoading(true);
        form
            .validateFields()
            .then(async (values) => {
                let newsFeed = { 'title': values.title, 'rss_feed': values.rss_feed, 'color': colorCode };
                const res = await putMethod('widgets/' + widget?.id, { 'news_feeds': newsFeed });
                if (res) {
                    message.success(DATASET.SUCCESSFULY_UPDATE_MESSAGE)
                }
                setLoading(false);
            }).catch(e => {
                message.error(DATASET.OCCURE_ERROR_MESSAGE);
                setLoading(false);
            })
    }

    return (typeof widget?.news_feeds  !== 'undefined' && widget?.news_feeds?.length !== 0) ? <div>
        <Spin spinning={loading}>
            <Form form={form} onFinish={onSubmit} initialValues={widget?.news_feeds}>
                <Space direction='vertical'>
                    <Row>{DATASET.TITLE}</Row>
                    <Row>
                        <Form.Item name="title">
                            <Input placeholder={DATASET.TITLE_PLACEHOLDER} rules={[{ required: true, message: DATASET.TITLE_PLACEHOLDER }]}></Input>
                        </Form.Item>
                    </Row>
                    <br />
                    <Row>
                        <Col span={20}>
                            {DATASET.HEADER_COLOR}
                        </Col>
                        <Col span={4}>
                            <ColorPicker color={widget?.news_feeds?.color} onChange={(color) => setColorCode(color.color)} />
                        </Col>
                    </Row>
                    <br />
                    <Row>{DATASET.EMBED_RSS_FEED}</Row>
                    <Row>
                        <Form.Item name="rss_feed" rules={[{ required: true, message: DATASET.REQUIRED_FIELD }]}>
                            <TextArea rows={4}>
                            </TextArea>
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
    </div> : <div></div>

}

export default CreateNewsFeedWidget
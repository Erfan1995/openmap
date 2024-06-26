
import 'rc-color-picker/assets/index.css';
import { Col, Row, Form, Input, Button, Space, Spin, message } from "antd";
import ColorPicker from 'rc-color-picker';
import { putMethod } from 'lib/api';
const { TextArea } = Input;
import { DATASET } from 'static/constant';
import { useEffect, useState } from 'react';

const CreateNewsFeedWidget = ({ widget }) => {

    const [form] = Form.useForm();
    const [colorCode, setColorCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const onSubmit = async () => {
        setLoading(true);
        form
            .validateFields()
            .then(async (values) => {
                let newsFeed = { 'title': values.title, 'rss_feed': values.rss_feed, 'color': colorCode !== null ? colorCode : widget?.news_feeds?.color };
                const res = await putMethod('widgets/' + widget?.id, { 'news_feeds': newsFeed });
                if (res) {
                    message.success(DATASET.SUCCESSFULY_UPDATE_MESSAGE);
                    setColorCode(res?.color);
                }
                setLoading(false);
            }).catch(e => {
                message.error(DATASET.OCCURE_ERROR_MESSAGE);
                setLoading(false);
            })
    }

    return (
        // typeof widget?.news_feeds !== 'undefined' && widget?.news_feeds?.length !== 0) ? <div>
        <Spin spinning={loading}>
            <Form form={form} onFinish={onSubmit} initialValues={widget?.news_feeds} >

                <Row>{DATASET.TITLE}</Row>
                <Row>
                    <Form.Item name="title" style={{ width: '100%' }}>
                        <Input placeholder={DATASET.TITLE_PLACEHOLDER} rules={[{ required: true, message: DATASET.TITLE_PLACEHOLDER }]}></Input>
                    </Form.Item>
                </Row>
                <Row>
                    <Col span={20}>
                        {DATASET.HEADER_COLOR}
                    </Col>
                    <Col span={4}>
                        <ColorPicker color={colorCode !== null ? colorCode : widget?.news_feeds?.color} onChange={(color) => setColorCode(color.color)} />
                    </Col>
                </Row>
                <Row>{DATASET.RSS_FEED_URL}</Row>
                <Row>
                    <Form.Item style={{ width: '100%' }} name="rss_feed" rules={[{ required: true, message: DATASET.REQUIRED_FIELD }]}>
                        <Input placeholder={DATASET.RSS_FEED_URL} rules={[{ required: true, message: DATASET.TITLE_PLACEHOLDER }]}></Input>
                    </Form.Item>
                </Row>
                <Row>
                    <Button type='primary' htmlType="submit">
                        {DATASET.SAVE}
                    </Button>
                </Row>
            </Form>
        </Spin>
        // </div> : <div></div>
    )
}

export default CreateNewsFeedWidget
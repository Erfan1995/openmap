
import 'rc-color-picker/assets/index.css';
import { Col, Row, Form, Input, Button, Space, Spin, message } from "antd";
import ColorPicker from 'rc-color-picker';
import { useEffect, useState } from 'react';
import { putMethod } from 'lib/api';
const { TextArea } = Input;
import { DATASET } from 'static/constant';


const CreateNewsFeedWidget = ({ widget }) => {

    const [form] = Form.useForm();
    const [colorCode, setColorCode] = useState("ff0000");
    const [loading, setLoading] = useState(false);
    const [newsFeed,setNewsFeed]=useState(null);


    useEffect(()=>{
        if (widget?.news_feeds!=null) {
            setColorCode(widget?.news_feeds?.color);
            setNewsFeed(widget?.news_feeds);
        }
    },[])

    const onSubmit = async () => {
        setLoading(true);
        form
            .validateFields()
            .then(async (values) => {
                let newsFeed = { 'title': values.title, 'rss_feed': values.rss_feed, 'color': colorCode };
                const res = await putMethod('widgets/' + widget?.id, { 'news_feeds': newsFeed });
                if (res) {
                    message.success(DATASET.SUCCESSFULY_UPDATE_MESSAGE)
                    setNewsFeed(res?.news_feeds);
                }
                setLoading(false);
            }).catch(e => {
                message.error(DATASET.OCCURE_ERROR_MESSAGE);
                setLoading(false);
            })
    }

    return <div>
        <Spin spinning={loading}>
            <Form form={form} onFinish={onSubmit} initialValues={newsFeed}>
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
                            <ColorPicker color={colorCode} onChange={(color) => setColorCode(color.color)} />
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
    </div>

}

export default CreateNewsFeedWidget
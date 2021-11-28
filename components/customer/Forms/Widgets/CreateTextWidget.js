
import 'rc-color-picker/assets/index.css';
import { Col, Row, Input, Button, Space, Form, Spin, message } from "antd";
import ColorPicker from 'rc-color-picker';
import { useState } from 'react';
import { postMethod, putMethod } from 'lib/api';
const { TextArea } = Input;
import { DATASET } from 'static/constant';


const CreateTextWidget = ({ widget }) => {
    const [form] = Form.useForm();
    const [value, setValue] = useState('');
    const [colorCode, setColorCode] = useState('#ff0000');
    const [loading, setLoading] = useState(false);


    const onSubmit = async () => {
        setLoading(true);
        form
            .validateFields()
            .then(async (values) => {
                let textItem = { 'title': values.title, 'description': values.description, 'color': colorCode };
                const res = await putMethod('widgets/' + widget.id, { 'text': textItem });
                if (res) {
                    message.success(DATASET.SUCCESSFULY_UPDATE_MESSAGE)
                }
                setLoading(false);
            }).catch(e => {
                setLoading(false);
                message.error(DATASET.OCCURE_ERROR_MESSAGE);
            })
    }


    return (typeof widget?.text !== 'undefined' && widget?.text?.length !== 0) ? <div>
        <Spin spinning={loading}>
            <Form form={form} name="text" onFinish={onSubmit} initialValues={widget?.text}>
                <Space direction='vertical'>
                    <Row>{DATASET.TITLE}</Row>
                    <Row>
                        <Form.Item name="title" rules={[{ required: true, message: DATASET.TITLE_PLACEHOLDER }]}>
                            <Input placeholder={DATASET.TITLE_PLACEHOLDER}></Input>
                        </Form.Item>
                    </Row>
                    <br />
                    <Row>
                        <Col span={20}>
                            {DATASET.HEADER_COLOR}
                        </Col>
                        <Col span={4}>
                            <ColorPicker color={widget?.text?.color} onChange={(color) => setColorCode(color.color)} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        {DATASET.EDITOR}
                    </Row>
                    <Row>
                        <Form.Item name="description" rules={[{ required: true, message: DATASET.PLACE_HOLDER_DESCRIPTION }]}>
                            <TextArea placeholder={DATASET.PLACE_HOLDER_DESCRIPTION} rows={4}></TextArea>
                        </Form.Item>
                    </Row>
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

export default CreateTextWidget
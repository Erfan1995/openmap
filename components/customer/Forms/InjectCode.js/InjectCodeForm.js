import { List, Row, Card, Button, Form, Input, Col, message, Spin, Typography } from 'antd';
import { useImperativeHandle, useState, forwardRef } from "react";
import styled from 'styled-components';
import { postMethod, putMethod } from 'lib/api';
import { DATASET } from '../../../../static/constant';

const { Title } = Typography;
const FormWrapper = styled.div`
    margin:50px;
`;

const InjectCodeForm = ({ onModalClose, id, editableCode, displayCode }, ref) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        injectCode() {
            form
                .validateFields()
                .then(async (values) => {
                    values.map = id;
                    setLoading(true);
                    let res;
                    let actionType;
                    if (editableCode) {
                        res = await putMethod(`injectedcodes/${editableCode.id}`, values);
                        actionType = "edit";
                    } else {
                        res = await postMethod('injectedcodes', values);
                        actionType = "store";
                    }
                    if (res) {
                        message.success("style added successfully");
                        form.resetFields();
                        onModalClose(res, actionType);
                    }
                    setLoading(false);
                })
        }
    }))
    return (
        <Spin spinning={loading}>
            <FormWrapper>
                {!displayCode ?
                    <Form form={form} layout="vertical" hideRequiredMark initialValues={editableCode}>
                        <Row >
                            <Col span={24}>
                                <Form.Item
                                    name="title"
                                    label={DATASET.TITLE}
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}>
                                    <Input placeholder={DATASET.TITLE_PLACEHOLDER} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="head"
                                    label={DATASET.HEAD}
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}>
                                    <Input.TextArea rows={4} placeholder={DATASET.HEAD_PLACEHOLDER} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="body"
                                    label={DATASET.BODY}
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}>
                                    <Input.TextArea rows={8} placeholder={DATASET.BODY_PLACEHOLDER} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    : <div>{editableCode.body}</div>
                }
            </FormWrapper>
        </Spin>
    )
}
export default forwardRef(InjectCodeForm);
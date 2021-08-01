import { Row, Button, Form, Input, Col, message, Spin } from 'antd';
import { useState } from "react";
import styled from 'styled-components';
import { postMethod } from 'lib/api';
import { DATASET } from 'static/constant';
const FormWrapper = styled.div`
    padding:10px;
`;


const ButtonWrapper = styled(Col)`
    margin-top:10px;
    text-align:right;

`;
const SurveyCreator = ({ surveyCreator, user, onModalClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const injectCode = () => {
        form
            .validateFields()
            .then(async (values) => {
                values.forms = JSON.stringify(surveyCreator);
                values.user = user;
                setLoading(true);
                const res = await postMethod('surveys', values);
                if (res) {
                    message.success("survey added successfully");
                    form.resetFields();
                    onModalClose(res);
                    setLoading(false);
                }
            }).catch(e => console.log(e))
    }
    return (
        <Spin spinning={loading}>
            <FormWrapper>
                <Form form={form} layout="vertical" hideRequiredMark >
                    <Row >
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label={DATASET.NAME}
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
                                name="description"
                                label={DATASET.DESCRIPTION}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <Input.TextArea rows={4} placeholder={DATASET.PLACE_HOLDER_DESCRIPTION} />
                            </Form.Item>
                        </Col>


                        <ButtonWrapper span={24} >
                            <Button className='margin-right-5' onClick={() => { setModalVisible(false) }} type='default' size='middle' >
                                close
                            </Button>

                            <Button onClick={injectCode} type='primary' size='middle' >
                                save
                            </Button>
                        </ButtonWrapper>
                    </Row>
                </Form>

            </FormWrapper>
        </Spin>
    )

}

export default SurveyCreator;
import { Row, Button, Form, Input, Col, message, Spin } from 'antd';
import {useState } from "react";
import styled from 'styled-components';
import { postMethod, putMethod } from 'lib/api';
import { DATASET } from '../../../../static/constant';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed.js';

import { Controlled as CodeMirror } from 'react-codemirror2'
const FormWrapper = styled.div`
    padding:10px;
`;


const ButtonWrapper= styled(Col)`
    margin-top:10px;
    text-align:right;

`;


const options = {
    mode: 'htmlmixed',
    lineNumbers: true
};
const InjectCodeForm = ({ onModalClose, id, editableCode, displayCode ,setModalVisible}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [codes, setCodes] = useState('');
    const injectCode = () => {
        form
            .validateFields()
            .then(async (values) => {

                values.map = id;
                values.body = codes;
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
            }).catch(e => console.log(e))
    }
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
                                <CodeMirror
                                    value={codes}
                                    options={options}
                                    onBeforeChange={(editor, data, value) => {
                                        setCodes(value)
                                    }}
                                />
                            </Col>


                            <ButtonWrapper span={24} >
                               <Button className='margin-right-5' onClick={()=>{setModalVisible(false)}} type='default' size='middle' >
                                    close
                                </Button>
                               
                                <Button onClick={injectCode} type='primary' size='middle' >
                                    save
                                </Button>
                            </ButtonWrapper>

                            {/* <Col span={24}>
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
                            </Col> */}



                            
                            {/* <Col span={24}>
                                <For m.Item
                                    name="body"
                                    label={DATASET.BODY}
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}>
                                    <Input.TextArea rows={8} placeholder={DATASET.BODY_PLACEHOLDER} />
                                </Form.Item>
                            </Col> */}
                        </Row>
                    </Form>
                    : <div>{editableCode.body}</div>
                }
            </FormWrapper>
        </Spin>
    )
}
export default InjectCodeForm;
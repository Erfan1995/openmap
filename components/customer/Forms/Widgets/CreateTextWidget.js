import 'rc-color-picker/assets/index.css';
import { Col, Row, Input, Button, Space, Form, Spin, message } from "antd";
import ColorPicker from 'rc-color-picker';
import { useEffect, useState } from 'react';
import { postMethod, putMethod } from 'lib/api';
const { TextArea } = Input;
import { DATASET } from 'static/constant';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const CreateTextWidget = ({ widget }) => {
    let description = '';
    if (widget.text && widget.text.description) {
        description = widget.text.description;
    }
    const contentBlock = htmlToDraft(description);
    let eState;
    if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        eState = EditorState.createWithContent(contentState);
    }
    const [form] = Form.useForm();
    const [value, setValue] = useState('');
    const [colorCode, setColorCode] = useState('#ff0000');
    const [loading, setLoading] = useState(false);
    const [editorState, setEditorState] = useState(eState);
    const onSubmit = async () => {
        let editorValueInHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        // TODO: should be used when reading content
        let htmlObject = document.createElement('div');
        htmlObject.innerHTML = editorValueInHtml;
        console.log(htmlObject);
        setLoading(true);
        form
            .validateFields()
            .then(async (values) => {
                let textItem = { 'title': values.title, 'description': editorValueInHtml, 'color': colorCode };
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

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    }
    return (typeof widget?.text !== 'undefined' && widget?.text?.length !== 0) ? <div>
        <Spin spinning={loading}>
            <Form form={form} name="text" onFinish={onSubmit} initialValues={widget?.text}>
                <Space direction='vertical'>
                    <Row>{DATASET.TITLE}</Row>
                    <Row>
                        <Form.Item style={{width:'100%'}} name="title" rules={[{ required: true, message: DATASET.TITLE_PLACEHOLDER }]}>
                            <Input placeholder={DATASET.TITLE_PLACEHOLDER}></Input>
                        </Form.Item>
                    </Row>
                    <Row>
                        <Col span={20}>
                            {DATASET.HEADER_COLOR}
                        </Col>
                        <Col span={4}>
                            <ColorPicker color={widget?.text?.color} onChange={(color) => setColorCode(color.color)} />
                        </Col>
                    </Row>
                    <Row>
                        {DATASET.EDITOR}
                    </Row>
                    <Row>
                        <div>
                            <Editor
                                editorState={editorState}
                                wrapperClassName="wrapper-class"
                                editorClassName="editor-class"
                                onEditorStateChange={onEditorStateChange}
                                editorStyle={{
                                    border: '1px solid', borderColor: '#F5F5F5',
                                    scrollBehavior: 'smooth', padding: '3px', height: '250px'
                                }}
                            />
                        </div>
                    </Row>
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
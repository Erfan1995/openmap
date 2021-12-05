import { Form, Input, Row, Col, message, Upload, Spin, Button, Image } from "antd";
import { useImperativeHandle, useState, forwardRef } from "react";
import styled from 'styled-components';
import { putMethod, postFileMethod } from 'lib/api';
import { DATASET } from "static/constant";
import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
const FormWrapper = styled.div`
  padding:20px;
`
const StyledButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
`;
const Photo = styled.div`
  padding-top:10px;
  width:100%;
`


const AddStep = ({ widgetId, onModalClose,addImageFile }, ref) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [imageFile, setImageFile] = useState(null);
    const [imageSelected, setImageSelected] = useState(false);
    const [uploadImageAvailable, setUploadImageAvailable] = useState(false);


    const props = {
        beforeUpload: file => {
            if ((file.type.split("/")[0]) !== "image") {
                message.error(`${file.name} is not a valid file`);
            }
            return (file.type.split("/")[0]) === "image" ? true : Upload.LIST_IGNORE;
        },
        onChange: info => {
            if (info.file.status === "done") {
                setImage(info.file);
                setImageFile(info.file);
                setImageSelected(true);
                // addImageFile(info);
            }
        },
    };


    const setImage = async (file) => {
        const src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => {
                addImageFile(file);
                resolve(reader.result);
            }

        });
        setUploadImageAvailable(true);
        setImageUrl(src);
    }


    const removeImage = () => {
        setImageUrl('')
        setUploadImageAvailable(true);
    }


    useImperativeHandle(ref, () => ({
        saveData(file) {
            form
                .validateFields()
                .then(async (values) => {
                    const fData = new FormData();
                    let res = null;
                    fData.append('data', JSON.stringify({ 'title': values.title, 'hover_text': values.hover_text, 'widget': widgetId }));
                    if (file) {
                        fData.append('files.icon', file.originFileObj, file.originFileObj.name);
                    }
                    setLoading(true);
                    res = await postFileMethod('progressbars', fData);
                    if (res) {
                        message.success(DATASET.STEP_ADDED_SUCCESSFUL);
                        onModalClose(res);
                    }
                    setLoading(false);
                })
                .catch((info) => {
                    message.error(info)
                });
        },
    }), [])


    return <div>
        <Spin spinning={loading}>
            <FormWrapper>
                <Form form={form} layout="vertical" hideRequiredMark>
                    <Row gutter={10}>
                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label={DATASET.TITLE}
                                rules={[{ required: true }]}
                            >
                                <Input placeholder={DATASET.TITLE} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="hover_text"
                                label={DATASET.HOVER_TEXT}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                <Input placeholder={DATASET.HOVER_TEXT} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Photo>
                            {!imageUrl ? <Dragger  {...props} name="file" maxCount={1}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">{DATASET.ICON_FILE}</p>
                            </Dragger> :
                                <Row style={{ textAlign: "center" }}>
                                    <Col span={24}>
                                        {!uploadImageAvailable ? <Image src={editableSurvey.forms.logo} />
                                            : <Image src={imageUrl} height={100} />}
                                        <StyledButton onClick={() => removeImage()} >
                                            {DATASET.UPLOAD_NEW_ICON}
                                        </StyledButton>
                                    </Col>
                                </Row>}
                        </Photo>
                    </Row>
                </Form>
            </FormWrapper>
        </Spin>
    </div>
}

export default forwardRef(AddStep);
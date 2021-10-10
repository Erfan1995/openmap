import { Form, Input, Row, Select, Divider, Col, message, Upload, Spin, Button, Image } from "antd";
import { useImperativeHandle, useState, forwardRef } from "react";
import styled from 'styled-components';
import { putMethod } from "lib/api";
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
  padding-top:30px;
`
const EditSurveyMeta = ({ editableSurvey, onModalClose, addImageFile }, ref) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(editableSurvey.forms?.logo);
    const [imageFile, setImageFile] = useState();
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
                console.log(reader.result, 'result')
                addImageFile(reader.result);
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
        saveData(image) {
            form
                .validateFields()
                .then(async (values) => {
                    const fData = new FormData();
                    let res = null;
                    let surveyForm = editableSurvey.forms;
                    surveyForm.title = values.title;
                    surveyForm.description = values.description;
                    if (image) {
                        surveyForm.logo = image;
                    }
                    setLoading(true);
                    res = await putMethod('surveys/' + editableSurvey.id, { forms: JSON.stringify(surveyForm) })
                    setLoading(false);
                    if (res) {
                        message.success(DATASET.CREATE_MAP_SUCCESS_MSG);
                        onModalClose(res);
                    }
                })
                .catch((info) => {
                    message.error(info)
                });
        },

    }), [])
    return (
        <Spin spinning={loading}>
            <FormWrapper>

                <Row gutter={16}>
                    <Col span={14}>
                        <Form form={form} layout="vertical" hideRequiredMark initialValues={editableSurvey.forms}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="title"
                                        label="title"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="title" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
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
                            </Row>
                        </Form>
                    </Col>
                    <Col span={10}>
                        <Photo>
                            {!imageUrl ? <Dragger  {...props} name="file" maxCount={1}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">{DATASET.LOGO_FILE}</p>
                            </Dragger> :
                                <Row style={{ textAlign: "center" }}>
                                    <Col span={24}>
                                        {!uploadImageAvailable ? <Image src={editableSurvey.forms.logo} />
                                            : <Image src={imageUrl} />}
                                        <StyledButton onClick={() => removeImage()} >
                                            Upload New Photo
                                        </StyledButton>
                                    </Col>
                                </Row>}
                        </Photo>
                    </Col>
                </Row>


            </FormWrapper>
        </Spin>
    )

}
export default forwardRef(EditSurveyMeta);
import { Typography, Form, Input, Spin, Row, Col, Upload, message, Button, Image } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { useImperativeHandle, useState, forwardRef } from "react";
import styled from 'styled-components';
import { DATASET } from '../../../static/constant';
import { putPublicUserFileMethod } from "lib/api";
import { getStrapiMedia } from "lib/media";
const { Title } = Typography;
const { Dragger } = Upload;

const FormWrapper = styled.div`
  padding:20px;
`
const Photo = styled.div`
  padding-top:30px;
`
const StyledButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
`;
const StyledImage = styled.img`
display: block;
margin-left: auto;
margin-right: auto;
width:70px;
height:70px;
    border-radius:50%;
`
const AccountName = styled.p`
display: block;
margin-left: auto;
margin-right: auto;
width:16%;
margin-top:10px;
font-size:12px;
`
const WalletAdd = styled.div`
display: block;
margin-left: auto;
margin-right: auto;
width:35%;
padding:5px 10px 5px 13px;
border-radius:15px;
    border:1px solid gray;
    font-size:14px;
`
const UpdateButton = styled(Button)`
    position:absolute;
    right:8%;
    top:45%;
`
const AccountInfo = styled.div`
    width:90%;
    border-radius:15px;
    border:1px solid gray;
    height:100px;
    margin-left:auto;
    margin-right:auto;
    margin-top:10px;
    background-image: linear-gradient(to right,  #ADD8E6 , blue);
`
const PublicUserProfile = ({ userId, onModalClose, addImageFile, serverPublicUser, customWalletAddress }, ref) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(serverPublicUser?.picture?.url);
    const [uploadImageAvailable, setUploadImageAvailable] = useState(false);
    const [updateActive, setUpdateActive] = useState(false);
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
                addImageFile(info);
            }
        },
    };
    const setImage = async (file) => {
        const src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
        });
        setUploadImageAvailable(true);
        setImageUrl(src);
    }
    const removeImage = () => {
        setImageUrl('')
        setUploadImageAvailable(true);
    }

    useImperativeHandle(ref, () => ({
        createProfile(image) {
            form
                .validateFields()
                .then(async (values) => {
                    const fData = new FormData();
                    fData.append('data', JSON.stringify(values));
                    setLoading(true);
                    if (image) {
                        fData.append('files.picture', image.file.originFileObj, image.file.originFileObj.name);
                    }
                    let res = await putPublicUserFileMethod(`public-users/${userId}`, fData)
                    setLoading(false);
                    if (res) {
                        message.success(DATASET.CREATE_MAP_SUCCESS_MSG);
                        onModalClose(res);
                    }

                })
                .catch((info) => {
                    message.error(info.message)
                })
        }

    }), [])

    return (
        <Spin spinning={loading}>
            <FormWrapper>
                {updateActive ?
                    <Row gutter={16}>
                        <Col span={14}>
                            <Form form={form} layout="vertical" hideRequiredMark initialValues={serverPublicUser}>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="name"
                                            label="name"
                                            rules={[{ required: true }]}
                                        >
                                            <Input placeholder="name" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            name="lastname"
                                            label="lastname"
                                            rules={[{ required: true }]}
                                        >
                                            <Input placeholder="lastname" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            name="email"
                                            label="email"
                                            rules={[{ required: true }]}
                                        >
                                            <Input placeholder="email" />
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
                                    <Row>
                                        {!uploadImageAvailable ? <Image src={getStrapiMedia(serverPublicUser.picture)} />
                                            : <Image src={imageUrl} />}
                                        <StyledButton onClick={() => removeImage()} >
                                            Upload New Photo
                                        </StyledButton>
                                    </Row>}
                            </Photo>
                        </Col>
                        <Button onClick={() => setUpdateActive(false)} type="primary" shape="round">save</Button>
                    </Row> :
                    <div>
                        <StyledImage src={getStrapiMedia(serverPublicUser.picture)} />
                        <AccountName>Ali rez Erfan</AccountName>
                        <WalletAdd>{customWalletAddress}</WalletAdd>
                        <UpdateButton onClick={() => setUpdateActive(true)}>update</UpdateButton>
                        <AccountInfo></AccountInfo>

                    </div>

                }

            </FormWrapper>
        </Spin>
    )
}

export default forwardRef(PublicUserProfile);
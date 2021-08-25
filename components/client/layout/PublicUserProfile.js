import { Typography, Form, Input, Spin, Row, Col, Upload, message, Button, Image } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { useImperativeHandle, useState, forwardRef } from "react";
import styled from 'styled-components';
import { DATASET } from '../../../static/constant';
import { putPublicUserFileMethod } from "lib/api";
import { getStrapiMedia } from "lib/media";
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
const ProfileImage = styled(Image)`
`;
const StyledImage = styled.img`
height:70px;
border-radius:50%;
`
const AccountName = styled.p`
text-align:center;
margin-top:10px;
font-size:12px;
`
const WalletAdd = styled.div`
display: inline;
margin:0px auto;
padding:5px 10px 5px 13px;
border-radius:15px;
    border:1px solid gray;
    font-size:14px;
`
const UpdateButton = styled.div`
    margin-top:1px;
    margin-left:350px;
    font-size:12px;
    color:DodgerBlue;
    &:hover{
        cursor:pointer;
    }
`
const AccountInfo = styled.div`
    border-radius:17px;
    margin:13px 5% 0px 5%;
    background-image: linear-gradient(to right,  DodgerBlue , blue);
`
const AccountInfoRow = styled(Row)`
    padding: 15px 0px;
`;
const Title = styled.h6`
    color:white;
    font-size:9px;
`;
const Content = styled.h6`
    color:white;
    font-size:12px;
`;
const SaveButton = styled(Button)`
    padding:2px 20px 4px 20px;
    margin-left:20px;
`;
const PublicUserProfile = ({ userId, onModalClose, serverPublicUser, customWalletAddress }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(serverPublicUser?.picture?.url);
    const [uploadImageAvailable, setUploadImageAvailable] = useState(false);
    const [updateActive, setUpdateActive] = useState(false);
    const [imageFile, setImageFile] = useState();
    const [imageSelected, setImageSelected] = useState(false);
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

    const createProfile = async () => {

        form
            .validateFields()
            .then(async (values) => {
                const fData = new FormData();
                fData.append('data', JSON.stringify(values));
                setLoading(true);
                if (imageSelected) {
                    console.log(imageFile.originFileObj)
                    fData.append('files.picture', imageFile.originFileObj, imageFile.originFileObj.name);
                }
                let res = await putPublicUserFileMethod(`public-users/${userId}`, fData)
                setLoading(false);
                if (res) {
                    message.success(DATASET.CREATE_MAP_SUCCESS_MSG);
                    onModalClose(res);
                    setLoading(false);
                }

            })
            .catch((error) => {
                setLoading(false);
                message.error(error)
            })
        setUpdateActive(false);
    }


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
                                    <Row style={{ textAlign: "center" }}>
                                        <Col span={24}>
                                            {!uploadImageAvailable ? <ProfileImage src={getStrapiMedia(serverPublicUser.picture)} />
                                                : <ProfileImage src={imageUrl} />}
                                            <StyledButton onClick={() => removeImage()} >
                                                Upload New Photo
                                            </StyledButton>
                                        </Col>
                                    </Row>}
                            </Photo>
                        </Col>
                        <SaveButton onClick={() => createProfile()} type="primary" shape="round">Save Profile</SaveButton>
                    </Row> :
                    <div style={{ textAlign: "center" }}>
                        {serverPublicUser.picture ? <StyledImage src={getStrapiMedia(serverPublicUser.picture)} />
                            : <StyledImage src={'/user.png'} />}

                        <AccountName>{serverPublicUser.name}</AccountName>
                        <WalletAdd>{customWalletAddress}</WalletAdd>
                        <UpdateButton onClick={() => setUpdateActive(true)}>Edit Profile</UpdateButton>
                        <AccountInfo>
                            <AccountInfoRow>
                                <Col span={8}>
                                    <Title>Balance</Title>
                                    <Content>24.03 ETH</Content>

                                </Col>
                                <Col span={8}>
                                    <Title >Network</Title>
                                    <Content >SafeSpace</Content>
                                </Col>
                                <Col span={8}>
                                    <Title >Trust Score</Title>
                                    <Content >50</Content>
                                </Col>

                            </AccountInfoRow>
                        </AccountInfo>
                        <p style={{ paddingTop: "10px" }}>Email: {serverPublicUser.email}</p>
                    </div>
                }

            </FormWrapper>
        </Spin>
    )
}

export default PublicUserProfile;
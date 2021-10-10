import { Form, Input, Spin, Row, Col, Upload, message, Button, Image, List } from "antd";
import { InboxOutlined, EditFilled, CheckCircleFilled } from '@ant-design/icons';
import { useState, useEffect } from "react";
import styled from 'styled-components';
import { DATASET } from '../../../static/constant';
import { putPublicUserFileMethod } from "lib/api";
import { getStrapiMedia } from "lib/media";
import { putMethod, postMethod } from "lib/api";
import { magic } from "lib/magic";
import Router from "next/router";
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

const LogoutButton = styled(Button)`
   float:left;
   margin-top:-20px;
    margin-left:15px;
    font-size:12px;

`;




const PublicUserProfile = ({ userId, onModalClose, serverPublicUser, customWalletAddress, mapData, mapAttributes }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(serverPublicUser?.picture?.url);
    const [uploadImageAvailable, setUploadImageAvailable] = useState(false);
    const [updateActive, setUpdateActive] = useState(false);
    const [imageFile, setImageFile] = useState();
    const [imageSelected, setImageSelected] = useState(false);
    const [attributeList, setAttribulteList] = useState([]);
    const [attributeId, setAttributeId] = useState(0);
    const [states, setStates] = useState([]);
    const [isMagic, setIsMagic] = useState(JSON.parse(localStorage.getItem('magicUser')) || false);
    const logout = () => {

        if (isMagic) {
            magic.user.logout().then(() => {
                localStorage.removeItem('magicUser')
                Router.push({
                    pathname: '/',
                    query: { mapToken: mapData.mapId, id: mapData.id }
                });
            });
        }
    };
    useEffect(() => {
        var tempStates = [];
        if (mapAttributes) {
            setAttribulteList(mapAttributes?.attribute);
            setAttributeId(mapAttributes?.id);
            let i = 0;
            mapAttributes?.attribute.map((att) => {
                if (att.value === null) tempStates[i] = { state: true, index: i }
                else tempStates[i] = { state: false, index: i };
                i++;
            });
        }
        else if (mapData?.auth_attributes?.length !== 0) {
            let i = 0;
            (mapData?.auth_attributes).map((auth) => {
                attributeList.push({ 'attribute': auth?.attribute, 'type': auth?.type, 'value': null, 'isVarified': false });
                tempStates[i] = { state: true, index: i };
                i++;
            });
            setAttribulteList(attributeList);
        }
        setStates(tempStates);
    }, []);


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


    // attribute form

    const OnClick = async (index) => {
        setStates(states.map((obj) => {
            if (obj.index === index) {
                return { ...obj, state: false };
            } else {
                return { ...obj, state: obj.state };
            }
        }));
        attributeList[index].value = document.getElementById(index).value;
        try {
            if (attributeId != 0) {
                const res = await putMethod('map-attributes/' + attributeId, { attribute: JSON.stringify(attributeList) });
                if (res) {
                    setAttribulteList(res.attribute);
                }
            }
            else {
                const res = await postMethod('map-attributes/', { attribute: JSON.stringify(attributeList), map: mapData.id, public_user: userId });
                if (res) {
                    setAttributeId(res.id);
                    setAttribulteList(res.attribute);
                }
            }
        } catch (e) {
            console.log('error ' + e)
        }
        setLoading(false);
    }

    const ChangeState = async (index) => {
        setStates(states?.map((obj) => {
            if (obj.index === index) {
                return { ...obj, state: true };
            } else {
                return { ...obj, state: obj.state };
            }
        }));
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
                        {serverPublicUser?.picture ? <StyledImage src={getStrapiMedia(serverPublicUser?.picture)} />
                            : <StyledImage src={'/user.png'} />}

                        <AccountName>{serverPublicUser.name}</AccountName>
                        <WalletAdd>{customWalletAddress}</WalletAdd>
                        <UpdateButton onClick={() => setUpdateActive(true)}>Edit Profile</UpdateButton>

                        {isMagic &&
                            <LogoutButton type='link' onClick={logout} > logout </LogoutButton>
                        }
                        <AccountInfo className='clear'>
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
                        <p style={{ paddingTop: "10px" }}>Email: {serverPublicUser?.email}</p>
                    </div>
                }

            </FormWrapper>

            <FormWrapper>
                <Form>
                    {attributeList?.map((value, i) => (
                        <Row key={i}>
                            <Col span={6}>
                                <div>
                                    {value.attribute} #
                                </div>
                            </Col>

                            <Col span={10}>
                                <Form.Item >
                                    {states[i].state ? <Input defaultValue={value.value} type={value.type} name={value.attribute} id={i}></Input> : <div>{value.value}</div>}
                                </Form.Item>
                            </Col>
                            <Col span={1} />

                            <Col span={4}>
                                {
                                    states[i].state ? <Button shape='round' onClick={() => OnClick(i)}>
                                        Submit
                                    </Button> : <Button icon={<EditFilled />} onClick={() => ChangeState(i)} />
                                }
                            </Col>
                            <Col span={1} />
                            <Col span={2}>
                                {<CheckCircleFilled style={{ color: value.isVarified ? '#1589FF' : '#3D3635', fontSize: '25px' }} />}
                            </Col>
                        </Row>
                    ))}
                </Form>
            </FormWrapper>
        </Spin>
    )
}

export default PublicUserProfile;
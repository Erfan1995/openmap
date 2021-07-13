import React, { useState, useRef } from "react";
import { Layout, Button, Radio, Modal } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { MAP } from 'static/constant'
import PublicUserProfile from "./PublicUserProfile";
import { getStrapiMedia } from "lib/media";
import UseAuth from "hooks/useAuth";
const WalletAddressButton = styled(Button)`
position:fexid; 
right:280px;
float:right;
top:15px;
@media (max-width: 768px) {
    right:-10px;
  }
`;
const ImageWrapper = styled.img`
  height:40px;
  position:fexid; 
  float:right;
  margin-right:265px;
  margin-top:10px;
  border-radius: 50%;
  &:hover{
      cursor:pointer;
  }
`;

const { Header } = Layout;
const NavBar = ({ isMobileSize, toggle, walletAddress, publicUser, mapData }) => {
    const router = useRouter();
    const childRef = useRef();
    const customWalletAddress = walletAddress.substring(0, 10) + '...' + walletAddress.substr(walletAddress.length - 5);
    const handleModeChange = (e) => {
        e.preventDefault();
        router.push(e.target.value);
    }
    const [modalVisible, setModalVisible] = useState(false);
    const [file, setFile] = useState();
    const [serverPublicUser, setServerPublicUser] = useState(publicUser);
    const { login, logout } = UseAuth();
    const [publicuserImage, setPublicUserImage] = useState(publicUser.picture);
    const onModalClose = (res) => {
        setServerPublicUser(res);
        setPublicUserImage(res.picture);
        setModalVisible(false);
    }
    const addImageFile = (file) => {
        setFile(file);
    }
    const openFormModal = async () => {
        setModalVisible(true);
        const res = await login(mapData);
        if (res) {
            setServerPublicUser(res[0]);
        }

    }
    return (
        <Header className=" site-layout-header" >
            {isMobileSize &&
                <Button onClick={toggle} shape='circle' className='mobile-trigger'><MenuOutlined
                /></Button>
            }
            <div className='nav-button'>
                <Radio.Group onChange={handleModeChange}>
                    <Radio.Button value="/client/map">Map</Radio.Button>
                    {/* <Radio.Button value="/client/newslist">List</Radio.Button> */}
                </Radio.Group>

                {publicUser.picture ? <ImageWrapper src={getStrapiMedia(publicuserImage)}
                    onClick={() => openFormModal()} /> :
                    <WalletAddressButton type='primary' shape='round' onClick={() => openFormModal()}>
                        {customWalletAddress}
                    </WalletAddressButton>

                }

            </div>

            <Modal
                visible={modalVisible}
                centered
                title="Add your profile"
                onOk={() => childRef.current.createProfile(file)}
                destroyOnClose={true}
                onCancel={() => setModalVisible(false)}
            >
                <PublicUserProfile userId={publicUser.id} ref={childRef} onModalClose={onModalClose} addImageFile={addImageFile} serverPublicUser={serverPublicUser} />
            </Modal>
            <Button shape='circle' type='primary' className='chatBot' size='large'>
                <img src='/chat.png' />
            </Button>


        </Header>
    );
};
export default NavBar;
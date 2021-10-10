import React, { useState } from "react";
import { Layout, Button, Modal } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import styled from 'styled-components';
import PublicUserProfile from "./PublicUserProfile";
import { getStrapiMedia } from "lib/media";

import { getMethod } from "lib/api";

const WalletAddressButton = styled(Button)`
position:fexid; 
right:260px;
float:right;
height:35px;

top:15px;
padding:0 !important;
padding-left:10px!important;
color:#888;
font-size:17px;
font-weight:500;
border:1px solid #999;
@media (max-width: 768px) {
    right:-40px;
  }
`;
const ImageWrapper = styled.img`
     height:32px;
     width:30px;
  margin-left:10px;
  border-radius: 100%;
  &:hover{
      cursor:pointer;
  }
`;

const { Header } = Layout;
const NavBar = ({ isMobileSize, toggle, walletAddress, publicUser, mapData }) => {
    const customWalletAddress = walletAddress.substring(0, 10);
    const [modalVisible, setModalVisible] = useState(false);
    const [serverPublicUser, setServerPublicUser] = useState(publicUser);
    const [publicuserImage, setPublicUserImage] = useState(publicUser?.picture);

    const onModalClose = (res) => {
        setServerPublicUser(res);
        setPublicUserImage(res?.picture);
        setModalVisible(false);
    }


    const openFormModal = async () => {
        setModalVisible(true);
        const res = await getMethod(`public-users?publicAddress=${publicUser?.publicAddress}`, null, false);
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
            <div className='profile'>
                <WalletAddressButton type='default' shape='round' size='middle' onClick={() => openFormModal()}>
                    {customWalletAddress}
                    {publicuserImage ? <ImageWrapper src={getStrapiMedia(publicuserImage)} /> : <ImageWrapper src={'/user.png'} />}
                </WalletAddressButton>
            </div>

            <Modal
                visible={modalVisible}
                centered
                title="Add your profile"
                destroyOnClose={true}
                footer={null}
                onCancel={() => setModalVisible(false)} >
                <PublicUserProfile userId={publicUser.id} onModalClose={onModalClose} serverPublicUser={serverPublicUser}
                    customWalletAddress={customWalletAddress} mapData={mapData} />
            </Modal>

        </Header>
    );
};
export default NavBar;
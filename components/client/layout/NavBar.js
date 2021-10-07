import React, { useState, useEffect } from "react";
import { Layout, Button, Radio, Modal } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';
import styled from 'styled-components';
import PublicUserProfile from "./PublicUserProfile";
import { getStrapiMedia } from "lib/media";
import UseAuth from "hooks/useAuth";
import { UserContext } from "lib/UserContext";
import { magic } from "lib/magic";

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
const NavBar = ({ isMobileSize, toggle, walletAddress, publicUser, mapData, injectedcodes }) => {
    const router = useRouter();
    const customWalletAddress = walletAddress.substring(0, 10);

    // + '...' + walletAddress.substr(walletAddress.length - 5);


    const [modalVisible, setModalVisible] = useState(false);
    const [serverPublicUser, setServerPublicUser] = useState(publicUser);
    const { login, logout } = UseAuth();
    const [publicuserImage, setPublicUserImage] = useState(publicUser.picture);

    const onModalClose = (res) => {
        setServerPublicUser(res);
        setPublicUserImage(res.picture);
        // setModalVisible(false);
    }


    const openFormModal = async () => {
        // const logout = () => {
            magic.user.logout().then(() => {
            //   setUser({ user: null });
              router.push('/');
            });
        //   };
        // setModalVisible(true);
        // if (!user?.issuer) {
            // const res = await login(mapData);
            // if (res) {
            //     setServerPublicUser(res[0]);
            // }
        // }else{
        //     setServerPublicUser(publicUser)
        // }

    }
    return (
        <Header className=" site-layout-header" >
            {isMobileSize &&
                <Button onClick={toggle} shape='circle' className='mobile-trigger'><MenuOutlined
                /></Button>
            }
            <div className='profile'>
                {/* {publicUser.picture ?  : */}
                <WalletAddressButton type='default' shape='round' size='middle' onClick={() => openFormModal()}>
                    {customWalletAddress}

                    {publicuserImage ? <ImageWrapper src={getStrapiMedia(publicuserImage)} /> : <ImageWrapper src={'/user.png'} />}
                </WalletAddressButton>
                {/* } */}
            </div>

            <Modal
                visible={modalVisible}
                centered
                title="Add your profile"
                destroyOnClose={true}
                footer={null}
                onCancel={() => setModalVisible(false)} >
                <PublicUserProfile userId={publicUser.id} onModalClose={onModalClose} serverPublicUser={serverPublicUser}
                    customWalletAddress={customWalletAddress} mapData={mapData}  />
            </Modal>

        </Header>
    );
};
export default NavBar;
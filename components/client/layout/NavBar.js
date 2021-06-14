import React from "react";
import { Layout, Button, Radio } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';
import styled from 'styled-components';


const WalletAddressButton = styled(Button)`
position:fexid; 
right:280px;
float:right;
top:15px;
@media (max-width: 768px) {
    right:-10px;
  }
`;




const { Header } = Layout;
const NavBar = ({ isMobileSize, toggle, walletAddress }) => {
    const router = useRouter();
    const customWalletAddress = walletAddress.substring(0, 10) + '...' + walletAddress.substr(walletAddress.length - 5);
    const handleModeChange = (e) => {
        e.preventDefault();
        router.push(e.target.value);
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
                    <Radio.Button value="/client/newslist">List</Radio.Button>
                </Radio.Group>
                <WalletAddressButton type='primary' shape='round'>
                    {customWalletAddress}
                </WalletAddressButton>
            </div>
            <Button shape='circle' type='primary' className='chatBot' size='large'>
                <img src='/chat.png' />
            </Button>


        </Header>
    );
};
export default NavBar;
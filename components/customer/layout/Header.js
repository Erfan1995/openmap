import { Layout, Dropdown, Menu } from 'antd';
const { Header } = Layout;
import styled from 'styled-components';
import { Logo } from './LogoTitle';
import Link from 'next/link';
import { DownOutlined, UserOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import React from 'react';
import { HEADER } from '../../../lib/constants';
import nookies from "nookies";
import { useRouter } from "next/router";
const TriggerBlock = styled.div`
  height: 100%;
  font-size: 16px;
  vertical-align: middle;
  padding: 0 20px;
`;
const StyledImageBlock = styled(TriggerBlock)`
  @media (min-width: 576px) {
    display: none !important;
  }
  ${'' /* cursor: pointer; */}
`;
const MobileLogo = styled(Logo)`
  vertical-align: -10px;
`;
const HeaderBlock = styled(TriggerBlock)`
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`;

const MyMenu = () => {
  const router = useRouter();
  const logout = () => {
    nookies.set(undefined, "token", "");
    router.push("/sign-in");
  }
  return (
    <Menu>
      <Menu.Item key="profile">
        <DownOutlined />
        {HEADER.PROFILE}
      </Menu.Item>
      <Menu.Divider ClassName="menu-divider" />
      <Menu.Item key="logout" onClick={logout}>
        <LogoutOutlined />
        {HEADER.LOGOUT}
      </Menu.Item>
    </Menu>
  );
};

const MyHeader = ({ collapsed, handleToggle ,user}) => {
  return (
    <Header className="header">
      <Link href="/">
        <a>
          <StyledImageBlock>
            {/* <MobileLogo src="logo.png" alt="logo" /> */}
          </StyledImageBlock>
        </a>
      </Link>
      <TriggerBlock>
        <MenuFoldOutlined type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={handleToggle} />
      </TriggerBlock>
      <div className="margin-left-auto">
        <Dropdown overlay={<MyMenu />} placement="bottomRight">
          <HeaderBlock>
            <UserOutlined type="user" />
            <span>{user?.username || HEADER.ADMIN}</span>
          </HeaderBlock>
        </Dropdown>
      </div>
    </Header>
  );
};
export default MyHeader;

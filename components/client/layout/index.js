import { Layout } from 'antd';
import React, { useState } from 'react';
import SideBar from './SideBar';
import NavBar from './NavBar';

const { Content } = Layout;

const AppLayout = ({children,walletAddress,datasets,onDataSetChange}) => {
  const [isMobileSize, setIsMobileSize] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [layerStyle, setLayerStyle] = useState('');

  const toggle = () => {
    setCollapsed(!collapsed);
    setIsMobileSize(!collapsed);
  };

  return (
    <Layout>
      <SideBar
        siderCollapsed={collapsed}
        toggle={toggle}
        onLayerChangeParent={setLayerStyle}
        datasets={datasets}
        onDataSetChange={onDataSetChange}
      />
      <Layout className="site-layout">
        <Content
          className="site-layout-content"
        >
          {children}
        </Content>
        <NavBar
          isMobileSize={isMobileSize}
          walletAddress={walletAddress}
          toggle={toggle}
        />
      
      </Layout>
    </Layout>
  );
}

export default AppLayout;
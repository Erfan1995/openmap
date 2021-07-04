import { Component } from 'react';
import { Layout } from 'antd';
const { Content } = Layout;
import nookies from 'nookies';
import FixedSider from './Sider';
import MainLayout from './Main';
import Header from './Header';
import LogoTitle from './LogoTitle';
import Drawer from './Drawer';
import Menu from './Menu';
import MyFooter from './Footer';
import styled from 'styled-components';


class MyLayout extends Component {
  state = {
    collapsed: this.props.collapsed,
    drawerVisible: false
  };

  toggle = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 576) {
        this.setState(
          (state) => ({
            collapsed: !state.collapsed
          }),
          () => {
            nookies.set({}, 'collapsed', JSON.stringify(this.state.collapsed), {
              path: '/'
            });
          }
        );
      } else {
        this.setState((state) => ({
          drawerVisible: !state.drawerVisible
        }));
      }
    }
  };

  render() {
    const { collapsed, drawerVisible } = this.state;
    const { children } = this.props;
    return (
      <Layout className={'layout-fixed-height'}>
        <FixedSider
          collapsed={collapsed}
          setCollapsed={(collapsed) => {
            this.setState({ collapsed });
            nookies.set({}, 'collapsed', JSON.stringify(collapsed), {
              path: '/'
            });
          }}>
          <LogoTitle />
          <Menu closeDrawer={() => this.setState({ drawerVisible: false })} user={this.props.user} />
        </FixedSider>
        <MainLayout collapsed={collapsed}>
          <Header user={this.props.user} collapsed={collapsed} handleToggle={this.toggle} />
          <Content>{children}</Content>
        </MainLayout>
        <Drawer
          drawerVisible={drawerVisible}
          closeDrawer={() => this.setState({ drawerVisible: false })}>
          <LogoTitle />

          <Menu closeDrawer={() => this.setState({ drawerVisible: false })} user={this.props.user} />
        </Drawer>
      </Layout>
    );
  }
}

export default MyLayout;

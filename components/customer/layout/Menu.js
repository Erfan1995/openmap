import { Menu } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { MENU } from '../../../lib/constants';
import Link from 'next/link';
import { Header } from 'antd/lib/layout/layout';
const { SubMenu } = Menu;

const MainMenu = styled(Menu)`
  padding: 16px 0;
  min-height: 80vh;
`;

const keys = [
  '/',
  '/dashboard',

];

const MyMenu = ({ closeDrawer, user }) => {
  const router = useRouter();
  const currentPath = router.route;
  let selectedKeys = [];
  for (let i = keys.length - 1; i >= 0; i--) {
    if (currentPath.includes(keys[i])) {
      selectedKeys = [keys[i]];
      break;
    }
  }
  return (
    <MainMenu
      theme="dark"
      mode="inline"
      selectedKeys={selectedKeys}
      onClick={({ key }) => {
        closeDrawer();
        router.push(key);
      }}>
      {MENU.map((item) =>
        <Menu.Item key={item.key} >
          {item.role === user.role.name ?
            <Link href={item.link}>
              <a>
                {item.Icons}
                <span>{item.title}</span>
              </a>
            </Link> :
            <div></div>
          }
        </Menu.Item>
      )}

    </MainMenu>
  );
};
export default MyMenu;

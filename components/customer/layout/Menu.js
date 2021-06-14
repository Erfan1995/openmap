import { Menu } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { MENU } from '../../../lib/constants';
import Link from 'next/link';
const { SubMenu } = Menu;

const MainMenu = styled(Menu)`
  padding: 16px 0;
  min-height: 90vh;
`;

const keys = [
  '/',
  '/dashboard',
 
];

const MyMenu = ({ closeDrawer }) => {
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
        item.type === 'link' ? (
          <Menu.Item key={item.key}>
            <Link href={item.link}>
              <a>
                {item.Icons}
                <span>{item.title}</span>
              </a>
            </Link>
          </Menu.Item>
        ) : (
          <SubMenu key={item.key} icon={item.Icons} title={item.title}>
            {Array.isArray(item.children) &&
              item.children.map((subMenuItem) => (
                <Menu.Item key={subMenuItem.key}>
                  <Link href={subMenuItem.link}>
                    <a>
                      {subMenuItem.Icons}
                      <span>{subMenuItem.title}</span>
                    </a>
                  </Link>
                </Menu.Item>
              ))}
          </SubMenu>
        )
      )}
    </MainMenu>
  );
};
export default MyMenu;

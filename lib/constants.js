import CheckSquareOutlined from '@ant-design/icons/lib/icons/CheckSquareOutlined';
import React from 'react';

export const MENU = [
  {
    type: 'link',
    title: 'Maps',
    key: '/customer/maps',
    link: '/customer/maps',
    Icons: <CheckSquareOutlined />,
  },
  {
    type: 'link',
    title: 'Data',
    key: '/customer/datasets',
    link: '/customer/datasets',
    Icons: <CheckSquareOutlined />,
  },
  {
    type: 'link',
    title: 'Manual Map Data',
    key: '/customer/manual-map-data',
    link: '/customer/manual-map-data',
    Icons: <CheckSquareOutlined />,
  }
];

export const HEADER = {
  ADMIN: 'admin',
  PROFILE: 'admin',
  TITLE: 'Dashboard',
  LOGOUT: 'Logout'
};

export const FOOTER = {
  COPY_RIGHT: ''
};

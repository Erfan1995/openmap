import CheckSquareOutlined from '@ant-design/icons/lib/icons/CheckSquareOutlined';
import React from 'react';

export const MENU = [
  {
    role: 'Customer',
    type: 'link',
    title: 'Maps',
    key: 'm1',
    link: '/customer/maps',
    Icons: <CheckSquareOutlined />,
  },
  {
    role: 'Customer',
    type: 'link',
    title: 'Data',
    key: 'm2',
    link: '/customer/datasets',
    Icons: <CheckSquareOutlined />,
  },
  {
    role: 'Customer',
    type: 'link',
    title: 'Manual Map Data',
    key: 'm3',
    link: '/customer/manual-map-data',
    Icons: <CheckSquareOutlined />,
  },
  {
    role: 'Admin',
    type: 'link',
    title: 'Customers',
    key: 'm4',
    link: '/admin/customers',
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


export const PopUp = [

  {
    name: 'white-mode',
    cover: '/white.png',
    isSelected: false
  }
  , {
    name: 'dark-mode',
    cover: '/dark.png',
    isSelected: false
  },
  {
    name: 'color-mode',
    cover: '/color.png',
    isSelected: false
  }

]
export const MAP_SOURCE = [
  {
    name: 'Base',
    // cover: '/white.png'
    isSelected: false
  }
  , {
    name: 'MapBox',
    isSelected: false

  }

]


export const MapIconSize = [50, 50];
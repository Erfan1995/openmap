import { BarChartOutlined, DatabaseFilled, DatabaseOutlined, FileDoneOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons';
import CheckSquareOutlined from '@ant-design/icons/lib/icons/CheckSquareOutlined';
import React from 'react';
import { DATASET } from 'static/constant';

export const MENU = [
  {
    role: 'Customer',
    type: 'link',
    title: 'Maps',
    key: '/customer/maps',
    link: '/customer/maps',
    Icons: <GlobalOutlined />,
  },
  {
    role: 'Customer',
    type: 'link',
    title: 'Data',
    key: '/customer/datasets',
    link: '/customer/datasets',
    Icons: <DatabaseOutlined />,
  },
  {
    role: 'Customer',
    type: 'link',
    title: 'Users',
    key: '/customer/users',
    link: '/customer/users',
    Icons: <UserOutlined />,
  },
  {
    role: 'Customer',
    type: 'link',
    title: 'Manual Map Data',
    key: '/customer/manual-map-data',
    link: '/customer/manual-map-data',
    Icons: <DatabaseFilled />,
  },
  {
    role: 'Customer',
    type: 'link',
    title: 'Map Analytics',
    key: '/customer/map-analytics',
    link: '/customer/map-analytics',
    Icons: <CheckSquareOutlined />,
  },
  {
    role: 'Customer',
    type: 'link',
    title: 'Survey Creator',
    key: '/customer/survey-creator',
    link: '/customer/survey-creator',
    Icons: <CheckSquareOutlined />,
  },
  {
    role: 'Customer',
    type: 'link',
    title: 'Survey Analytics',
    key: '/customer/survey-analytics',
    link: '/customer/survey-analytics',
    Icons: <BarChartOutlined />,
  },
  {
    role: 'Customer',
    type: 'link',
    title: 'Survey Reports',
    key: '/customer/survey-reports',
    link: '/customer/survey-reports',
    Icons: <FileDoneOutlined />,
  },
  {
    role: 'Admin',
    type: 'link',
    title: 'Customers',
    key: '/admin/customers',
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

export const ProgressStyle = [
  { label: 'Circle Stepper', value: 'circle-mode' },
  { label: 'Flash Stepper', value: 'flash-mode' },
];

export const WidgetsData=[
  {
      'id': '2',
      'title': 'Video Widget',
      'checked': false
  },
  {
      'id': '3',
      'title': 'Text Widget',
      'checked': false
  },
  {
      'id': '4',
      'title': 'Newsfeed Widget',
      'checked': false
  },
]


export const LoginData=[
  {
      "id": DATASET.ONE,
      "label": DATASET.EMAIL_LOGIN,
      "state": false
  },
  {
      "id": DATASET.TWO,
      "label": DATASET.SOCIAL_LOGIN,
      "state": false
  },
  {
      "id": DATASET.THREE,
      "label": DATASET.BLOCKCHAIN_LOGIN,
      "state": false
  },
  {
      "id": DATASET.FOUR,
      "label": DATASET.ANNONYMOUS_LOGIN,
      "state": false
  },
  {
      "id": DATASET.FIFE,
      "label": DATASET.UNLOCK_PROTOCOL,
      "state": false
  }
]


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
export const MapDefaultIconSize = [25, 35];
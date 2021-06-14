import { Layout } from 'antd';
import styled, { css } from 'styled-components';

// eslint-disable-next-line no-unused-vars
const MainLayout = styled(({ collapsed, ...props }) => <Layout {...props} />)`
  transition: 0.2s all;
  margin-left: 256px;
  ${({ collapsed }) =>
    collapsed &&
    css`
      margin-left: 80px;
    `};

  @media (max-width: 575.98px) {
    margin-left: 0;
  }
`;

const Main = ({ children, collapsed }) => {
  return <MainLayout collapsed={collapsed}>{children}</MainLayout>;
};

export default Main;

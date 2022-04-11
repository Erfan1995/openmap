import styled from 'styled-components';
import Link from 'next/link';
import { DATASET } from '../../../static/constant';

export const Logo = styled.img`
  display: inline-block;
  height: 32px;
  vertical-align: middle;
`;

const MainTitle = styled.div`
  display: block;
  color: #eee;
  font-weight: 600;
  font-size: 28px;
  font-family: 'Arial';
  vertical-align: middle;
`;

const SubTitle = styled.div`
  display: block;
  color: #eee;
  font-weight: 500;
  font-size: 9px;
  margin-top:-40px;
  margin-left: 12px;

`;

const TitleWrapper = styled.div`
  position: relative;
  height: 64px;
  padding-left: 24px;
  overflow: hidden;
  line-height: 64px;
  transition: all 0.3s;
  background: #001529;
`;
const HrefLink = styled.a`
  display: inline-block;
`;

const LogoTitle = () => {
  return (
    <TitleWrapper>
      <Link href="/">
        <HrefLink>
          {/* <Logo src="logo.png" alt="logo" /> */}
          <MainTitle>{DATASET.SAFE_SPACE}</MainTitle>
          <SubTitle>{DATASET.OPEN_MAP}</SubTitle>
        </HrefLink>
      </Link>
    </TitleWrapper>
  );
};

export default LogoTitle;

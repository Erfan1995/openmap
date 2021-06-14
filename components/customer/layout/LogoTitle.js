import styled from 'styled-components';
import Link from 'next/link';

export const Logo = styled.img`
  display: inline-block;
  height: 32px;
  vertical-align: middle;
`;

const Title = styled.div`
  display: inline-block;
  color: white;
  font-weight: 600;
  font-size: 20px;
  margin-left: 12px;
  font-family: 'Arial';
  vertical-align: middle;
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
          <Title>Focal Point  </Title>
        </HrefLink>
      </Link>
    </TitleWrapper>
  );
};

export default LogoTitle;

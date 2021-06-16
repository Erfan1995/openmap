import { Card, Typography } from "antd";
import UseAuth from "hooks/useAuth";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from 'styled-components';
import { MAP } from 'static/constant';

export const CardFooter = styled.div`
position: relative;
bottom:-10px;

`;

export const CardMiddle = styled.div`
padding:25px;
`;


export const StyledCard = styled(Card)`
  position: relative;
  max-width: 420px;
  min-width: 420px;
  width: 100%;
  border: none;
  margin:auto;
  background: rgb(240, 245, 255);
  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
    rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
  border-radius: 30px;
  @media (max-width: 500px) {
    min-width: 96vw;
  }
`;


const { Title } = Typography;
const Dashboard = ({ mapData,manualMapData,datasets }) => {


  const MapWithNoSSR = dynamic(() => import("../../components/map/mapImage"), {
    ssr: false
  });

  const Metamask = dynamic(() => import("../general-components/Metamask"), {
    ssr: false
  });

  return (
    <div>

      <MapWithNoSSR   mapData={mapData} manualMapData={manualMapData} datasets={datasets} />

      <div className='news-relay text-center' >
        <StyledCard>
          <Title level={1}>
            {MAP.OPENMAP_LOGO}
          </Title>
          <Title level={3}>
            {MAP.WELCOME_TO_OPENMAP}
          </Title>


          <Metamask mapDetails={mapData} />
          <CardMiddle>
            <img src='metamask-big.png' />
          </CardMiddle>
          <CardFooter>
            <span level={6}>{MAP.AS_CUSTOMER} <Link href='sign-in'>
              {MAP.SING_IN}
            </Link></span>

          </CardFooter>
        </StyledCard>


      </div>
    </div>

  );
};

export default Dashboard;

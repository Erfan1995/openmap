import { Card, message, Typography } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import styled from 'styled-components';
import { MAP } from 'static/constant';
import { ThemeProvider } from "@magiclabs/ui";
import { magic } from 'lib/magic';
import { UserContext } from "lib/UserContext";
import { useEffect, useState } from "react";
import { publicUserOperation } from "lib/general-functions";
import { getStrapiMedia } from "lib/media";
export const CardFooter = styled.div`
position: relative;
bottom:-10px;

`;

export const CardMiddle = styled.div`
padding:25px;
`;

export const Photo=styled.img`
width:150px;
height:150px;
border-radius: 50%;
border:2px solid #eee;
:hover{
    opacity:0.8;
    cursor:pointer;
}
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
const Dashboard = ({ mapData, manualMapData, datasets, mapToken }) => {

  const [user, setUser] = useState();
  console.log('map '+JSON.stringify(mapData.loginTitle)+' image '+JSON.stringify(mapData.loginLogo)+' welcome message '+JSON.stringify(mapData.welcomeMessage));

  useEffect(() => {
    setUser({ loading: true });
    localStorage.removeItem('magicUser');
    localStorage.setItem('mapData',JSON.stringify(mapData));
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => {
          setUser(userData);
           localStorage.setItem('magicUser',JSON.stringify(userData));
          publicUserOperation(userData.publicAddress,mapData)
        });
      } else {
        setUser({ user: null });
      }
    });
  }, []);


  const MapWithNoSSR = dynamic(() => import("../../components/map/mapImage"), {
    ssr: false
  });

  const Metamask = dynamic(() => import("../general-components/Metamask"), {
    ssr: false
  });

  

  return (

    <ThemeProvider root>
      <UserContext.Provider value={[user, setUser]}>
        <div>

          <MapWithNoSSR mapData={mapData} manualMapData={manualMapData} datasets={datasets} />

          <div className='news-relay text-center' >
            <StyledCard>
              <Title level={1}>
                {/* {mapData.loginTitle} */}
                <Photo src={getStrapiMedia(mapData?.loginLogo)} alt="image not found"></Photo>
              </Title>
              <Title level={3}>
                {mapData?.welcomeMessage}
              </Title>
              <Metamask mapDetails={mapData} />
              {/* <CardMiddle>
                <img src='metamask-big.png' />
              </CardMiddle> */}
              <CardFooter>
                <span level={6}>{MAP.AS_CUSTOMER} <Link href='sign-in'>
                  {MAP.SING_IN}
                </Link></span>

              </CardFooter>
            </StyledCard>


          </div>
        </div>
      </UserContext.Provider>
    </ThemeProvider>
  );
};

export default Dashboard;

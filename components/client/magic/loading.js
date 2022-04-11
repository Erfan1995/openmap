
import { Card, Typography } from "antd";
import styled from "styled-components";
export const StyledCard = styled(Card)`
position: relative;
max-width: 420px;
min-width: 420px;
width: 100%;
border: none;
margin:auto;
padding-top:40px;
margin-top:100px;
@media (max-width: 500px) {
  min-width: 96vw;
}
`;

const { Title } = Typography;


const Loading = () => (
  <StyledCard style={{ textAlign: 'center' }}>

    <Title level={3}>
      {'Redirectiong....'}
    </Title>
    <img src='/spinner.svg' height='50px' alt='Loading' />
  </StyledCard>
);

export default Loading;


import { Row, Col, Steps, Divider } from "antd";
import styled from "styled-components";

const CustomItem = styled.div`
    width:100%;
    border-radius:10px;
    background-color:white;
    padding:10px;
    box-shadow:0 16px 16px hsl(0deg 0% 0% / 0.075)
`;


const TextDev = styled.div`
    font-size: 10px; 
    padding-top: 10px;
    color:#aaa
`;

const SmallTitle = styled.div`
    color:#aaa;
    font-size:10px
`;

const { Step } = Steps

const CustomStepper = () => {
    return <div>
        <Steps current={1} size='small' responsive='true' progressDot={false}>
            <Step title="Finished" />
            <Step title="In Progress" />
            <Step title="Waiting" />
            <Step title="Finish" />
        </Steps>
    </div>
}


const ListItem = ({ item }) => {
    return <CustomItem>
        <Row>
            <Col span={12}>
                <Row>
                    <SmallTitle>
                        First Row
                    </SmallTitle>
                </Row>
                <Row style={{ fontSize: 15 }}>
                    {item}
                </Row>
            </Col>
            <Col span={12} style={{ borderLeft: '1px solid #ccc', padding: 10 }}>
                <CustomStepper></CustomStepper>
            </Col>
        </Row>
        <Row>
            <TextDev>
                Video provides a powerful way to help you prove your point. When you click Online Video, you can paste in the embed code for the video you want to add.
            </TextDev>
        </Row>
    </CustomItem>
}

export default ListItem;
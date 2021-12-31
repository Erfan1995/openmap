
import { Card, Row, Col } from "antd"
import { InfoCircleFilled } from "@ant-design/icons"
import styled from "styled-components"

const Title = styled.div`
    width: 100%;
    border-top-right-radius:5px;
    border-top-left-radius:5px;

`;

const H2 = styled.div`
    color:white;
    padding:10px;
    font-size:18px
`

const PurpleText = styled.div`
    color: #8e4362;
    font-size: 20px;
    font-weight: bold;
`;

const GreenText = styled.div`
    color: #5fb47b;
    font-size: 20px;
    font-weight: bold          
`;

const LinkText = styled.div`
    color: #653b58;
    margin-top:6px;
`;

const SampleText = styled.div`
    color: #646464; 
    padding-top: 6px
`;


const BlackTitle = styled.div`
    color: #4a4a4a; 
    font-size: 20px; 
    font-weight: bold 
`;

const ReadMore = styled.div`
    width:100%;
    text-align:right
`;


const TextWidget = ({ textWidget }) => {
    return <Card
        bodyStyle={{ padding: '0px 10px 10px 10px' }}
        style={{
            width: 300,
            marginTop: 10,
            border: '1px solid #ddd',
            borderTopRightRadius: 5, borderTopLeftRadius: 5,
            boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)"
        }}
        cover={
            <Title style={{ background: textWidget?.color ? textWidget?.color : '#542344' }}>
                <H2>
                    <InfoCircleFilled style={{ fontSize: 20, color: '#00b0ff', paddingRight: '3px' }} />{textWidget?.title}
                </H2>
            </Title>
        }
    >
        {/* <Row>
            <Col span={8}><PurpleText>4567</PurpleText> </Col>
            <Col span={16}>
                <SampleText>
                    Stories Told
                </SampleText>
            </Col>
        </Row>
        <Row>
            <Col span={8}>
                <PurpleText>1234</PurpleText>
            </Col>
            <Col span={16}>
                <LinkText>Staff Listening</LinkText>
            </Col>
        </Row>
        <Row>
            <BlackTitle>
                In the past month
            </BlackTitle>
        </Row>
        <Row>
            <Col span={8}>
                <PurpleText>74 %</PurpleText>
            </Col>
            <Col span={16}>
                <LinkText>of stories received</LinkText>
            </Col>
        </Row>
        <Row>
            <Col span={8} style={{}}>
                <GreenText>91 %</GreenText>
            </Col>
            <Col span={16}>
                <SampleText>
                    of rated response
                </SampleText>
            </Col>
        </Row>
        <Row >
            <ReadMore>
                <a>More ...</a>
            </ReadMore>
        </Row> */}
        <div dangerouslySetInnerHTML={{ __html: textWidget?.description }} />
    </Card>
}


export default TextWidget
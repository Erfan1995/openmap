
import { Card, Row } from "antd";
import ReactPlayer from "react-player/lazy";
import styled from "styled-components";


const Title = styled.div`
    height:50px;
    width:100%;
    border-top-right-radius:5px;
    border-top-left-radius:5px;
`;

const H2 = styled.h2`
    color:white;
    padding:10px
`


const VideoWidget = ({ videoWidget }) => {
    return <Card
        bodyStyle={{ padding: "0" }}
        style={{
            width: 300,
            border: '1px solid #ddd',
            borderTopRightRadius: 5, borderTopLeftRadius: 5,
            boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)"
        }}
        cover={
            <Title style={{ backgroundColor: videoWidget.color ? videoWidget.color : '#542344' }}>
                <H2>
                    {videoWidget.title}
                </H2>
            </Title>
        }
    >
        <Row>
            <ReactPlayer height="160px"
                url={videoWidget.video_link}
                controls={true}
                
            />
        </Row>
    </Card>
}

export default VideoWidget;
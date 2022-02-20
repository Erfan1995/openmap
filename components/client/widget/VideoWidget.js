
import { Card, Row } from "antd";
import ReactPlayer from "react-player/lazy";
import styled from "styled-components";


const Title = styled.div`
    width: 100%; 
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    color:white;
    padding:10px;
`;


const VideoWidget = ({ videoWidget,width,height }) => {
    return <Card
        bodyStyle={{ padding: "0" }}
        style={{
            width: width,
            border: '1px solid #ddd',
            borderTopRightRadius: 5, borderTopLeftRadius: 5,
            boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)"
        }}
        cover={
            <Title style={{ backgroundColor: videoWidget.color ? videoWidget.color : '#542344',height:50,fontSize:20 }}>
                {videoWidget.title}
            </Title>
        }
    >
        <Row >
            <ReactPlayer
                height={height}
                url={videoWidget?.video_link}
                controls={true}
            />
        </Row>
    </Card>
}

export default VideoWidget;
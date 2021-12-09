import { Loader } from "@googlemaps/js-api-loader";
import { Row, Col } from "antd";
import styled from "styled-components";
import { timeSince } from "lib/general-functions";
import Progressbar from "./progressbar/progressbar";
import { useState } from "react";
const CustomItem = styled.div`
    width:100%;
    border-radius:10px;
    background-color:white;
    padding:10px;
    box-shadow:0 16px 16px hsl(0deg 0% 0% / 0.075);
    
    &:hover{
        cursor:pointer;
    }
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
const ListItem = ({ item, makeModalVisible }) => {
    // let loader = new Loader({
    //     apiKey: "AIzaSyB_VDWRbprK5cMsT-mj0dgAR-G2bMyHLKU",
    // });
    // loader.load().then((google) => {
    //     let latlng = new google.maps.LatLng(item.latlng[0], item.latlng[1]);
    //     let geocoder = new google.maps.Geocoder();
    //     geocoder.geocode({ 'latLng': latlng }, (results, status) => {
    //         if (status !== google.maps.GeocoderStatus.OK) {
    //             alert(status);
    //         }
    //         // This is checking to see if the Geoeode Status is OK before proceeding
    //         if (status == google.maps.GeocoderStatus.OK) {
    //             console.log(results);
    //             let address = (results[0].formatted_address);
    //             console.log(address);
    //         }
    //     });
    // })

    return <CustomItem onClick={() => makeModalVisible(item)} >
        <div>
            <Row>
                <Col span={12}>
                    <Row>
                        <SmallTitle>
                            {timeSince(new Date(item.pubDate))}
                        </SmallTitle>
                    </Row>
                    <Row style={{ fontSize: 15 }}>
                        {item.surveyInfo.title}
                    </Row>
                </Col>
                <Col span={12} style={{ borderLeft: '1px solid #ccc', padding: 10 }}>
                    {item.progressbar.steps.length > 0 && (
                        <Progressbar progressbar={item.progressbar} />
                    )}
                </Col>
            </Row>
            <Row>
                <TextDev>
                    Video provides a powerful way to help you prove your point. When you click Online Video, you can paste in the embed code for the video you want to add.
                </TextDev>
            </Row>
        </div>

    </CustomItem>
}

export default ListItem;
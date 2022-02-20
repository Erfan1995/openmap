import { Loader } from "@googlemaps/js-api-loader";
import { Row, Col } from "antd";
import styled from "styled-components";
import { timeSince } from "lib/general-functions";
import { useEffect, useState } from "react";
import ProgressbarWidget from "./progressbarWidget";

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
    font-size: 11px; 
    color:#aaa
`;

const SmallTitle = styled.div`
    color:#aaa;
    font-size:10px
`;
const ListItem = ({ item, makeModalVisible }) => {
    let itemText = item.data[0] !== undefined ? Object.entries(item.data[0]) : null;
    return (
        <CustomItem onClick={() => makeModalVisible(item)} >
            <div>
                <Row>
                    <Col span={12}>
                        <Row>
                            <SmallTitle>
                                {timeSince(new Date(item.pubDate))}
                            </SmallTitle>
                        </Row>
                        <Row style={{ fontSize: 15 }}>
                            {item?.metaData?.title}
                        </Row>
                        <Row>
                            <SmallTitle>
                                {item.address}
                            </SmallTitle>
                        </Row>
                    </Col>
                    <Col span={12} style={{ borderLeft: '1px solid #ccc', padding: 10 }}>
                        {item.progressbar.steps.length > 0 && item.progressbar.progressbarStatus && (
                            <ProgressbarWidget progressbar={item.progressbar} />
                        )}
                    </Col>
                </Row>
                <Row>
                    <TextDev>
                        {itemText !== null ? itemText[0][1] : ""}
                    </TextDev>
                </Row>
            </div>

        </CustomItem>
    )
}

export default ListItem;
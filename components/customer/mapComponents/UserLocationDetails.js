import { Spin, Row, Col, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPublicUsers } from "../../../lib/api";
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { DATASET } from '../../../static/constant';
import jsPDF from 'jspdf';
const UserLocationDetails = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [location, setLocation] = useState(null);
    useEffect(() => {
        async function fetchPublicUser() {
            setLoading(true);
            let response = await getPublicUsers({ id: id });
            setUsers(response);
            setLocation(response[0].location_data);
            setLoading(false);
        }
        fetchPublicUser();
    }, []);


    const ModalBody = styled.div`
        padding:20px;
    `;

    const Title = styled.span`
        color:#707070
    `

    const EmptyLocation = styled.div`
        padding:100px;
        width:100%;
        text-align:center;
        color:#aaa;
        font-size:25px;
    `;


    const onGeneratePdf = () => {

        var colItems = { "col1": "Title", "col2": "Value ", "col3": "Title", "col4": "Value" };
        var printData = [
            { "col1": DATASET.IP_ADDRESS, "col2": location?.ip, "col3": DATASET.ZIP_CODE, "col4": location?.zip },
            { "col1": DATASET.CITY, "col2": location?.city, "col3": DATASET.IP_TYPE, "col4": location?.type },
            { "col1": DATASET.LATITUTE, "col2": location?.latitude, "col3": DATASET.LONGITUDE, "col4": location?.longitude },
            { "col1": DATASET.COUNTRY, "col2": location?.country_name, "col3": DATASET.COUNTRY_CODE, "col4": location?.country_code },
            { "col1": DATASET.CONTINENT, "col2": location?.continent_name, "col3": DATASET.CONTINENT_CODE, "col4": location?.continent_code },
            { "col1": DATASET.LOCATION, "col2": location?.location?.capital, "col3": DATASET.IS_EU, "col4": location?.location?.is_eu },
            { "col1": DATASET.LANGUAGES, "col2": DATASET.LANGUAGE_CODE, "col3": DATASET.LANGUAGE_NAME, "col4": DATASET.LANGUAGE_NATIVE },
        ]

        location?.location?.languages.map((language) => {
            printData.push({ "col1": "", "col2": language.code, "col3": language.name, "col4": language.native })
        })

        const doc = jsPDF();
        doc.text(DATASET.USER_LOCATION_INFO, 15, 10);
        doc.autoTable({
            head: [colItems],
            body: printData
        });
        doc.save('table.pdf')
    }


    return (<>
        <Spin spinning={loading}>
            <div>
                {location !== null ? <ModalBody>
                    <h2>{DATASET.USER_LOCATION_INFO}</h2>
                    <br />
                    <Row>
                        <Col span={5}><Title>{DATASET.IP_ADDRESS} </Title></Col>
                        <Col span={7}>{location?.ip}</Col>
                        <Col span={5}><Title>{DATASET.ZIP_CODE}</Title> </Col>
                        <Col span={7}>{location?.zip}</Col>
                    </Row>
                    <Row>
                        <Col span={5}><Title>{DATASET.CITY}</Title> </Col>
                        <Col span={7}>{location?.city}</Col>
                        <Col span={5}><Title>{DATASET.IP_TYPE}</Title> </Col>
                        <Col span={7}>{location?.type}</Col>
                    </Row>
                    <Row>
                        <Col span={5}><Title>{DATASET.LATITUTE}</Title> </Col>
                        <Col span={7}>{location?.latitude}</Col>
                        <Col span={5}><Title>{DATASET.LONGITUDE}</Title> </Col>
                        <Col span={7}>{location?.longitude}</Col>
                    </Row>
                    <Row>
                        <Col span={5}><Title>{DATASET.COUNTRY}</Title></Col>
                        <Col span={7}><img height="15" src={location?.location?.country_flag}></img> &nbsp; {location?.country_name}</Col>
                        <Col span={5}><Title>{DATASET.COUNTRY_CODE}</Title></Col>
                        <Col span={7}>{location?.country_code}</Col>
                    </Row>
                    <Row>
                        <Col span={5}><Title>{DATASET.CONTINENT}</Title></Col>
                        <Col span={7}>{location?.continent_name}</Col>
                        <Col span={5}><Title>{DATASET.CONTINENT_CODE}</Title></Col>
                        <Col span={7}>{location?.continent_code}</Col>
                    </Row>
                    <Row>
                        <Col span={5}><Title>{DATASET.LOCATION}</Title></Col>
                        <Col span={7}>{location?.location?.capital}</Col>
                        <Col span={5}><Title>{DATASET.IS_EU}</Title></Col>
                        <Col span={7}>{location?.location?.is_eu ? "True" : " False"}</Col>
                    </Row>
                    <Row>
                        <Col span={5}><Title>{DATASET.GEO_NAME_ID}</Title></Col>
                        <Col span={7}>{location?.location?.geoname_id}</Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={5}><Title>{DATASET.LANGUAGES}</Title></Col>
                        <Col span={19}>{location?.location?.languages?.map((lang) => {
                            return <div>
                                <Row>
                                    <Col span={3}><Title>{DATASET.LANGUAGE_CODE}</Title></Col><Col span={3}>{lang?.code}</Col>
                                    <Col span={3}><Title>{DATASET.LANGUAGE_NAME}</Title></Col><Col span={6}>{lang?.name}</Col>
                                    <Col span={3}><Title>{DATASET.LANGUAGE_NATIVE}</Title></Col><Col span={6}>{lang?.native}</Col>
                                </Row>
                            </div>
                        })}</Col>
                    </Row>
                    <br />
                    <Row>
                        <Button onClick={() => onGeneratePdf()}>{DATASET.DOWNLOAD}</Button>
                    </Row>

                </ModalBody> : <EmptyLocation> {DATASET.LOCATION_EMPTY_MESSAGE} </EmptyLocation>}
            </div>
        </Spin>

    </>)
}

export default UserLocationDetails
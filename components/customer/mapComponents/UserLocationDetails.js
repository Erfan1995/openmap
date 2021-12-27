import { Spin, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPublicUsers } from "../../../lib/api";
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { DATASET } from '../../../static/constant';
const UserLocationDetails = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [location,setLocation]=useState(null);
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

    const Title=styled.span`
        color:#707070
    `

    const EmptyLocation=styled.div`
        padding:100px;
        width:100%;
        text-align:center;
        color:#aaa;
        font-size:25px;
    `;



    return (<>
        <Spin spinning={loading}>
            <div>
                { location!==null ? <ModalBody>
                        <h2>{DATASET.USER_LOCATION_INFO}</h2>
                        <br/>
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
                        <br/>
                        <Row>
                            <Col span={5}><Title>{DATASET.LANGUAGES}</Title></Col>
                            <Col span={19}>{location?.location?.languages?.map((lang)=>{
                                return <div>
                                    <Row>
                                        <Col span={3}><Title>{DATASET.LANGUAGE_CODE}</Title></Col><Col span={3}>{lang?.code}</Col>
                                        <Col span={3}><Title>{DATASET.LANGUAGE_NAME}</Title></Col><Col span={6}>{lang?.name}</Col>
                                        <Col span={3}><Title>{DATASET.LANGUAGE_NATIVE}</Title></Col><Col span={6}>{lang?.native}</Col>
                                    </Row>
                                </div>
                            })}</Col>
                        </Row>
                    </ModalBody> : <EmptyLocation> {DATASET.LOCATION_EMPTY_MESSAGE} </EmptyLocation>}
            </div>
        </Spin>

    </>)
}

export default UserLocationDetails
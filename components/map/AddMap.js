import { Modal,  Col, Row,  List, Card, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getSurveyForms, postMethod } from 'lib/api';
import { API, MAP } from '../../static/constant';
import { getStrapiMedia } from 'lib/media';
import * as Survey from "survey-react"
import styled from 'styled-components';

import "survey-creator/survey-creator.css";
import "survey-react/survey.css";

const { Title } = Typography;
const Photo = styled.img`
  width:43px;
  height:43px;
  :hover{
      opacity:0.8;
  }
`

const MarkerCard = styled(Card)`
&:hover{
    cursor:pointer;
}
`

const SurveyCard = styled(Card)`
 min-height:200px;
 &:hover{
    cursor:pointer;
    border:1px solid #a1a1a1;

}
`



const AddMap = ({ onDataSaved, myVisible, geoData, mapData, modalClose, userType, userId }) => {
    const [visible, setVisible] = useState(false);
    const [mainMapData, setMainMapData] = useState(null);
    const [mapManualData, setMapManualData] = useState(null);
    const [icons, setIcons] = useState(mapData?.mapsurveyconfs?.length > 0 ? mapData?.mapsurveyconfs[0]?.icons.map(item => ({ ...item, isSelected: false })) : []);
    const [selectedIcons, setSelectedIcons] = useState();
    const [loading, setLoading] = useState(false);
    const [surveys, setSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurveys] = useState();
    const [topPadding, setTopPadding] = useState(150);

    const onCompleteSurvey = async (data) => {
        setLoading(true);
        data.valuesHash.geolocation = mapManualData.coordinates;
        try {
            let values = {};
            values.map = mainMapData.id;
            values.geometry = mapManualData;
            values.properties = data.valuesHash;
            values.survey = selectedSurvey.id;
            if (geoData.type === 'Point') {
                values.icon = selectedIcons ? selectedIcons.id : null;
            }
            let res = null;
            if (userType === 'public') {
                values.is_approved = false;
                values.public_user = userId;
                res = await postMethod('mmdpublicusers', values, false);
            } else {
                values.is_approved = true;
                values.user = userId;
                res = await postMethod('mmdcustomers', values);
            }


            if (res) {
                setVisible(false);
                onDataSaved();
                setLoading(false)
            }
        }
        catch (info) {
            setLoading(false)
            console.error(info);
        };

    }

    const closeDrawer = () => {
        setVisible(false)
        modalClose();
    }

    const selectMarker = (item) => {
        setSelectedIcons(item);
        if (mapData?.mapsurveyconfs?.length > 0) {
            setIcons(mapData?.mapsurveyconfs[0]?.icons.map((obj) => {
                if (item.id === obj.id) {
                    return { ...obj, isSelected: true }
                } else {
                    return { ...obj, isSelected: false }
                }
            }));
        }
    }


    const selectSurvey = (item) => {
        setSelectedSurveys(item);
        setSurveys(surveys.map((obj) => {
            if (item.id === obj.id) {
                return { ...obj, isSelected: true }
            } else {
                return { ...obj, isSelected: false }
            }
        }));
        setTopPadding(20);
    }


    const callback = async () => {
        setLoading(true);
        try {
            let res = await getSurveyForms({ maps: mapData.id }, null, false);
            if (res) {
                setSurveys(res);
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
        }

    }

    useEffect(() => {
        callback();
        setVisible(myVisible);
        setMapManualData(geoData);
        setMainMapData(mapData);
    }, [])


    return <>
        <Modal
            title={mapData.dialog_title}
            width={550}
            visible={visible}
            destroyOnClose={true}
            footer={null}
            style={{ top: topPadding }}
            onCancel={closeDrawer}
        >
            <Spin spinning={loading} >



                <Row className='padding-10'>

                    {!selectedSurvey &&
                        <Col span={24} className='padding-10 text-center'>
                            <List
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 2,
                                    md: 3,
                                    lg: 3,
                                    xl: 3,
                                    xxl: 3,
                                }}
                                dataSource={surveys}
                                renderItem={(item, index) => (
                                    <List.Item >
                                        <SurveyCard key={`surveyCard${index}`} className={item.isSelected ? 'selectedBox' : ''} onClick={() => selectSurvey(item)} >
                                            <img src={item.forms?.logo} style={{ height: 70 }} />

                                            <Title level={5} className='margin-top-10 text-center'>
                                                {item.forms?.title}
                                            </Title>

                                        </SurveyCard>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    }
                    {
                        selectedSurvey &&
                        <Col span={24}>
                            <Row gutter={16}>

                                {
                                    geoData.type === 'Point' &&
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <h5>{MAP.SELECT_ICON}</h5>

                                        <List
                                            // pagination={true}
                                            grid={{
                                                gutter: 16,
                                                xs: 3,
                                                sm: 4,
                                                md: 5,
                                                lg: 5,
                                                xl: 5,
                                                xxl: 5,

                                            }}
                                            dataSource={icons || []}
                                            renderItem={(item) => (
                                                <List.Item key={`listItem` + item.id} >
                                                    <MarkerCard className={'text-center ' + (item.isSelected ? 'selectedBox' : '')} onClick={() => selectMarker(item)} >
                                                        <Photo src={getStrapiMedia(item.icon[0])} />
                                                    </MarkerCard>
                                                </List.Item>
                                            )}
                                        />

                                    </Col>
                                }

                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                                    <Survey.Survey
                                        json={selectedSurvey.forms}
                                        showCompletedPage={true}
                                        onComplete={data => onCompleteSurvey(data)}>
                                    </Survey.Survey>

                                </Col>

                            </Row>
                        </Col>
                    }
                </Row>

            </Spin>

        </Modal>

    </>


}

export default AddMap;
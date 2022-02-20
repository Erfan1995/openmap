import { Modal, Col, Row, List, Card, Spin, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { getSurveyForms, postMethod } from 'lib/api';
import { API, MAP } from '../../static/constant';
import { getStrapiMedia } from 'lib/media';
import * as Survey from "survey-react"
// import * as SurveyKo from "survey-knockout";
import styled from 'styled-components';
import * as widgets from "surveyjs-widgets";
import { SUREVEY_COLORS } from '../../static/constant';
import $ from "jquery";
import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";
import "jquery-ui/ui/widgets/datepicker.js";

import "select2/dist/js/select2.js";
import "select2/dist/css/select2.css";


import "icheck/skins/square/blue.css";
import "pretty-checkbox/dist/pretty-checkbox.css";
import "easy-autocomplete/dist/easy-autocomplete.css";


// bar rating 
import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/jquery.barrating.min.js";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";


import "survey-creator/survey-creator.css";
import "survey-knockout/survey.css";
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
    const [address, setAddress] = useState(" ");
    var resolvedFlag = true;

    useEffect(async () => {
        window["$"] = window["jQuery"] = $;
        require("emotion-ratings/dist/emotion-ratings.js");
        require("easy-autocomplete/dist/jquery.easy-autocomplete.js");

        // ckeditor
        // const self = this;
        // if (self.alreadyRendered) return;
        const script = document.createElement("script");
        script.src = "https://cdn.ckeditor.com/4.14.1/standard/ckeditor.js";
        document.head.append(script);
        script.onload = function () {
            window.CKEDITOR;
            // self.alreadyRendered = true;
            // if (self.forceUpdate) self.forceUpdate(); // need only for REACT
        };

        widgets.icheck(Survey, $);
        widgets.prettycheckbox(Survey);
        widgets.select2(Survey, $);
        widgets.inputmask(Survey);
        widgets.jquerybarrating(Survey, $);
        widgets.jqueryuidatepicker(Survey, $);
        widgets.nouislider(Survey);
        widgets.select2tagbox(Survey, $);
        widgets.sortablejs(Survey);
        widgets.ckeditor(Survey);
        widgets.autocomplete(Survey);
        widgets.bootstrapslider(Survey);
        widgets.emotionsratings(Survey);

        var defaultThemeColorsSurvey = Survey.StylesManager.ThemeColors["default"];
        defaultThemeColorsSurvey["$main-color"] = SUREVEY_COLORS.MAIN_COLOR;
        defaultThemeColorsSurvey["$main-hover-color"] = SUREVEY_COLORS.MAIN_HOVER_COLOR;
        defaultThemeColorsSurvey["$text-color"] = SUREVEY_COLORS.TEXT_COLOR;
        defaultThemeColorsSurvey["$header-color"] = SUREVEY_COLORS.HEADER_COLOR;
        defaultThemeColorsSurvey["$body-container-background-color"] = SUREVEY_COLORS.BODY_CONTAINER_BACKGROUND_COLOR;
        Survey.StylesManager.applyTheme(defaultThemeColorsSurvey);

        var defaultThemeColorsEditor = Survey.StylesManager.ThemeColors["default"];
        defaultThemeColorsEditor["$primary-color"] = SUREVEY_COLORS.MAIN_COLOR; 
        defaultThemeColorsEditor["$secondary-color"] = SUREVEY_COLORS.MAIN_COLOR;
        defaultThemeColorsEditor["$primary-hover-color"] = SUREVEY_COLORS.MAIN_HOVER_COLOR;
        defaultThemeColorsEditor["$primary-text-color"] = SUREVEY_COLORS.TEXT_COLOR;
        defaultThemeColorsEditor["$selection-border-color"] = SUREVEY_COLORS.MAIN_COLOR;
        Survey.StylesManager.applyTheme();


        let url = process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_MAP
        let lat = geoData.coordinates[0];
        let lng = geoData.coordinates[1];
        await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${lat}%2C${lng}`,
            { headers: { 'Accept': 'application/json' } })
            .then((res) => res.json())
            .then((data) => {
                setAddress(data.address.LongLabel);
            });
    }, [])

    const onCompleteSurvey = async (data) => {
        setLoading(true);
        data.valuesHash.geolocation = mapManualData.coordinates;
        try {
            let values = {};
            values.map = mainMapData.id;
            values.geometry = mapManualData;
            values.properties = data.valuesHash;
            values.survey = selectedSurvey.id;
            values.address = address;
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
        console.log('selectedSurvey '+JSON.stringify(item.forms))
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
            let res = await getSurveyForms({ maps: mapData.id }, null, true);
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
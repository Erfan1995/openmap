import styled from 'styled-components';
import * as Survey from "survey-react"
import { init } from 'components/customer/surveyCompenents/MapWidget';
import "survey-react/survey.css";
import "survey-creator/survey-creator.css";
import { useEffect, useState } from 'react';
import { postMethod } from 'lib/api';

Survey.StylesManager.ThemeColors['green'];
const Wrapper = styled.div`
    padding:100px
`

const SharedSurvey = ({ survey, mapId }) => {
    const [json, setJson] = useState([]);
    const [surveyId, setSurveyId] = useState();
    const [userInfo, setUserInfo] = useState();
    console.log(survey);
    init(Survey);

    useEffect(() => {
        setSurveyId(survey.id);
        setJson(survey.forms);
        getUserIp();
    }, [survey]);

    // fetches users ip address and location details
    const getUserIp = async () => {
        const res = await fetch('https://ipapi.co/json/')
            .then((res) => res.json())
            .then((data) => {
                setUserInfo(data);
            })
    }
    const onCompleteSurvey = (data) => {
        let latlng;
        let geometry;
        let properties = data.valuesHash;
        Object.entries(data.valuesHash).map(value => {
            if (value[1].lat) {
                latlng = [value[1].lng, value[1].lat];
                geometry = { 'type': 'Point', 'coordinates': latlng };
                getAddress(value[1].lat, value[1].lng, geometry, properties);
            }
        })

    }
    const store = async (geometry, properties, address) => {
        let values = {};
        values.map = mapId;
        values.geometry = geometry;
        values.properties = properties;
        values.survey = surveyId;
        values.address = address;
        values.ip = userInfo.ip;
        values.is_approved = false;
        const res = await postMethod('mmdpublicusers', values, false);

    }

    const getAddress = async (lat, lng, geometry, properties) => {
        console.log(lat, lng);
        await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${lng}%2C${lat}`,
            { headers: { 'Accept': 'application/json' } })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                store(geometry, properties, data.address.LongLabel);
            });
    }

    return (
        <Wrapper>
            <div>
                <Survey.Survey
                    model={new Survey.Model(json)}
                    showCompletedPage={true}
                    onComplete={data => onCompleteSurvey(data)}
                >
                </Survey.Survey>
            </div>
        </Wrapper>
    )
}
export default SharedSurvey;
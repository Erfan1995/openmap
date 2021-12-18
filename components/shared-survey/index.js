import styled from 'styled-components';
import * as Survey from "survey-react"
import { init } from 'components/customer/surveyCompenents/MapWidget';
import "survey-react/survey.css";
import "survey-creator/survey-creator.css";
import { useEffect, useState } from 'react';
Survey.StylesManager.ThemeColors['green'];
const Wrapper = styled.div`
    padding:100px
`

const SharedSurvey = ({ survey, mapId }) => {
    const [json, setJson] = useState([]);
    const [surveyId, setSurveyId] = useState();
    init(Survey);

    useEffect(() => {
        setSurveyId(survey.id);
        setJson(survey.forms);
    }, [survey])

    const onCompleteSurvey = (data) => {
        let latlng;
        let address;
        console.log(data.valuesHash)
        Object.entries(data.valuesHash).map(value => {
            console.log(value);
            if (value[1].lat) {
                latlng = [value[1].lat, value[1].lng];
                address = getAddress(value[1].lat, value[1].lng);
            }
        })
        console.log(address);

    }
    const getAddress = async (lat, lng) => {
        console.log(lat, lng);
        let address;
        await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${lat}%2C${lng}`,
            { headers: { 'Accept': 'application/json' } })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                address = data.address.LongLabel;
            });
        console.log(address);
        return address;

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
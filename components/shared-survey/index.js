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

const SharedSurvey = ({ survey }) => {
    const [json, setJson] = useState([]);
    const [surveyId, setSurveyId] = useState();
    init(Survey);

    useEffect(() => {
        setSurveyId(survey.id);
        setJson(survey.forms);
    }, [survey])

  
    const onCompleteSurvey = (data) => {
        console.log(data)
        let myLatLng;
        let questions = Object.values(data.questionHashes.names);
        questions.map(question => {
            if (question[0].lat) {
                myLatLng = `${question[0].lat},${question[0].lng}`
            }
        })
        console.log(myLatLng);
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
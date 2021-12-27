import "survey-analytics/survey.analytics.css";
import * as Survey from "survey-react";
import { VisualizationPanel } from "survey-analytics";
import React, { useEffect, useState } from "react";
import { Button, Tabs, Modal, Spin, message, List } from 'antd';
import { getSurveyFormsValues } from 'lib/api';
import { ArrowLeftOutlined } from '@ant-design/icons';
const SurveyAnalyticsComponent = ({ user, surveyForms, token }) => {
    const [loading, setLoading] = useState(false);
    const [surveyClicked, setSurveyClicked] = useState(false);
    const [surveyJson, setSurveyJson] = useState();
    const [surveyResult, setSurveyResult] = useState([]);
    let visPanel;
    useEffect(() => {
        if (surveyClicked) {
            let options = {
                haveCommercialLicense: true //Add this line
            };
            const survey = new Survey.SurveyModel(surveyJson);
            visPanel = new VisualizationPanel(survey.getAllQuestions(), surveyResult, options);
            visPanel.render(document.getElementById("summaryContainer"));
        }
    })

    const displayAnalytics = async (item) => {
        setSurveyJson();
        setSurveyResult([]);
        setLoading(true);
        const data = await getSurveyFormsValues(item.id, token);
        if (data) {
            let mergedData = data.mmdcustomers.concat(data.mmdpublicusers);
            let arr = [];
            let i = 0;
            mergedData.map((data) => {
                arr[i] = data.properties;
                i++;
            })
            setSurveyResult(arr);
            setLoading(false);
        }
        setSurveyJson(item.forms);
        setSurveyClicked(true);
    }
    return (
        <Spin spinning={loading}>
            {surveyClicked ? <div>
                <Button style={{ marginLeft: -10, marginTop: -30 }} icon={<ArrowLeftOutlined />} onClick={() => {
                    setSurveyClicked(false);
                }} type='link'>back</Button>
                <div id="summaryContainer">
                </div>
            </div> : <div>
                <List
                    pagination={true}
                    dataSource={surveyForms}
                    renderItem={item => (
                        <List.Item >
                            <List.Item.Meta
                                title={<a onClick={() => displayAnalytics(item)} >{item.forms.title}</a>}
                                description={item.forms.description}
                            />
                        </List.Item>
                    )}
                />
            </div>}
        </Spin>
    )
}
export default SurveyAnalyticsComponent;
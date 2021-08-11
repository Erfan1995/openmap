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
            const survey = new Survey.SurveyModel(surveyJson);
            visPanel = new VisualizationPanel(survey.getAllQuestions(), surveyResult);
            visPanel.render(document.getElementById("summaryContainer"));
        }
    })

    const displayAnalytics = async (item) => {
        setSurveyJson();
        setSurveyResult([]);
        setLoading(true);
        let res;
        const data = await getSurveyFormsValues({ survey: item.id }, token);
        if (res) {
            let arr = [];
            let i = 0;
            res.map((data) => {
                arr[i] = data.result;
                i++;
            })
            setSurveyResult(arr);
            setLoading(false);
        }
        setSurveyJson(JSON.parse(item.forms));
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
                                title={<a onClick={() => displayAnalytics(item)} >{(JSON.parse(item.forms)).title}</a>}
                                description={(JSON.parse(item.forms)).description}
                            />
                        </List.Item>
                    )}
                />
            </div>}
        </Spin>
    )
}
export default SurveyAnalyticsComponent;
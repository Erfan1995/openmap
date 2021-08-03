import "survey-analytics/survey.analytics.css";
import * as Survey from "survey-react";
import { data, json } from "./analytics_data";
import { VisualizationPanel } from "survey-analytics";
import styled from 'styled-components';
import React, { useEffect, useState } from "react";
import { Button, Tabs, Modal, Spin, message, List } from 'antd';
import { getSurveyFormsValues } from 'lib/api';
import { DATASET } from 'static/constant';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ArrowLeftOutlined } from '@ant-design/icons';
const SurveyAnalyticsComponent = ({ user, surveyForms, token }) => {
    const [loading, setLoading] = useState(false);
    const [surveyClicked, setSurveyClicked] = useState(false);
    const [surveyList, setSurveyList] = useState([]);
    const [surveyId, setSurveyId] = useState();
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

    const displayAnalytics = async (item, state) => {
        const res = await getSurveyFormsValues({ survey: item.id }, token);
        if (res) {
            console.log(res);
            setSurveyResult(res)
        }
        setSurveyClicked(state);
        setSurveyJson(JSON.parse(item.forms));
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
                                title={<a onClick={() => displayAnalytics(item, true)} >{(JSON.parse(item.forms)).title}</a>}
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
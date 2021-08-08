import React, { useEffect, useState } from "react";
import { data, json } from "./analytics_data";
import { Button, Tabs, Modal, Spin, message, List } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getSurveyFormsValues } from 'lib/api';
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { Tabulator } from "survey-analytics/survey.analytics.tabulator.js";
import "survey-analytics/survey.analytics.tabulator.css";
import "tabulator-tables/dist/css/tabulator.min.css";
window.jsPDF = jsPDF;
window.XLSX = XLSX;
import * as Survey from "survey-react";
const SurveyReportComponent = ({ user, surveyForms, token }) => {
    let visPanel;
    const [loading, setLoading] = useState(false);
    const [surveyClicked, setSurveyClicked] = useState(false);
    const [surveyJson, setSurveyJson] = useState();
    const [surveyResult, setSurveyResult] = useState([]);
    useEffect(() => {
        if (surveyClicked) {
            const survey = new Survey.SurveyModel(surveyJson);
            visPanel = new Tabulator(survey, surveyResult);
            console.log(visPanel.data);
            visPanel.render(document.getElementById("summaryContainer"));
        }
    })
    const displayResult = async (item) => {
        setSurveyJson();
        setSurveyResult([]);
        setLoading(true);
        let res ;
        // const res = await getSurveyFormsValues({ survey: item.id }, token);
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
                                title={<a onClick={() => displayResult(item)} >{(JSON.parse(item.forms)).title}</a>}
                                description={(JSON.parse(item.forms)).description}
                            />
                        </List.Item>
                    )}
                />
            </div>}
        </Spin>
    );
}
export default SurveyReportComponent;
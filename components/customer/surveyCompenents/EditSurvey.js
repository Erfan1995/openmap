import styled from 'styled-components';
import React, { useEffect, useState } from "react";
import * as SurveyJSCreator from "survey-creator";
import * as Survey from "survey-react"
import { Button, Tabs, Modal, Spin, message, List } from 'antd';
import { putMethod } from 'lib/api';
import { DATASET } from 'static/constant';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ArrowLeftOutlined } from '@ant-design/icons';
SurveyJSCreator.StylesManager.applyTheme('default');
const { confirm } = Modal;

import "survey-creator/survey-creator.css";
import "survey-react/survey.css";

const EditSurvey = ({ surveyJson, updateSurveyList, setVisible }) => {
    let surveyCreator;
    const [loading, setLoading] = useState(false);
    const [surveyForms, setSurveyForm] = useState(surveyJson.forms)
    const saveMySurvey = async () => {
        const dd = JSON.parse(surveyCreator.text)
        if (!dd.pages[0].elements) {
            message.error("please add form!")
        } else {
            if (dd.title && dd.description) {
                setLoading(true);
                const result = await putMethod('surveys/' + surveyJson.id, { forms: JSON.stringify(dd) })
                if (result) {
                    setSurveyForm(result.forms);
                    updateSurveyList(result.forms, surveyJson.id);
                    setLoading(false);
                    message.success("survey added successfully!")
                    setVisible(false);
                }
            } else {
                message.error("please add title and description")
            }
        }
    };
    useEffect(() => {
        let options = {
            showEmbededSurveyTab: true,
            haveCommercialLicense: true,
            showLogicTab: true,
            showTranslationTab: true
        };

        surveyCreator = new SurveyJSCreator.SurveyCreator(
            null,
            options
        );
        surveyCreator.saveSurveyFunc = saveMySurvey;
        surveyCreator.text = JSON.stringify(surveyForms);
        surveyCreator.render("surveyContainer");
    });

    return (
        <Spin spinning={loading}>
            <div style={{ paddingTop: "30px" }}>
                <div id="surveyContainer">

                </div>
            </div>
        </Spin>
    )
}
export default EditSurvey;
import styled from 'styled-components';
import React, { useEffect, useState } from "react";
import * as SurveyJSCreator from "survey-creator";
import * as Survey from "survey-react"
import { Button, Tabs, Modal, Spin, message, List } from 'antd';
import { deleteMethod, getSurveyForms, postMethod } from 'lib/api';
import { DATASET } from 'static/constant';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ArrowLeftOutlined } from '@ant-design/icons';
SurveyJSCreator.StylesManager.applyTheme('default');

import "survey-creator/survey-creator.css";
import "survey-react/survey.css";
const { confirm } = Modal;
const { TabPane } = Tabs;
const Wrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const SurveyCreatorComponent = ({ authenticatedUser, token, surveyForms }) => {
    let surveyCreator;
    const [Json, setJson] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [surveyClicked, setSurveyClicked] = useState(false);
    const [surveyList, setSurveyList] = useState(surveyForms);
    const [surveyId, setSurveyId] = useState();
    const saveMySurvey = async () => {
        const dd = JSON.parse(surveyCreator.text)
        if (!dd.pages[0].elements) {
            message.error("please add form!")
        } else {
            if (dd.title && dd.description) {
                setLoading(true);
                const postSurvey = await postMethod('surveys', { user: authenticatedUser.id, forms: JSON.stringify(surveyCreator.text) })
                if (postSurvey) {
                    setLoading(false);
                    message.success("survey added successfully!")
                }
            } else {
                message.error("please add title and description")
            }
        }
    };
    // const onCompleteSurvey = async (data) => {
    //     setLoading(true);
    //     const res = await postMethod('surveyresults', { survey: surveyId, result: data.valuesHash });
    //     if (res) {
    //         setLoading(false);
    //     }

    // }
    useEffect(() => {
        let options = {
            showEmbededSurveyTab: true,
            haveCommercialLicense: true,
            showLogicTab : true,
            showTranslationTab: true
        };
        surveyCreator = new SurveyJSCreator.SurveyCreator(
            null,
            options
        );
        surveyCreator.saveSurveyFunc = saveMySurvey;
        surveyCreator.render("surveyCreatorContainer");
    });
    const callback = async (key) => {
        setSurveyClicked(false)
        setJson([]);
        if (key === "1") {
            setLoading(true);
            const res = await getSurveyForms({ user: authenticatedUser.id }, token);
            if (res) {
                res.map((data) => {
                    data.id = Number(data.id);
                })
                setSurveyList(res);
                setLoading(false);
            }
        }
    }
    const deleteSurvey = async (id) => {
        setLoading(true);
        try {
            const deletedSurvey = await deleteMethod('surveys/' + id);
            if (deletedSurvey) {
                const dd = surveyList.filter(dData => dData.id !== id)
                setSurveyList(dd);
                message.success(DATASET.SUCCESS);
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
    }
    function showConfirm(id) {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.DELETE_CONFIRM}</p>,
            onOk() {
                deleteSurvey(id)
            },
            onCancel() {
            },
        });
    }
    const displaySurvey = (item, state) => {
        setSurveyClicked(state);
        setSurveyId(item.id);
        setJson(item.forms);
    }
    return (
        <Spin spinning={loading}>
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab={<span>view survey</span>} key="1">
                    {surveyClicked ?
                        <div>
                            <Button style={{ marginLeft: -10, marginTop: -30 }} icon={<ArrowLeftOutlined />} onClick={() => {
                                setSurveyClicked(false);
                            }} type='link'>back</Button>
                            <Survey.Survey
                                json={Json}
                                showCompletedPage={false}
                            // onComplete={data => onCompleteSurvey(data)}
                            >
                            </Survey.Survey>
                        </div> :
                        <div>
                            <List
                                pagination={true}
                                dataSource={surveyList}
                                renderItem={item => (
                                    <List.Item style={{ margin: "0px 30px" }} actions={[<a onClick={() => showConfirm(item.id)} >delete</a>]}>
                                        <List.Item.Meta
                                            title={<a onClick={() => displaySurvey(item, true)} >{(JSON.parse(item.forms)).title}</a>}
                                            description={(JSON.parse(item.forms)).description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    }
                </TabPane>
                <TabPane tab={<span>create survey</span>} key="2">
                    <div>
                        <script type="text/html" id="custom-tab-survey-templates">
                            {`<div id="test">TEST</div>`}
                        </script>
                        <div id="surveyCreatorContainer" />
                    </div>
                </TabPane>
            </Tabs>
        </Spin>
    )

}
export default SurveyCreatorComponent;
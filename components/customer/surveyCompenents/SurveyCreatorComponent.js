import styled from 'styled-components';
import React, { useEffect, useState } from "react";
import * as SurveyJSCreator from "survey-creator";
import * as SurveyKo from "survey-knockout";
import * as Survey from "survey-react"
import { deleteMethod, getSurveyForms, postMethod } from 'lib/api';
import { DATASET } from 'static/constant';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ArrowLeftOutlined } from '@ant-design/icons';
import * as widgets from "surveyjs-widgets";
import $ from "jquery";
import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";

import "icheck/skins/square/blue.css";
import "pretty-checkbox/dist/pretty-checkbox.css";



var mainColor = "#7ff07f";
var mainHoverColor = "#6fe06f";
var textColor = "#4a4a4a";
var headerColor = "#7ff07f";
var headerBackgroundColor = "#4a4a4a";
var bodyContainerBackgroundColor = "#f8f8f8";

var defaultThemeColorsSurvey = Survey
    .StylesManager
    .ThemeColors["default"];
defaultThemeColorsSurvey["$main-color"] = mainColor;
defaultThemeColorsSurvey["$main-hover-color"] = mainHoverColor;
defaultThemeColorsSurvey["$text-color"] = textColor;
defaultThemeColorsSurvey["$header-color"] = headerColor;
defaultThemeColorsSurvey["$header-background-color"] = headerBackgroundColor;
defaultThemeColorsSurvey["$body-container-background-color"] = bodyContainerBackgroundColor;
var defaultThemeColorsEditor = SurveyJSCreator
    .StylesManager
    .ThemeColors["default"];
defaultThemeColorsEditor["$primary-color"] = mainColor;
defaultThemeColorsEditor["$secondary-color"] = mainColor;
defaultThemeColorsEditor["$primary-hover-color"] = mainHoverColor;
defaultThemeColorsEditor["$primary-text-color"] = textColor;
defaultThemeColorsEditor["$selection-border-color"] = mainColor;

Survey
    .StylesManager
    .applyTheme();
widgets.icheck(Survey, $);
// widgets.prettycheckbox(Survey);
widgets.select2(Survey, $);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey, $);
widgets.jqueryuidatepicker(Survey, $);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey, $);
//widgets.signaturepad(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);
widgets.autocomplete(Survey, $);
widgets.bootstrapslider(Survey);

SurveyJSCreator.StylesManager.applyTheme();


// import { json } from './analytics_data';
import { init } from './MapWidget';
import "survey-creator/survey-creator.css";
import "survey-react/survey.css";
import EditSurvey from './EditSurvey';
import copy from 'copy-to-clipboard';
import { CopyOutlined, GlobalOutlined, LinkOutlined } from '@ant-design/icons';
import { Modal, Spin, Row, Col, Typography, Input, message, List, Button, Tabs } from 'antd';
const { confirm } = Modal;
const { TabPane } = Tabs;
init(SurveyKo);
SurveyJSCreator.StylesManager.applyTheme('default');


widgets.icheck(SurveyKo, $);
widgets.prettycheckbox(SurveyKo);
widgets.select2(SurveyKo, $);
widgets.inputmask(SurveyKo);
widgets.jquerybarrating(SurveyKo, $);
widgets.jqueryuidatepicker(SurveyKo, $);
widgets.nouislider(SurveyKo);
widgets.select2tagbox(SurveyKo, $);
// widgets.signaturepad(SurveyKo);
widgets.sortablejs(SurveyKo);
widgets.ckeditor(SurveyKo);
// widgets.autocomplete(SurveyKo, $);
widgets.bootstrapslider(SurveyKo);
window["$"] = window["jQuery"] = $;


const Boxs = styled.div`
  background-color: #fff;
  min-height: 200px;
  text-align: center;
  padding:40px 20px;
`;


const IconWrapper = styled.span`
padding:10px 12px;
border:1px solid #efefef;
`;

const MainWrapper = styled.div`
min-height: 330px;
width: 100 %;
background-color: #f9f9f9;
padding: 50px;
`;
const SurveyCreatorComponent = ({ authenticatedUser, token, surveyForms }) => {
    let QRCode = require('qrcode.react');
    let surveyCreator;
    const [Json, setJson] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [activeKey, setActiveKey] = useState('1');
    const [surveyClicked, setSurveyClicked] = useState(false);
    const [surveyList, setSurveyList] = useState(surveyForms);
    const [surveyId, setSurveyId] = useState();
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [link, setLink] = useState('');

    const basePath = process.env.NEXT_PUBLIC_BASEPATH_URL;
    const saveMySurvey = async () => {
        const dd = JSON.parse(surveyCreator.text)
        if (!dd.pages[0].elements) {
            message.error("please add form!")
        } else {
            if (dd.title && dd.description) {
                dd.pages[0].elements.push({
                    "type": "text",
                    "name": "geolocation",
                    "visible": false
                })
                setLoading(true);
                try {
                    const postSurvey = await postMethod('surveys', { user: authenticatedUser.id, forms: JSON.stringify(dd), title: dd.title })
                    if (postSurvey) {
                        setLoading(false);
                        message.success("survey added successfully!");
                        tabChangeEvent('2');
                    }
                } catch (e) {
                    message.error(DATASET.SERVER_SIDE_PROB);
                    setLoading(false);
                }
            } else {
                message.error("please add title and description")
            }
        }
    };
    const updateSurveyList = (survey, id) => {
        surveyList.map((data) => {
            if (data.id === id) {
                data.forms = survey;
            }
        });
        setSurveyList(surveyList);
    }
    let options = {
        showEmbededSurveyTab: true,
        haveCommercialLicense: true,
        showLogicTab: true,
        showJSONEditorTab: true,
        showTestSurveyTab: true,
        showTranslationTab: true
    };

    useEffect(() => {
        surveyCreator = new SurveyJSCreator.SurveyCreator(
            null,
            options
        );

        surveyCreator.saveSurveyFunc = saveMySurvey;
        surveyCreator.render("surveyCreatorContainer");
    });
    const callback = async (key) => {
        if (!(JSON.parse(surveyCreator.text)?.pages[0]?.elements?.length > 0)) {
            tabChangeEvent(key);
        } else {
            showSurvayConfirm(key);
        }
    }


    const tabChangeEvent = async (key) => {
        setSurveyClicked(false)
        setActiveKey(key);
        setJson([]);
        if (key === "2") {
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
            const surveyConf = await deleteMethod('mapsurveyconfs/survey:' + id);
            if (surveyConf) {
                const deletedSurvey = await deleteMethod('surveys/' + id);
                if (deletedSurvey) {
                    const dd = surveyList.filter(dData => dData.id !== id)
                    setSurveyList(dd);
                    message.success(DATASET.SUCCESS);
                    setLoading(false);
                }
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

    function showSurvayConfirm(key) {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>{DATASET.SURVEY_CONFIRM}</p>,
            onOk() {
                saveMySurvey()
            },
            onCancel() {
                tabChangeEvent(key)
            },
        });
    }

    const displaySurvey = (item, state) => {
        init(Survey);
        setSurveyClicked(state);
        setSurveyId(item.id);
        setJson(new Survey.Model(item.forms));
    }
    const editSurvey = (item) => {
        setJson(item);
        setVisible(true);
    }
    const shareSurvey = (item) => {
        setLink(`${basePath}/?t=1&survey=${item.id}`);
        setShareModalVisible(true);


    }
    const onModalClose = () => {
        setShareModalVisible(false)
    }
    const onCompleteSurvey = (data) => {
       
    }
    return (
        <Spin spinning={loading}>
            <Tabs
                activeKey={activeKey}
                onChange={callback}>

                <TabPane tab={<span>create survey</span>} key="1">
                    <div>
                        <script type="text/html" id="custom-tab-survey-templates">
                            {`<div id="test">TEST</div>`}
                        </script>
                        <div id="surveyCreatorContainer" />
                    </div>
                </TabPane>
                <TabPane tab={<span>view survey</span>} key="2">
                    {surveyClicked ?
                        <div>
                            <Button style={{ marginLeft: -10, marginTop: -30 }} icon={<ArrowLeftOutlined />} onClick={() => {
                                setSurveyClicked(false);
                            }} type='link'>back</Button>
                            <Survey.Survey
                                model={Json}
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
                                    <List.Item style={{ margin: "0px 30px" }} actions={[
                                        <a onClick={() => showConfirm(item.id)} >delete</a>,
                                        <a onClick={() => editSurvey(item)} >edit</a>,
                                        <a onClick={() => shareSurvey(item)}>share</a>
                                    ]}>
                                        <List.Item.Meta
                                            title={<a onClick={() => displaySurvey(item, true)} >{item.forms.title}</a>}
                                            description={item.forms.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    }
                    <Modal
                        centered
                        bodyStyle={{ overflowX: 'scroll' }}
                        width={1300}
                        visible={visible}
                        destroyOnClose={true}
                        onCancel={() => {
                            setVisible(false)
                        }}
                        destroyOnClose={true}
                        footer={[
                            <Button key="close" onClick={() => { setVisible(false) }}> {DATASET.CLOSE}</Button>
                        ]}
                    >
                        <EditSurvey surveyJson={Json} updateSurveyList={updateSurveyList} />
                    </Modal>
                    <Modal
                        title='share survey'
                        centered
                        width={1000}
                        visible={shareModalVisible}
                        destroyOnClose={true}
                        onCancel={onModalClose}
                        footer={[]}
                        style={{ padding: 0 }}>
                        <MainWrapper>
                            <Row>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} className='padding-10'>
                                    <Boxs >
                                        <IconWrapper>
                                            <LinkOutlined />
                                        </IconWrapper>
                                        <Typography.Title level={5} className='margin-top-20'>Get the Link</Typography.Title>
                                        <p>Send to your friends, coworkers, or post it in your social networks.</p>

                                        <Input size='large' value={link} addonAfter={<CopyOutlined onClick={() => {
                                            if (copy(link)) {
                                                message.success('coppied to Clipboard!')
                                            }
                                        }} />} defaultValue="mysite" />
                                    </Boxs>

                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12} xl={12} className='padding-10'>
                                    <Boxs >
                                        <Typography.Title level={5} className='margin-top-20'>Scan the QR Code</Typography.Title>
                                        <p>Scan this QR code to view and fill the survey on your mobile devices.</p>
                                        <QRCode value={link} />
                                    </Boxs>
                                </Col>
                            </Row>
                        </MainWrapper>
                    </Modal>
                </TabPane>
            </Tabs>
        </Spin>
    )

}
export default SurveyCreatorComponent;
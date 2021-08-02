
import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import React, { useEffect, useState, Component } from "react";
import * as SurveyJSCreator from "survey-creator";
import * as Survey from "survey-react"
import { Button, Divider, Typography, Tabs, Modal, Spin, message, notification, Menu, Dropdown, Row, Col, List } from 'antd';
import "survey-creator/survey-creator.css";
import "survey-react/survey.css";
import { deleteMethod, getSurveyForms } from 'lib/api';
import { DATASET } from 'static/constant';
import { ExclamationCircleOutlined, DownOutlined, } from '@ant-design/icons';
import { ArrowLeftOutlined, DeleteTwoTone } from '@ant-design/icons';
const { confirm } = Modal;
const { TabPane } = Tabs;
import nookies from 'nookies';
import SurveyCreator from 'components/customer/surveyComponents/Forms/SurveyCreator';
const Wrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const SurveyWrapper = styled.div`

 width:100%;
 
`;
const SurveyName = styled.p`
    margin-top:15px;
    margin-left:10px;
`;
const SurveyDeleteButton = styled.span`
    font-size:20px;
    font-weight:bold;
    &:hover{
        font-size:22px;
    }
    padding:4px;
`;

const SurveryCreator = ({ collapsed, authenticatedUser, token }) => {
    let surveyCreator;
    const [isSavedSurvey, saveSurvey] = useState(false);
    const [Json, setJson] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [surveyClicked, setSurveyClicked] = useState(false);
    const [surveyList, setSurveyList] = useState([]);
    const [surveyId, setSurveyId] = useState();
    const menu = (
        <Menu >
            <Menu.Item key="1" style={{ padding: "3px 20px" }}><a onClick={() => showConfirm()} >{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );
    const saveMySurvey = async () => {
        setVisible(true);
        console.log('data :', JSON.stringify(surveyCreator.text));
        setJson(surveyCreator.text)
    };

    const onCompleteSurvey = (data) => {
        console.log('data1 : ', data)
    }
    useEffect(() => {
        let options = { showEmbededSurveyTab: false };
        surveyCreator = new SurveyJSCreator.SurveyCreator(
            null,
            options
        );
        surveyCreator.saveSurveyFunc = saveMySurvey;
        surveyCreator.render("surveyCreatorContainer");
    });
    const callback = async (key) => {
        setJson([]);
        if (key === "2") {
            setLoading(true);
            const res = await getSurveyForms({ user: authenticatedUser.id }, token);
            if (res) {
                console.log(res);
                res.map((data) => {
                    data.id = Number(data.id);
                })
                setSurveyList(res);
                setLoading(false);
            }
        }
    }
    const onModalClose = (res) => {
        setVisible(false);

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
        setJson(item.forms);
    }
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <Wrapper>
                <Spin spinning={loading}>
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <TabPane tab={<span>create survey</span>} key="1">
                            <div>
                                <div id="surveyCreatorContainer" />
                            </div>
                            <Modal
                                title="add survey meta data"
                                centered
                                width={700}
                                visible={visible}
                                destroyOnClose={true}
                                footer={null}
                                onCancel={() => setVisible(false)}>
                                <SurveyCreator surveyCreator={Json} user={authenticatedUser.id} onModalClose={onModalClose} />
                            </Modal>
                        </TabPane>
                        <TabPane tab={<span>view survey</span>} key="2">
                            {surveyClicked ?

                                <div>
                                    <Button style={{ marginLeft: -10, marginTop: -30 }} icon={<ArrowLeftOutlined />} onClick={() => {
                                        setSurveyClicked(false);
                                    }} type='link'>back</Button>
                                    <Survey.Survey
                                        json={Json}
                                        showCompletedPage={true}
                                        onComplete={data => onCompleteSurvey(data)}
                                    >
                                    </Survey.Survey>
                                </div> :
                                <div>
                                    <List
                                        pagination={true}
                                        dataSource={surveyList}
                                        renderItem={item => (
                                            <List.Item style={{ margin: "0px 30px" }} actions={[<a onClick={() => showConfirm(item.id)} >delete</a>]}>

                                                <SurveyWrapper >
                                                    <List.Item.Meta
                                                        title={<a onClick={() => displaySurvey(item, true)} >{item.name}</a>}
                                                        description={item.description}
                                                    />
                                                </SurveyWrapper>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            }
                        </TabPane>
                    </Tabs>
                </Spin>
            </Wrapper>
        </Layout>
    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {
            const { token } = nookies.get(ctx);
            return { props: { authenticatedUser: verifyUser, token: token } }
        } catch (error) {
            console.log(error.message);
            return {
                redirect: {
                    destination: '/server-error',
                    permanent: false,
                },
            }
        }
    },
);
export default SurveryCreator;
import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { Statistic, Card, Row, Col, Table, List } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import nookies from 'nookies';
import { getMethod, getMapAnalytics, getMapAnalyticsDataByDate } from 'lib/api';
import { getStrapiMedia } from 'lib/media';
import { formatDate } from 'lib/general-functions';
import { DATASET, COLORS } from '../../static/constant'
import { Line } from 'react-chartjs-2';
import { useState } from 'react';
const MapsWrapper = styled.div`
    padding:10px 12px;
`;
const Cards = styled(Card)`
border: 2px solid #eceeef;
background-color: #f5f5f5;
margin: 10px;
border-radius: 5px;
text-align: center;
`;
const Title = styled.h4`
color: #424242;
text-align: center;
margin: 0px;
`;
const Week = styled.h5`
color: #767676;
text-align: center;
margin: 0px;
`;
const Content = styled.h1`
color: #202020;
    text-align: center;
    padding: 0px;
    margin: 0px;
`;
const State = styled.h5`
color:#909090;
text-align: center;
`;


const MapAnalytics = ({ collapsed, authenticatedUser, mapData, allMaps }) => {
    let totalSigups = 0;
    let totalVisits = 0;
    let submissions = 0;
    let mapList = [];
    let index = 0;
    let fromDate = "";
    // here we assign all maps received from singups in one array as an object no matter if they are duplicate; maybe they are from different users;
    allMaps.map((data) => {
        data.maps.map((m) => {
            if (Number(m.user.id) === authenticatedUser.id) {
                let obj = {};
                obj.created_at = data.created_at;
                obj.id = Number(m.id);
                obj.visits = m.visits;
                obj.title = m.title;
                mapList[index] = obj;
                totalSigups += 1;
                index++;
            }
        })
    })
    mapData.map(data => {
        totalVisits += data.visits;
        submissions += data.mmdpublicusers.length;
    })
    // all the duplicate maps are unified and assigned to another array to be used in chart
    const unifiedMaps = Array.from(new Set(mapList.map(s => s.id))).map(id => {
        return {
            id: id,
            title: mapList.find(s => s.id === id).title,
            signUps: [Number(0), Number(0), Number(0), Number(0), Number(0)]

        }
    });
    // A four week duration is created here
    let today = new Date().toISOString().slice(0, 10)
    let result = new Date(today);
    result.setDate(result.getDate() - 28);
    fromDate = `${result.getFullYear()}-${result.getMonth() + 1}-${result.getDate()}`;
    let labelDateList = [];
    let dateList = [];
    let dateProps = 0;
    for (let i = 0; i <= 4; i++) {
        let dd = new Date(result);
        dd.setDate(dd.getDate() + dateProps);
        labelDateList[i] = `${dd.getMonth() + 1}-${dd.getDate()}`;
        dateList[i] = new Date(dd);
        dateProps += 7;
    }

    // Number of signups are counted based on created date of each public user.
    mapList.map((data) => {
        let myDate = new Date(data.created_at);
        if (myDate >= dateList[0] && myDate < dateList[1]) {
            unifiedMaps.map(dd => {
                if (dd.id === data.id) {
                    dd.signUps[1] = Number(dd.signUps[1]) + 1;
                }
            })

        } else if (myDate >= dateList[1] && myDate < dateList[2]) {
            unifiedMaps.map(dd => {
                if (dd.id === data.id) {
                    dd.signUps[2] = Number(dd.signUps[2]) + 1;
                }
            })

        } else if (myDate >= dateList[2] && myDate < dateList[3]) {
            unifiedMaps.map(dd => {
                if (dd.id === data.id) {
                    dd.signUps[3] = Number(dd.signUps[3]) + 1;
                }
            })
        } else if (myDate >= dateList[3] && myDate <= dateList[4]) {
            unifiedMaps.map(dd => {
                if (dd.id === data.id) {
                    dd.signUps[4] = Number(dd.signUps[4]) + 1;
                }
            })
        }
    })
    // the final value of signups and the map title are assigned to another array to be used for the final use in chart.
    let datasetsValue = [];
    let datasetIndex = 0;
    let colorIndex = 0;
    unifiedMaps.map(map => {
        if (datasetIndex <= COLORS.length) {
            datasetsValue[datasetIndex] = {
                data: map.signUps,
                label: map.title,
                fill: true,
                lineTension: 0,
                // backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: COLORS[colorIndex],
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 1,
                borderJoinStyle: 'miter',
                pointBorderColor: COLORS[colorIndex],
                pointBackgroundColor: '#fff',
                pointBorderWidth: 0.1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: COLORS[colorIndex],
                // pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
            }
        } else {
            colorIndex = 0;
        }
        datasetIndex++;
        colorIndex++;
    })
    const data = {
        labels: labelDateList,
        datasets: datasetsValue
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                }
            },
            hover: {
                mode: 'index',
                intersec: false
            },

        },
    };

    const genericOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            }
        },
        hover: {
            mode: 'index',
            intersec: false
        },
        interaction: {
            intersect: true
        },
        scales: {
            y: {
                min: 100,
                max: 0,
                ticks: {
                    stepSize: 50
                }
            }
        }
    };

    return (
        <Layout collapsed={collapsed} user={authenticatedUser} >
            <MapsWrapper>
                <div>
                    <Row gutter={16}>
                        <Col xs={1} sm={2} md={3} lg={4} xl={5} style={{marginTop:"100px"}}>
                            <Cards>
                                <Title >SIGNUPS</Title>
                                <Week>from : {fromDate}</Week>
                                <Content >{totalSigups}</Content>
                            </Cards>


                            <Cards>
                                <Title >TOTAL USERS</Title>
                                <Week>Date</Week>
                                <Content >12</Content>
                                <State >State</State>
                            </Cards>

{/* 
                            <Cards>
                                <Title >SIGNUPS</Title>
                                <Week>Date</Week>
                                <Content >12</Content>
                                <State >State</State>
                            </Cards> */}


                            <Cards>
                                <Title >VISITS</Title>
                                {/* <Week>Date</Week> */}
                                <Content >{totalVisits}</Content>
                                {/* <State >State</State> */}
                            </Cards>


                            <Cards>
                                <Title >SUBMISSIONS</Title>
                                <Content >{submissions}</Content>
                                {/* <State >State</State> */}
                            </Cards>

                        </Col>

                        <Col xs={6} sm={8} md={12} lg={16} xl={19}>
                            <div style={{ textAlign: "center" }}>
                                <h2 style={{ fontWeight: "bold" }}>User Signups(Past 4 weeks)</h2>
                            </div>
                            <Line
                                data={data}
                                width={750}
                                height={600}
                                options={genericOptions}

                            />
                        </Col>
                    </Row>
                </div>
            </MapsWrapper>
        </Layout>

    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {
            const { token } = nookies.get(ctx);
            const { id } = ctx.query;
            let mapData = null;
            let today = new Date().toISOString().slice(0, 10)
            let result = new Date(today);
            result.setDate(result.getDate() - 28);
            let timestamp = Date.parse(result);
            timestamp = timestamp / 1000;
            const res = await getMapAnalyticsDataByDate(timestamp, token)

            mapData = await getMapAnalytics({ user: verifyUser.id }, token);
            mapData.map((data) => {
                data.created_at = formatDate(data.created_at);
                data.updated_at = formatDate(data.updated_at);
            })
            return {
                props: {
                    authenticatedUser: verifyUser,
                    mapData: mapData,
                    allMaps: res

                }
            }
        } catch (error) {
            console.log(error.message);
            return {
                redirect: {
                    destination: '/errors/500',
                    permanent: false,
                },
            }

        }
    },
);
export default MapAnalytics;
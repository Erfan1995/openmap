import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { Statistic, Card, Row, Col, Table, List } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import nookies from 'nookies';
import { getMethod, getMapAnalytics } from 'lib/api';
import { getStrapiMedia } from 'lib/media';
import { formatDate } from 'lib/general-functions';
import { DATASET } from '../../static/constant'
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


const MapAnalytics = ({ collapsed, authenticatedUser, mapData }) => {
    const [oneMonthDate, setOneMonthDate] = useState();

    const data = {
        labels: ['First Week', 'Second Week', 'Third Week', 'Fourth Week'],
        datasets: [
            {
                label: 'My First dataset',
                fill: true,
                lineTension: 0,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 1,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 0.1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: [0, 20, 20, 60]
            },
            {
                label: 'My Second dataset',
                fill: false,
                lineTension: 0,
                backgroundColor: 'rgba(20,17,91,20)',
                borderColor: 'rgba(20,17,91,20)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(20,17,91,20)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 0.1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(20,17,91,20)',
                pointHoverBorderColor: 'rgba(20,17,91,20)',
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: [0, 30, 30, 30]
            }
        ]
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
                    // forces step size to be 50 units
                    stepSize: 50
                }
            }
        }
    };

    return (
        <Layout collapsed={collapsed} user={authenticatedUser} >
            <MapsWrapper>
                {/* <div className="site-statistic-demo-card">

                    <Row gutter={16}>
                        <Col span={6}>
                            <CardWrapper>
                                <Statistic

                                    title="Map Name"
                                    value={mapData[0].title}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </CardWrapper>
                        </Col>
                        <Col span={12}>
                            <CardWrapper>
                                <Statistic

                                    title="Map Description"
                                    value={mapData[0].description}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </CardWrapper>
                        </Col>
                        <Col span={6}>
                            <CardImage>
                                <MapImage

                                    title="Map Logo"
                                    src={getStrapiMedia(mapData[0].logo)}

                                />
                            </CardImage>
                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <CardWrapper>
                                <Statistic
                                    title="Map Visits"
                                    value={mapData[0].visits}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<ArrowUpOutlined />}
                                />
                            </CardWrapper>
                        </Col>
                        <Col span={6}>
                            <CardWrapper>
                                <Statistic
                                    title="Map Submissions"
                                    value={mapData[0].mmdpublicusers.length}
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<ArrowUpOutlined />}
                                />
                            </CardWrapper>
                        </Col>
                        <Col span={6}>
                            <CardWrapper>
                                <Statistic
                                    title="Created Date"
                                    value={mapData[0].created_at}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </CardWrapper>
                        </Col>
                        <Col span={6}>
                            <CardWrapper>
                                <Statistic
                                    title="Modified Date"
                                    value={mapData[0].updated_at}
                                    precision={2}
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </CardWrapper>
                        </Col>
                    </Row>
                </div> */}
                <div>
                    <Row gutter={16}>
                        <Col xs={1} sm={2} md={3} lg={4} xl={5}>
                            <Cards>
                                <Title >SIGNUPS</Title>
                                <Week>Date</Week>
                                <Content >12</Content>
                                <State >State</State>
                            </Cards>


                            <Cards>
                                <Title >SIGNUPS</Title>
                                <Week>Date</Week>
                                <Content >12</Content>
                                <State >State</State>
                            </Cards>


                            <Cards>
                                <Title >SIGNUPS</Title>
                                <Week>Date</Week>
                                <Content >12</Content>
                                <State >State</State>
                            </Cards>


                            <Cards>
                                <Title >SIGNUPS</Title>
                                <Week>Date</Week>
                                <Content >12</Content>
                                <State >State</State>
                            </Cards>


                            <Cards>
                                <Title >SIGNUPS</Title>
                                <Week>Date</Week>
                                <Content >12</Content>
                                <State >State</State>
                            </Cards>

                        </Col>

                        <Col xs={6} sm={8} md={12} lg={16} xl={19}>
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
            if (id) {
                mapData = await getMapAnalytics({ id: id }, token);
                mapData.map((data) => {
                    data.created_at = formatDate(data.created_at);
                    data.updated_at = formatDate(data.updated_at);
                })
            }
            return {
                props: {
                    authenticatedUser: verifyUser,
                    mapData: mapData
                }
            }
        } catch (error) {
            return {
                redirect: {
                    destination: '/server-error',
                    permanent: false,
                },
            }

        }
    },
);
export default MapAnalytics;
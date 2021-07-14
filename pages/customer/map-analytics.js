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
const MapsWrapper = styled.div`
background:#ffffff;
height:100%;
padding:40px 40px;
margin:10px;
`;
const CardWrapper = styled(Card)`
padding-left:50px;
padding-top:30px;
padding-bottom:30px;
margin:10px;
`
const MapImage = styled.img`
    height:120px;
`;
const CardImage = styled(Card)`
padding-left:30px;
margin:10px;
`;
const MapAnalytics = ({ collapsed, authenticatedUser, mapData }) => {
    return (
        <Layout collapsed={collapsed} user={authenticatedUser} >
            <MapsWrapper>
                <div className="site-statistic-demo-card">

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
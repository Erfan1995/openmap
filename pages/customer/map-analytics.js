import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';
import nookies from 'nookies';
import { getMethod, getMapAnalytics } from 'lib/api';
import { formatDate } from 'lib/general-functions';
import { DATASET } from '../../static/constant'
const MapsWrapper = styled.div`
background:#ffffff;
height:100%;
padding:10px 20px;
margin:10px;
`;
const MapAnalytics = ({ collapsed, authenticatedUser, mapData }) => {
    const columns = [

        {
            title: DATASET.NAME,
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: DATASET.CREATED_DATE,
            dataIndex: 'created_at',
            key: 'created_at'

        },
        {
            title: DATASET.DATE,
            dataIndex: "updated_at",
            key: 'updated_at'
        },
        {
            title: DATASET.VISITS,
            dataIndex: 'visits',
            key: 'visits'
        },
        {
            title: DATASET.SUBMISSIONS,
            dataIndex: 'submissions',
            key: 'submissions'
        },
    ]
    return (
        <Layout collapsed={collapsed} user={authenticatedUser} >
            <MapsWrapper>
                <Table dataSource={mapData} columns={columns} />
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
                console.log(mapData);
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
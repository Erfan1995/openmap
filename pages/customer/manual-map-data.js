import Layout from '../../components/customer/layout/Layout';
import { Divider, Typography, Tabs } from 'antd';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
const { Title } = Typography;
const { TabPane } = Tabs;
import { getMethod } from "../../lib/api";
import nookies from 'nookies';
import styled from 'styled-components';
import { formatDate } from "../../lib/general-functions";
import { DATASET } from '../../static/constant'
import CustomerManualMapData from 'components/customer/mapComponents/CustomerManualMapData';
import PublicUserManualMapData from 'components/customer/mapComponents/PublicUserManualMapData';
import { useEffect, useState } from 'react';
const MapsWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;

const ManualMapData = ({ authenticatedUser, collapsed ,customerData}) => {
    const [manualMapData, setManualMapData] = useState();
    const [mapsDataTofilter, setMapsDataToFilter] = useState();


    useEffect(()=>{

      callback('1');


    },[]);

    const createMapFilterData = (mMapData) => {
        let arr = [];
        let finalMapsDataToFilter = [];
        mMapData.map((m) => {
            arr.push(m.map);
        })
        let uniqueMaps = [...new Map(arr.map(item => [item['title'], item])).values()]
        uniqueMaps.map((mapData) => {
            finalMapsDataToFilter.push({ "text": mapData.title, "value": mapData.title })
        })
        setMapsDataToFilter(finalMapsDataToFilter);
    }
    const callback = async (key) => {
        let res;
        if (key === "1") {
            res = await getMethod(`mmdcustomers?users=${authenticatedUser.id}`)

        } else if (key === "2") {
            res = await getMethod(`mmdpublicusers?_where[0][map.users]=${authenticatedUser.id}`)
        }
        if (res) {
            res.forEach(element => {
                element.key = element.id;
                element.updated_at = formatDate(element.updated_at);
                if (element.is_approved === true) {
                    element.is_approved = "yes"
                } else {
                    element.is_approved = "no"
                }
                element.maps = element.map.title

            });
            setManualMapData(res);
            createMapFilterData(res);
        }
    }
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <MapsWrapper  >
                <CardTitle level={4}>{DATASET.DATASETS}</CardTitle>
                <Divider />
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Customer " key="1">
                        <CustomerManualMapData data={manualMapData} mapFilterData={mapsDataTofilter} />
                    </TabPane>
                    <TabPane tab="Public User" key="2">
                        <PublicUserManualMapData data={manualMapData} mapFilterData={mapsDataTofilter} />
                    </TabPane>
                </Tabs>
            </MapsWrapper>
        </Layout>
    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {
            const { token } = nookies.get(ctx);
         
            return { props: { authenticatedUser: verifyUser} }
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
export default ManualMapData;
import { Divider, Typography, Tabs, Spin, Dropdown, Menu } from 'antd';
import withPrivateServerSideProps from 'utils/withPrivateServerSideProps';
const { Title } = Typography;
const { TabPane } = Tabs;
import { getMethod, getMMDCustomers } from 'lib/api';
import nookies from 'nookies';
import styled from 'styled-components';
import { formatDate } from 'lib/general-functions';
import { DATASET } from 'static/constant';
import CustomerManualMapData from './CustomerManualMapData';
import PublicUserManualMapData from './PublicUserManualMapData';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeftOutlined, DownOutlined } from '@ant-design/icons';

const MapsWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;


const ManualMapDataDialog = ({ authenticatedUser, token, row, formElementsName }) => {
    const [manualMapData, setManualMapData] = useState();
    const [mapsDataTofilter, setMapsDataToFilter] = useState();
    const [loading, setLoading] = useState(false);
    const [surveyFormElement, setSurveyFormElement] = useState(formElementsName);
    // const [selectedRow, setSelectedRow] = useState();
    let selectedRow;
    const childRef = useRef();

    const menu = (
        <Menu >
            <Menu.Item key="0"><a onClick={() => childRef.current.showChangeStateConfirm(selectedRow)} >
                {DATASET.CHANGE_STATE}</a></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1"><a onClick={() => childRef.current.showConfirm(selectedRow)}>{DATASET.DELETE}</a></Menu.Item>
        </Menu>
    );
    useEffect(() => {
        callback('1');
    }, []);

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
        let columns = [
            {
                title: DATASET.APPROVED,
                dataIndex: 'is_approved',
                key: 'is_approved',
                filters: [
                    { text: 'Approved', value: 'yes' },
                    { text: 'Unapproved', value: 'no' },
                ],
                onFilter: (value, record) => record.is_approved.includes(value),
            },
            {
                title: "maps",
                dataIndex: 'maps',
                key: 'maps',
                filters: finalMapsDataToFilter,
                onFilter: (value, record) => record.maps.includes(value),
            },
            {
                title: DATASET.ACTIONS,
                key: 'action',
                render: (record) => (
                    <Dropdown size="big" overlay={menu} trigger={['click']} >
                        <a className="ant-dropdown-link"
                            onClick={(e) => {
                                selectedRow = record;
                            }} >
                            {DATASET.MORE_ACTIONs} <DownOutlined />
                        </a>
                    </Dropdown>
                ),
            }
        ];
        let mmData = formElementsName.concat(columns);
        setSurveyFormElement(mmData);
    }
    const callback = async (key) => {
        setManualMapData([]);
        let res;
        setLoading(true);
        if (key === "1") {
            res = await getMMDCustomers({ user: authenticatedUser.id, survey: row.id }, token);
        } else if (key === "2") {
            res = await getMethod(`mmdpublicusers?_where[0][map.user]=${authenticatedUser.id}&survey=${row.id}`);
            if (res) {
                res.map((map) => {
                    map.publicAddress = map.public_user.publicAddress
                })
            }
        }
        setLoading(false);
        if (res) {
            res.forEach(element => {
                element.properties.key = element.id;
                element.properties.id = Number(element.id);
                element.properties.updated_at = formatDate(element.updated_at);
                if (element.is_approved === true) {
                    element.properties.is_approved = "yes"
                } else {
                    element.properties.is_approved = "no"
                }
                element.properties.maps = element.map.title

            });
            let arr = [];
            res.map(dd => {
                arr.push(dd.properties);
            })
            setManualMapData(arr);
            createMapFilterData(res);
        }
    }
    return (
        <MapsWrapper >
            <CardTitle level={4}>{DATASET.MANUAL_MAP_DATA}</CardTitle>
            <Divider />
            <Tabs defaultActiveKey="1" onChange={callback} >
                <TabPane tab="Customer " key="1">
                    <Spin spinning={loading}>
                        <CustomerManualMapData data={manualMapData} mapFilterData={mapsDataTofilter}
                            formElementsName={surveyFormElement} ref={childRef} />
                    </Spin>
                </TabPane>
                <TabPane tab="Public User" key="2">
                    <Spin spinning={loading}>
                        <PublicUserManualMapData data={manualMapData} mapFilterData={mapsDataTofilter}
                            formElementsName={surveyFormElement} ref={childRef} />
                    </Spin>
                </TabPane>
            </Tabs>
        </MapsWrapper>
    )
}
export default ManualMapDataDialog;
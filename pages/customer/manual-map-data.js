import Layout from '../../components/customer/layout/Layout';
import { Divider, Typography, Tabs, Spin, Menu, Modal, Button, Table, Dropdown, message } from 'antd';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
const { Title } = Typography;
import { getSurveyForms, getMMDCustomers, getMethod } from "../../lib/api";
import nookies from 'nookies';
import styled from 'styled-components';
import { formatDate } from "../../lib/general-functions";
import { DATASET } from '../../static/constant'
import { useEffect, useState } from 'react';
import { DownOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import CustomerManualMapData from 'components/customer/mapComponents/CustomerManualMapData';
import PublicUserManualMapData from 'components/customer/mapComponents/PublicUserManualMapData';
import jsPDF from 'jspdf';
import 'jspdf-autotable'

const MapsWrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;

const ManualMapData = ({ authenticatedUser, collapsed, token, surveyForms }) => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [row, setRow] = useState();
    const [formElementsName, setFormElementsName] = useState([]);
    const [manualMapData, setManualMapData] = useState();
    const [mapsDataTofilter, setMapsDataToFilter] = useState();
    const [mapDataClicked, setMapDataClicked] = useState(false);
    const [printData, setPrintData] = useState([]);
    console.log(surveyForms)
    surveyForms.map(data => {
        data.title = data.forms.title;
        data.description = data.forms.description;
        data.id = Number(data.id);

    })
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
    const showManualMapDataDetails = () => {
        let arr = [];
        let surveyFormElements = row.forms;
        surveyFormElements.pages.map((data) => {
            data.elements.map((element) => {
                arr.push({ 'title': element.name, 'dataIndex': element.name, 'key': element.name })
            })
        })
        setFormElementsName(arr);
        setModalVisible(true);
    }
    const getCustomerAndPublicUserData = async (type) => {
        showManualMapDataDetails();
        setManualMapData([]);
        let res;
        setLoading(true);
        if (type === "customer") {
            res = await getMMDCustomers({ user: authenticatedUser.id, survey: row.id }, token);
            setMapDataClicked(true)
        } else {
            res = await getMethod(`mmdpublicusers?_where[0][map.user]=${authenticatedUser.id}&survey=${row.id}`);
            if (res) {
                res.map((map) => {
                    map.publicAddress = map?.public_user?.publicAddress
                })
            }
            setMapDataClicked(false);
        }
        setLoading(false);
        if (res) {
            res.forEach(element => {
                element.properties.key = element?.id;
                element.properties.id = Number(element?.id);
                element.properties.updated_at = formatDate(element?.updated_at);
                if (element.is_approved === true) {
                    element.properties.is_approved = "yes"
                } else {
                    element.properties.is_approved = "no"
                }
                element.properties.maps = element?.map?.title
                element.properties.publicAddress = element?.publicAddress;

            });
            let arr = [];
            res.map(dd => {
                arr.push(dd.properties);
            })
            setManualMapData(arr);
            createMapFilterData(res);
            setPrintData(arr);
        }
    }

    const menu = (
        <Menu >
            <Menu.Item key="0"><a onClick={() => getCustomerAndPublicUserData("customer")}>{DATASET.CUSTOMERS}</a></Menu.Item>

            <Menu.Item key="1"><a onClick={() => getCustomerAndPublicUserData("public")}>{DATASET.PUBLIC_USERS}</a></Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: DATASET.ID,
            dataIndex: 'id',
            key: 'id',

        },
        {
            title: DATASET.NAME,
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: DATASET.DESCRIPTION,
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: DATASET.MAPS,
            dataIndex: 'maps',
            key: 'maps',
        },
        {
            title: DATASET.DATE,
            dataIndex: 'updated_at',
            key: 'updated_at'

        },
        {
            title: DATASET.ACTIONS,
            key: 'action',
            render: (record) => (
                <Dropdown size="big" overlay={menu} trigger={['click']} >
                    <a className="ant-dropdown-link"
                        onClick={(e) => {
                            setRow(record);
                        }} >
                        {DATASET.MORE_ACTIONs} <DownOutlined />
                    </a>
                </Dropdown>
            ),
        },
    ];


    {
        var printColumn = mapDataClicked ? [
            {
                title: DATASET.APPROVED,
                dataIndex: 'is_approved',
                key: 'is_approved',
            },
            {
                title: "maps",
                dataIndex: 'maps',
                key: 'maps',
            },
        ] : [
            {
                title: DATASET.PUBLIC_USERS,
                dataIndex: 'publicAddress',
                key: 'publicAddress',
            },
            {
                title: DATASET.APPROVED,
                dataIndex: 'is_approved',
                key: 'is_approved',
            },
            {
                title: "maps",
                dataIndex: 'maps',
                key: 'maps',
            },

        ]
    }


    const exportToPDF = () => {
        var colItems = {};
        formElementsName.concat(printColumn).map((data) => {
            colItems[data.dataIndex] = data.title;
        });

        if (printData != null && printData.length > 0) {
            const doc = jsPDF();
            doc.autoTable({
                head: [colItems],
                body: printData
            });
            doc.save('table.pdf')
        }
        else {
            message.info('Form is Empty');
        }

    }


    const onFilterChange = (data) => {
        setPrintData(data['currentDataSource'])
    }


    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <MapsWrapper  >
                <Spin spinning={loading}>
                    <Table dataSource={surveyForms} columns={columns} scroll={{ x: 1300 }} />
                </Spin>
                <Modal
                    centered
                    width={1500}
                    visible={modalVisible}
                    destroyOnClose={true}
                    onCancel={() => {
                        setModalVisible(false)
                    }}
                    footer={[
                        <Button key="download" onClick={exportToPDF}>{DATASET.DOWNLOAD}</Button>,
                        <Button key="close" onClick={() => { setModalVisible(false) }}> {DATASET.CLOSE}</Button>
                    ]}
                >
                    {mapDataClicked ? <CustomerManualMapData authenticatedUser={authenticatedUser} token={token} row={row}
                        formElementsName={formElementsName} data={manualMapData} mapFilterData={mapsDataTofilter} setMapsDataToFilter={onFilterChange} /> :
                        <PublicUserManualMapData authenticatedUser={authenticatedUser} token={token} row={row}
                            formElementsName={formElementsName} data={manualMapData} mapFilterData={mapsDataTofilter} setMapsDataToFilter={onFilterChange} />}
                </Modal>
            </MapsWrapper>
        </Layout>
    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {
            const { token } = nookies.get(ctx);
            const surveyForms = await getSurveyForms({ user: verifyUser.id }, token);
            if (surveyForms) {
                surveyForms.map(data => {
                    data.id = Number(data.id);
                    data.key = data.id;
                    data.maps = data.maps.length;
                    data.updated_at = formatDate(data.updated_at);

                })
            }
            return { props: { authenticatedUser: verifyUser, token: token, surveyForms: surveyForms } }
        } catch (error) {
            return {
                redirect: {
                    destination: '/errors/500',
                    permanent: false,
                },
            }
        }
    },
);
export default ManualMapData;
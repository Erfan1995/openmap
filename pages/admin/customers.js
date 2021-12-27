import Layout from '../../components/customer/layout/Layout';
import styled from 'styled-components';
import CustomerTable from 'components/admin/CustomerTable';
import { Button, Divider, Typography, Tabs, Modal, Spin, message, notification } from 'antd';
import { CUSTOMERS } from '../../static/constant'
import CreateCustomers from 'components/admin/CreateCustomers';
import { useEffect, useState } from 'react';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import nookies from 'nookies';
import { getCustomers, getMethod } from "../../lib/api";
import { formatDate, fileSizeReadable } from "../../lib/general-functions";

const { Title } = Typography;

const Wrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const AddNew = styled(Button)`
  margin-bottom: 10px;
  float: right !important;
`;
const CardTitle = styled(Title)`
  margin-bottom: 10px;
  float: left !important;
`;

const Customers = ({ authenticatedUser, collapsed, serverSideCustomers }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customers, setCutomers] = useState(serverSideCustomers)
    const onModalClose = (res) => {
        setVisible(false);
        res.user.updated_at = formatDate(res.user.updated_at);
        setCutomers([...customers, res.user]);
    }
    const updatedData = (data) => {
        setCutomers(data);
    }
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <Wrapper>
                <CardTitle level={4}>{CUSTOMERS.CUSTOMERS}</CardTitle>
                <AddNew type='primary' onClick={() => setVisible(true)}>{CUSTOMERS.ADD_NEW}</AddNew>
                <Divider />
                <CustomerTable customers={customers} updatedData={updatedData} />
                <Modal
                    title={CUSTOMERS.ADD_NEW_CUSTOMERS}
                    centered
                    visible={visible}
                    destroyOnClose={true}
                    okButtonProps={{ style: { display: 'none' } }}
                    onCancel={() => setVisible(false)}>
                    <Spin spinning={loading}>
                        <CreateCustomers user={authenticatedUser.id} onModalClose={onModalClose} />
                    </Spin>
                </Modal>
            </Wrapper>
        </Layout>
    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {
            const { token } = nookies.get(ctx);
            const customers = await getCustomers({ customer_creater: verifyUser.id }, token);
            customers.map((map) => {
                map.updated_at = formatDate(map.updated_at);
                map.id = Number(map.id);
            })
            return { props: { authenticatedUser: verifyUser, serverSideCustomers: customers } }
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
export default Customers

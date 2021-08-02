import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
const Wrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const SurveryAnalytics = ({ collapsed, authenticatedUser }) => {
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <Wrapper>survey analytics</Wrapper>
        </Layout>
    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {
            return { props: { authenticatedUser: verifyUser } }
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
export default SurveryAnalytics;
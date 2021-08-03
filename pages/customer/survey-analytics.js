import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import nookies from 'nookies';
const Wrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const SurveryAnalytics = ({ collapsed, authenticatedUser, token }) => {
    const SurveyAnalyticsComponent = dynamic(() => import('components/customer/surveyCompenents/SurveyAnalyticsComponent'), {
        ssr: false
    })
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <Wrapper>
                <SurveyAnalyticsComponent />
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
export default SurveryAnalytics;
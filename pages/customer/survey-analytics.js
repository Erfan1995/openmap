import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import nookies from 'nookies';
import { getSurveyForms } from 'lib/api';
const Wrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const SurveryAnalytics = ({ collapsed, authenticatedUser, token, surveyForms }) => {
    const SurveyAnalyticsComponent = dynamic(() => import('components/customer/surveyCompenents/SurveyAnalyticsComponent'), {
        ssr: false
    })
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <Wrapper>
                <SurveyAnalyticsComponent user={authenticatedUser}
                    surveyForms={surveyForms} token={token} />
            </Wrapper>
        </Layout>
    )
}
export const getServerSideProps = withPrivateServerSideProps(
    async (ctx, verifyUser) => {
        try {
            const { token } = nookies.get(ctx);
            const surveyForms = await getSurveyForms({ user: verifyUser.id }, token);
            return { props: { authenticatedUser: verifyUser, token: token, surveyForms: surveyForms } }
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
export default SurveryAnalytics;
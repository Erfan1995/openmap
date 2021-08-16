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
const SurveyReports = ({ collapsed, authenticatedUser, token, surveyForms }) => {
    const SurveyReportComponent = dynamic(() => import('components/customer/surveyCompenents/SurveyReportComponent'), {
        ssr: false
    })
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <Wrapper>
                <SurveyReportComponent user={authenticatedUser} surveyForms={surveyForms} token={token} />
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
            return {
                redirect: {
                    destination: '/errors/500',
                    permanent: false,
                },
            }
        }
    },
);
export default SurveyReports;
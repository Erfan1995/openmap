import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import nookies from 'nookies';
import { getSurveyForms } from 'lib/api';
const Wrapper = styled.div`
background:#ffffff;
padding:20px;
margin:10px;
`;
const SurveryCreator = ({ collapsed, authenticatedUser, token, surveyForms }) => {
    const SurveyCreatorComponent = dynamic(() => import('components/customer/surveyCompenents/SurveyCreatorComponent'), {
        ssr: false
    })
    return (
        <Layout collapsed={collapsed} user={authenticatedUser}>
            <Wrapper>
                <SurveyCreatorComponent authenticatedUser={authenticatedUser} token={token} surveyForms={surveyForms} />
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
                    destination: '/server-error',
                    permanent: false,
                },
            }
        }
    },
);
export default SurveryCreator;
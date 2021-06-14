import Layout from '../../components/customer/layout/Layout';
import withPrivateServerSideProps from '../../utils/withPrivateServerSideProps';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
 

const Dashboard = ({ authenticatedUser, collapsed }) => {
  const router = useRouter();

  useEffect(async() => {
 
  }, [])
  return (
    <Layout collapsed={collapsed} user={authenticatedUser}>
      
       </Layout>
  )
}
export const getServerSideProps = withPrivateServerSideProps(
  async (ctx, verifyUser) => {
    try {
   
      return { props: { authenticatedUser: verifyUser } }
    } catch (error) {
      return { props: {} };
    }
  },
);
export default Dashboard;
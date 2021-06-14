import isAuthenticated from "./isAuthenticated";
export default function withPrivateServerSideProps(getServerSidePropsFunc) {
  const withPrivateSSP = async (ctx) => {
    const _isAuthenticated = await isAuthenticated(ctx);
    if (!_isAuthenticated) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }
    if (getServerSidePropsFunc) {
      return await getServerSidePropsFunc(ctx,_isAuthenticated);
    }
    return { props: {}};
  };
  return withPrivateSSP;
}
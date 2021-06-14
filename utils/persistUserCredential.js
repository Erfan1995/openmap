import nookies from "nookies";
 const persistUserCredential = async (token) => {
  nookies.set('','token', token, {
    maxAge: 2 * 24 * 60 * 60,
    path: '/',
  });
}
export default persistUserCredential
import GlobalStyle from '../styles/globalStyles';
import "antd/dist/antd.css";
import "../styles/vars.css";
import "../styles/globals.css";
import 'prismjs/themes/prism-dark.css';

// import 'bootstrap/dist/css/bootstrap.css';
import Head from "next/head"
import NProgress from "nprogress"
import Router from "next/router"
Router.onRouteChangeStart = url => {
  NProgress.start()
}
NProgress.configure({ showSpinner: true });
Router.onRouteChangeComplete = () => NProgress.done()

Router.onRouteChangeError = () => NProgress.done()

function MyApp({ Component, pageProps }) {

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
        />
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />

    </div>

  );
}

export default MyApp;

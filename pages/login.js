import { Col, Layout, Row, Typography } from "antd";
import LoginForm from "components/Forms/Login";
import Image from "next/image";
import styles from "styles/login.module.css";
import { DATASET } from '../static/constant'

const { Content } = Layout;
const { Title } = Typography;

function Login() {
  return (
    <Row className={styles.login}>
      <Col
        xs={24}
        sm={24}
        md={10}
        lg={10}
        xl={10}
        className={styles.formContainer}
      >
        <Image
          src="/logo.png"
          alt="Picture of the author"
          width={200}
          className={styles.logo}
          height={50}
        />
        <LoginForm />
      </Col>
      <Col
        xs={24}
        sm={24}
        md={14}
        lg={14}
        xl={14}
        className={styles.imageContainer}
      >
        <Title level={2} className={styles.white}>
          {DATASET.SIGN_IN_TO_VIEW_DASHBOARD}
        </Title>
      </Col>
    </Row>
  );
}

export default Login;

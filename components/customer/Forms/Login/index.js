import { Form, Input, Button, Checkbox, Row, message } from "antd";
import Link from "next/link";

import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const onFinish = (values) => {
    message.success("Success:");
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Failed:");
  };

  return (
    <Form
      className={styles.loginForm}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input size={"large"} />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password size={"large"} />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Submit
      </Button>
      <Row justify="center">
        <Link href="/login">Forget password</Link>
      </Row>
    </Form>
  );
};

export default LoginForm;

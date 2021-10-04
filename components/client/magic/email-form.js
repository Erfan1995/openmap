import { useState } from 'react';
import { Button, Col, Input, Row } from 'antd';
import { MailFilled } from '@ant-design/icons';

const EmailForm = ({ onEmailSubmit, disabled }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onEmailSubmit(email);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Row gutter={[15,15]} className="margin-top-10">
          <Col span={16} >
            <Input
              placeholder='Enter your email'
              size='large'
              type='email'

              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
          <Col span={8}>
            <Button
              icon={<MailFilled />}
              type='primary'
              size='large'
              disabled={disabled}
              onClick={handleSubmit}
            >
              Send Link
            </Button>
          </Col>
        </Row>
      </form>

    </>
  );
};

export default EmailForm;

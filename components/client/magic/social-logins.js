import { GoogleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';

const SocialLogins = ({ onSubmit }) => {
  const providers = ['google', 'facebook'];
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <>
      <h2 className='margin-top-10'>Or login with</h2>
      {providers.map((provider) => {
        return (
          <div key={provider}>
            <Button
              className='margin-top-10'
              style={{width:'100%'}}
              size='large'
              onClick={() => {
                setIsRedirecting(true);
                onSubmit(provider);
              }}
              key={provider}
              type={'default'}
              icon={<GoogleOutlined />}
            >
              {/* turns "google" to "Google" */}
              {provider.replace(/^\w/, (c) => c.toUpperCase())}
            </Button>
          </div>
        );
      })}
      {isRedirecting && <div className='redirecting'>Redirecting...</div>}

    </>
  );
};

export default SocialLogins;

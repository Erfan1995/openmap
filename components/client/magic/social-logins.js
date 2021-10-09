import { Button } from 'antd';
import { useState } from 'react';
import styled from "styled-components";

export const NextButton = styled(Button)`
  margin-top: 20px;
  padding: 30px;
  width: 100%;
  text-align: center;
  border-radius: 20px;
  outline: none;
  border: 1px solid transparent;
  text-decoration: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  flex-wrap: nowrap;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.44);
  color: rgb(10, 10, 10);
  box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px,
    rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
  font-size: 18px;
  font-weight: 500;

`;
const SocialLogins = ({ onSubmit }) => {
  const providers = ['google', 'facebook'];
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <>
      <h2 className='margin-top-10'>Or login with</h2>
      {providers.map((provider) => {
        return (
          <div key={provider}>
            <NextButton
              className='margin-top-10'
              style={{ width: '100%' }}
              size='large'
              onClick={() => {
                setIsRedirecting(true);
                onSubmit(provider);
              }}
              key={provider}
              type={'default'}
              icon={<img src={`${provider}.png`} className='margin-right-10' />}
            >
              {/* turns "google" to "Google" */}
              {provider.replace(/^\w/, (c) => c.toUpperCase())}
            </NextButton>
          </div>
        );
      })}
      {isRedirecting && <div className='redirecting'>Redirecting...</div>}

    </>
  );
};

export default SocialLogins;

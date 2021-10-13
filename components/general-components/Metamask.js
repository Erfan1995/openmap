import { message, Button } from "antd";
import Web3 from "web3";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { MAP } from 'static/constant';
import { magic } from '../../lib/magic';
import { UserContext } from '../../lib/UserContext';

import EmailForm from "components/client/magic/email-form";
import SocialLogins from "components/client/magic/social-logins";
import { publicUserOperation } from "lib/general-functions";
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
let web3 = undefined;
const Metamask = ({ mapDetails }) => {
    const [disabled, setDisabled] = useState(false);
    const [user, setUser] = useContext(UserContext);

    // Redirec to /map if the user is logged in
    useEffect(() => {
        if (user?.issuer) {
            publicUserOperation(user.publicAddress, mapDetails);
            localStorage.setItem('magicUser', JSON.stringify(user));
        }
    }, [user]);

    const handleLoginWithEmail = async (email) => {
        try {
            setDisabled(true); // disable login button to prevent multiple emails from being triggered
            // Trigger Magic link to be sent to user
            let didToken = await magic.auth.loginWithMagicLink({
                email,
                redirectURI: new URL('/client/callback', window.location.origin).href, // optional redirect back to your app after magic link is clicked
            });
            // Validate didToken with server
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + didToken,
                },
            });

            if (res.status === 200) {
                // Set the UserContext to the now logged in user
                let userMetadata = await magic.user.getMetadata();
                await setUser(userMetadata);
                publicUserOperation(userMetadata.publicAddress, mapDetails);
            }
        } catch (error) {
            setDisabled(false); // re-enable login button - user may have requested to edit their email
        }
    }

    async function handleLoginWithSocial(provider) {
        await magic.oauth.loginWithRedirect({
            provider, // google, apple, etc
            redirectURI: new URL('/client/callback', window.location.origin).href, // required redirect to finish social login
        });
    }


    const handleSignup = async (publicAddress) => {
        const data = { publicAddress: publicAddress, maps: mapDetails.id };
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/public-users`, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then((response) => response.json());
    }

    const handleClick = async () => {
        try {
            if (ethereum) {
                await ethereum.enable();
                if (!web3) {
                    web3 = new Web3(ethereum);
                }
                const coinbase = await web3.eth.getCoinbase();
                if (!coinbase) {
                    message.info(MAP.ACTIVATE_MASK);
                    return;
                }
                const publicAddress = coinbase.toLowerCase();
                publicUserOperation(publicAddress, mapDetails);
            }

        } catch (e) {
            message.error(e.message);
            return;
        }


    };




    const renderAuthTypes = (type) => {
        switch (type) {
            case 'Email Login': return <EmailForm key={type} disabled={disabled} onEmailSubmit={handleLoginWithEmail} />;
            case 'Social Login': return <SocialLogins key={type} onSubmit={handleLoginWithSocial} />;
            case 'Blockchain Login': return <NextButton  key={type} onClick={handleClick} icon={<img src='metamask.png' className='margin-right-10' />}>
                Connect To Metamask
            </NextButton>;


        }
    }




    return (
        <div>
            {
                mapDetails?.auth_types?.map((item) => {
                    if (item.state) {
                        return renderAuthTypes(item.label);
                    }
                })
            }
        </div>
    )


}

export default Metamask;
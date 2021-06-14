import { message, Button } from "antd";
import Web3 from "web3";
import styled from "styled-components";
import { Router, useRouter } from "next/router";
import UseAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { MAP, Map } from 'static/constant';
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
const Metamask = ({mapDetails}) => {
    const router = useRouter();

    const handleSignup = async (publicAddress) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/public-users`, {
            body: JSON.stringify({ publicAddress }),
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
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/public-users?publicAddress=${publicAddress}`
                )
                    .then((response) => response.json())
                    // If yes, retrieve it. If no, create it.
                    .then((users) =>
                        users.length ? users[0] : handleSignup(publicAddress)
                    )
                    .catch((err) => {
                        message.info(err.message);
                    });

                if (res) {
                    router.push({
                        pathname: 'client/map',
                        query: { mapToken: mapDetails.mapId,id:mapDetails.id }
                    });
                }
            }

        } catch (e) {
            message.info(e.message);
            return;
        }


    };



    return (
        <div>
            <NextButton onClick={handleClick} icon={<img src='metamask.png' className='margin-right-10' />}>
                Connect To Metamask
            </NextButton>

        </div>
    )


}

export default Metamask;
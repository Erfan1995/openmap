import { message, Button } from "antd";
import Web3 from "web3";
import styled from "styled-components";
import { Router, useRouter } from "next/router";
import UseAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { MAP, Map } from 'static/constant';
import {
    getMapVisits, putMethodPublicUser, checkPublicUsersMapBased, getPublicUsers,
    postMethodPublicUser
} from '../../lib/api'
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
    const router = useRouter();
    const [mapIds, setMapIds] = useState([]);
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
    const handleVisits = async () => {
        const res = await getMapVisits({ id: mapDetails.id })
        if (res) {
            const updated = await putMethodPublicUser(`maps/${mapDetails.id}`, { visits: (res.visits + 1) })
        }
    }


    const handleClick = async () => {
        handleVisits();
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
                const res = await getPublicUsers({ publicAddress: publicAddress })
                if (res.length !== 0) {
                    console.log(res, 'res');
                    setMapIds([]);
                    res[0]?.maps.map((data) => {
                        mapIds.push(Number(data.id));
                    })
                    const checkUser = await checkPublicUsersMapBased({ publicAddress: publicAddress, maps: mapDetails.id });
                    if (checkUser.publicUsers.length === 0) {
                        console.log("fals check")
                        mapIds.push(mapDetails.id);
                        const update = await putMethodPublicUser(`public-users/${res[0].id}`, { maps: mapIds.map(dd => dd) });
                        if (update) {
                            router.push({
                                pathname: 'client/map',
                                query: { mapToken: mapDetails.mapId, id: mapDetails.id, publicUser: res.id }
                            });
                        }
                    } else {
                        router.push({
                            pathname: 'client/map',
                            query: { mapToken: mapDetails.mapId, id: mapDetails.id, publicUser: res.id }
                        });
                    }
                } else {
                    const response = await postMethodPublicUser('public-users', { publicAddress: publicAddress, maps: mapDetails.id });
                    if (response) {
                        router.push({
                            pathname: 'client/map',
                            query: { mapToken: mapDetails.mapId, id: mapDetails.id, publicUser: res.id }
                        });
                    }
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
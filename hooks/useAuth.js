import { message } from "antd";
import { getMethod } from "lib/api";
import { useRouter } from "next/router";
import Web3 from "web3";
let web3 = undefined;

const UseAuth = () => {
    const router = useRouter();
    const login = async (mapDetails) => {
        try {
            if (ethereum) {
                ethereum.on("accountsChanged", function (accounts) {
                    if (accounts.length === 0) {
                        router.push({
                            pathname: '/',
                            query: { mapToken: mapDetails.mapId,id:mapDetails.id }
                        });
                    }
                });

                if (!web3) {
                    web3 = new Web3(ethereum);
                }
                const coinbase = await web3.eth.getCoinbase();
                if (!coinbase) {
                    router.push({
                        pathname: '/',
                        query: { mapToken: mapDetails.mapId,id:mapDetails.id }
                    });
                    return;
                }
                const res = await getMethod(`public-users?publicAddress=${coinbase.toLowerCase()}`,null,false);
                return res;
            }
        }
        catch (ex) {
            message.error(ex.message);
            router.push('/');

        }

    }


    const logout = () => {
        // setPublicAddress('');
    }

    return { login, logout };
}
export default UseAuth;
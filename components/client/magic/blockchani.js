import { Button, Input } from 'antd';
import { Magic } from 'magic-sdk';
import Web3 from "web3";
const BlockChain = () => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        const magic = new Magic("pk_live_DF5FB90D1FB9EBB8", {
            network: "rinkeby",
            testMode: true,
        });
        const web3 = new Web3(magic.rpcProvider);

        // onEmailSubmit(email);
        const userMetadata = await magic.user.getMetadata();
        const network = await web3.eth.net.getNetworkType();
        const userAddress = (await web3.eth.getAccounts())[0];
        const userBalance = web3.utils.fromWei(
            await web3.eth.getBalance(userAddress) // Balance is in wei
        );
    };

    return (
        <>
            <h1>Please sign up or login</h1>
            <Input type="email" name="email" required="required" placeholder="Enter your email" />
            <Button type='primary' onClick={handleSubmit}>Send</Button>

        </>
    );
};

export default BlockChain;

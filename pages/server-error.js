import { Result, Button } from "antd";
import { useRouter } from "next/router";
import { DATASET } from '../static/constant'

const ServerError = () => {
    const router = useRouter();
    return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={<Button type="primary" onClick={() => {
                router.push('/customer/maps');
            }}>{DATASET.BACK_TO_HOME}</Button>}
        />
    );

}
export default ServerError;
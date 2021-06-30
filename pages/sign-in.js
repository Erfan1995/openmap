import React from "react";
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {
    StyledCard,
} from "../styles/globalStyles";
import { postMethod } from "../lib/api";
import persistUserCredential from "../utils/persistUserCredential";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DATASET } from '../static/constant'

const key = 'updatable';

const SignIn = () => {

    const [form] = Form.useForm();
    const router = useRouter();
    const handleSubmit = () => {
        form
            .validateFields()
            .then(async (values) => {
                message.loading({ content: DATASET.LOADING, key });
                const res = await postMethod('auth/local', {
                    identifier: values.identifier,
                    password: values.password,
                }, false)
                persistUserCredential(res.jwt);
                message.success({ content: DATASET.SUCCESS, key });
                if (res.user.role.name === "Customer") {
                    router.push('/customer/maps');
                }else if(res.user.role.name === "Admin"){
                    router.push('/admin/customers')
                }
            })
            .catch((err) => {
                message.error(err);
            });

    };

    return (

        <div className='login-wrapper'>
            <StyledCard >
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="identifier"
                        rules={[
                            {
                                required: true,
                                message: DATASET.USER_NAME_MESSAGE,
                            },
                        ]}
                    >
                        <Input size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder={DATASET.USER_NAME} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: DATASET.PASSWORD_MESSAGE,
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            size='large'
                            placeholder={DATASET.PASSWORD}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>{DATASET.REMEMBER_ME}</Checkbox>
                        </Form.Item>

                        <Link href='/forgot-password'>
                            <a className="login-form-forgot" >
                                {DATASET.FORGOT_PASSWORD}
                            </a>
                        </Link>

                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" size='large' htmlType="submit" className="login-form-button">
                            {DATASET.LOGIN}
                        </Button>

                    </Form.Item>
                    {/* <div className='text-center'> {DATASET.OR} <Link href='/'> register now!</Link>  </div> */}

                </Form>
            </StyledCard>
        </div>
    );
};

export default SignIn;
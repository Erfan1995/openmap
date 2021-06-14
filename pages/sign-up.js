import React from "react";
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import {
    StyledCard,
} from "../styles/globalStyles";
import { postMethod } from "../lib/api";
import persistUserCredential from "../utils/persistUserCredential";
import { useRouter } from 'next/router';
const key = 'updatable';
import Link from 'next/link';
import { DATASET } from '../static/constant'
const SignUp = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const handleSubmit = () => {
        message.loading({ content: DATASET.LOADING, key });
        form.validateFields().then(async (values) => {
            try {
                const res = await postMethod('auth/local/register', {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                }, false);
                persistUserCredential(res.jwt);
                message.success({ content: DATASET.SUCCESS, key });
                router.push('/customer/dashboard');
            } catch (e) {
                message.error({ content: e, key, duration: 3 });
            }

        }).catch((err) => {
            console.error(err);
        })
    };


    return (
        <div className='login-wrapper'>
            <StyledCard >
                <Form
                    name="normal_login"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                    className="login-form"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: DATASET.EMAIL_MESSAGE,
                            },
                        ]}
                    >
                        <Input type='email' size='large' prefix={<MailOutlined className="site-form-item-icon" />} placeholder={DATASET.EMAIL} />
                    </Form.Item>
                    <Form.Item
                        name="username"
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
                            size='large'
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder={DATASET.PASSWORD}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: DATASET.PASSWORD_CONFIRM_MESSAGE,
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(DATASET.PASSWORDS_DO_NOT_MATCH);
                                },
                            }),
                        ]}
                    >
                        <Input
                            size='large'
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder={DATASET.CONFIRM_PASSWORD}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" size='large' htmlType="submit" className="login-form-button">
                            {DATASET.LOGIN}
                        </Button>
                    </Form.Item>
                    <div className='text-center'><Link href='/sign-in'> {DATASET.LOGIN_NOW}</Link> </div>
                </Form>
            </StyledCard>
        </div>


    );
};

export default SignUp;
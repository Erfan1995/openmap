import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {
    StyledCard,
} from "../styles/globalStyles";
import { postMethod } from "../lib/api";
import { useRouter } from 'next/router';
import Link from "next/link";
import { DATASET } from '../static/constant'

const key = 'updatable';

const ForgotPassword = () => {

    const [form] = Form.useForm();
    const router = useRouter();
    const handleSubmit = () => {
        form
            .validateFields()
            .then(async (values) => {
                message.loading({ content: DATASET.LOADING, key });
                const res = await postMethod('auth/forgot-password', {
                    email: values.email,
                })
                // persistUserCredential(res.jwt);
                message.success({ content: DATASET.SUCCESS, key });
                router.push('../dashboard');
            })
            .catch((err) => {
                console.error(err);
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
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                required: true,
                                message: DATASET.EMAIL_MESSAGE,
                            },
                        ]}
                    >
                        <Input size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder={DATASET.EMAIL} />
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" size='large' htmlType="submit" className="login-form-button">
                            {DATASET.SEND}
                        </Button>

                    </Form.Item>
                    <div className='text-center'>{DATASET.OR} <Link href='/sign-up'> register now!</Link></div>

                </Form>
            </StyledCard>
        </div>
    );
};

export default ForgotPassword;
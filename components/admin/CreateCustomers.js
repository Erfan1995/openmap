import React from "react";
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import {
    StyledCard,
} from "../../styles/globalStyles";
import styled from 'styled-components';

import { postMethod } from "../../lib/api";
import persistUserCredential from "../../utils/persistUserCredential";
import { useRouter } from 'next/router';
const key = 'updatable';
import Link from 'next/link';
const Wrapper = styled.div`
    padding:20px;
`;
const CreateCustomers = ({ user, onModalClose }) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const handleSubmit = () => {
        message.loading({ content: 'Loading...', key });
        form.validateFields().then(async (values) => {
            try {
                const res = await postMethod('auth/local/register', {
                    username: values.username,
                    email: values.email,
                    role: 1,
                    customer_creater: user,
                    password: values.password,
                    type: 'public',
                    parentId: 1
                }, false);
                // persistUserCredential(res.jwt);
                if (res) {
                    message.success({ content: 'Successfull!', key });
                    onModalClose(res);

                }
            } catch (e) {
                message.error({ content: e, key, duration: 3 });
            }

        }).catch((err) => {
            console.error(err);
        })
    };


    return (
        <Wrapper>
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
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input type='email' size='large' prefix={<MailOutlined className="site-form-item-icon" />} placeholder="email" />
                </Form.Item>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        size='large'
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input
                        size='large'

                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="confirm Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" size='large' htmlType="submit" className="login-form-button">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </Wrapper>


    );
};

export default CreateCustomers;
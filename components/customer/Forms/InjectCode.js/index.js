import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Row, Select, Divider, Col, message, Upload, Spin, Button } from "antd";
import { postMethod, putMethod, postFileMethod, putFileMethod } from "lib/api";
import { useImperativeHandle, useState, forwardRef } from "react";
import styled from 'styled-components';
import { DATASET } from '../../../../static/constant';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import nookies from 'nookies';


import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

const CryptoJS = require("crypto-js");
const { Option } = Select;
const { Dragger } = Upload;
const StyledDivider = styled(Divider)`
  margin: 4px 0;
`;
const LinkWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;
const StyledLink = styled.a`
  flex: none;
  padding: 8px;
  display: block;
  cursor: pointer;
`;
const code1 = `function add(a, b) {
    return a + b;
  }
  `;

const InjectCode = ({ mapData }) => {
    const [form] = Form.useForm();

    const [editorCode,setCode]=useState(code1);


    return (
        // <Spin spinning={loading}>
        <div>
            {/* <Form form={form} layout="vertical" initialValues={mapData} hideRequiredMark> */}
                {/* <Row gutter={16}> */}
                    <Editor
                        value={editorCode}
                        onValueChange={code=> setCode(code)}
                        highlight={code => highlight(code, languages.js)}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                        }}
                    />
                {/* </Row> */}
            {/* </Form> */}
        </div>

        // </Spin>
    );
};

export default InjectCode;

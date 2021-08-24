import { List, Divider, Upload, message, Button, Typography } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { DATASET } from '../../../static/constant'
const { Title } = Typography;
const { Dragger } = Upload;
const SelectType = styled(Button)`
  margin-bottom: 10px;
  width:80px;
  height:80px;
`;
const DataTypeLayout = styled.div`
    padding:20px;
`;
const data = [
    {
        title: 'csv',
        type: 'application/vnd.ms-excel',
        key: 1
    },
    {
        title: 'geojson',
        type: 'application/json',
        key: 2
    }

];
const FileUpload = ({ onChangeEvent }) => {

    const [fileType, setFileType] = useState();
    const [fileTypes, setFileTypes] = useState(data);
    const [uploadVisible, setUploadVisible] = useState(false);

    const changeType = (type) => {
        console.log(type)
        setFileType(type);
        setFileTypes(data.map((obj) => {
            if (type === obj.type) {
                return { ...obj, isSelected: true }
            } else {
                return { ...obj, isSelected: false }
            }
        }));
        setUploadVisible(true);
    }

    const props = {
        beforeUpload: file => {
            if (file.type !== fileType) {
                message.error(`${file.name} is not a valid file`);
            }
            return file.type === fileType ? true : Upload.LIST_IGNORE;
        },
        onChange: info => {
            onChangeEvent(info);
        },
    };

    return (
        <DataTypeLayout>
            <List
                grid={{
                    gutter: [10, 10],
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 4,
                    xl: 5,
                    xxl: 6
                }}
                dataSource={fileTypes}
                renderItem={item => (
                    <List.Item key={item.key}>
                        <SelectType className={item.isSelected ? 'selectedBox' : ''} onClick={() => changeType(item.type)} >{item.title}</SelectType>
                    </List.Item>
                )}
            />
            {uploadVisible === true ? (
                <div>
                    <Divider />
                    <Title level={5}>{fileType === 'application/vnd.ms-excel' ? DATASET.UPLOAD_CSV : DATASET.UPLOAD_JSON}</Title>
                    <Dragger  {...props} name="file" maxCount={1} >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">{fileType === 'application/vnd.ms-excel' ? DATASET.CLICK_OR_DRAG_CSV : DATASET.CLICK_OR_DRAG_JSON}</p>
                    </Dragger>

                </div>
            ) : (<p></p>)
            }
        </DataTypeLayout >)
}

export default FileUpload
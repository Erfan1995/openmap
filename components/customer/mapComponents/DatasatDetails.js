import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Spin, Form, message } from 'antd';
import styled from 'styled-components';
import { putMethod, getDatasetDetails } from "../../../lib/api";
const EditableContext = React.createContext(null);

const DatasetTable = styled(Table)`
    padding:5px
`

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            message.error(errInfo.message);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const DatasetDetails = ({ rowId }) => {
    const [dataSource, setDatasource] = useState()
    const [column, setColumn] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        setLoading(true);
        const res = await getDatasetDetails({ dataset: rowId })
        if (res.length !== 0) {
            let arr = [];
            let dataSetArr = [];
            let i = 0;
            for (const [key, value] of Object.entries(res[0].properties)) {
                arr[i] = { 'title': key, "dataIndex": key, "editable": true }
                i++;
            }
            for (let i = 0; i < res.length; i++) {
                res[i].properties.id = res[i].id;
                res[i].properties.key = res[i].id;
                dataSetArr[i] = res[i].properties;
            }
            setColumn(arr);
            setDatasource(dataSetArr);
        }
        setLoading(false);

    }, []);
    const updateProperties = async (propData) => {
        const res = await putMethod('datasetcontents/' + propData.id, { properties: propData })
    }
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDatasource(newData)
        updateProperties(row);

    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const colu = column.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });
    return (
        <Spin spinning={loading}>
            <DatasetTable
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={colu}
                scroll={{ x: 'max-content', y: 410 }}
            />
        </Spin>
    );
}


export default DatasetDetails
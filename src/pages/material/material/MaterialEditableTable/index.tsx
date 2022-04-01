import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import api from "../../../../api/api";
import './index.less';
import { notification } from 'antd';

const waitTime = (data?, row?,time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
/**校验商品条码 */
const validateBarCode = async (value: any, callback: any) => {
    let params = {
        barCode: value,
        id: value.id ? value.id : 0,
    };
    const result: any = await api.checkMaterialBarCode(params)
    if (result && result.code === 200) {
        if (!result.data.status) {
            callback();
        } else {
            callback("名称已经存在");
        }
    } else {
        callback(result.data);
    }
}

type DataSourceType = {
    id: React.Key;
    mBarCode?: string;
    unit?: string;
    purchase?: string;
    commodity?: string;
    wholesale?: string;
    low?: string;
    children?: DataSourceType[];
};

const MaterialEditableTable = (props) => {
    const { getEditableValue, initialValues } = props;
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    const defaultData: DataSourceType[] = [
        {
            id: 624691229,
            mBarCode: '',
            unit: '',
            purchase: '',
            commodity: '',
            wholesale: '',
            low: '',
        },
    ];
    if (initialValues) { 
        initialValues.map((item, index) => {
            return dataSource.push({ id: parseInt((Math.random() * 5 + 1)as any, 10), ...item })
        })
    }
    const columns: ProColumns<DataSourceType>[] = [
        {title: '条码', dataIndex: 'mBarCode', width: '15%',
            formItemProps: {
                rules: [
                    { required: true, whitespace: true, message: '该条码已经存在' },
                    { validator: (rule, value, callback) => { validateBarCode(value, callback); } }
                ]
            }
        },
        { title: '单位', dataIndex: 'unit', width: '15%' },
        { title: '采购价', dataIndex: 'purchase', width: '12%' },
        { title: '零售价', dataIndex: 'commodity', width: '12%' },
        { title: '销售价', dataIndex: 'wholesale', width: '12%' },
        { title: '最低售价', dataIndex: 'low', width: '12%' },
        { title: '操作', valueType: 'option', width: 100,
            render: (text, record, _, action) => [
                <a key="editable" onClick={() => { action?.startEditable?.(record.id); }}>编辑</a>,
                <a key="delete" onClick={() => { setDataSource(dataSource.filter((item) => item.id !== record.id));}} > 删除 </a>,
            ],
        },
    ];

    return (
        <EditableProTable<DataSourceType>
            className="EditableProTable-container"
            rowKey="id"
            headerTitle="基本信息"
            maxLength={5}
            loading={false}
            columns={columns}
            value={dataSource || null}
            onChange={setDataSource}
            editable={{
                type: 'multiple',
                editableKeys,
                onSave: async (rowKey, data, row) => {
                    getEditableValue(rowKey, data, row);
                    console.log(rowKey, data, row);
                    await waitTime(2000);
                },
                onChange: setEditableRowKeys,
                onlyOneLineEditorAlertMessage:"",
                onlyAddOneLineAlertMessage:"",
            }}
            request={async () => ({
                data: defaultData,
                total: 3,
                success: true,
            })}
        />
    );
};
export default MaterialEditableTable;
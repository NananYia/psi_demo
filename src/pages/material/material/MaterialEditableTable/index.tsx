import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { ProFormRadio, ProFormField } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import './index.less';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

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

const defaultData: DataSourceType[] = [
    {
        id: 624691229,
        mBarCode: '187660',
        unit: '个',
        purchase: '4',
        commodity: '11',
        wholesale: '11',
        low: '10',
    },
];

export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

    const columns: ProColumns<DataSourceType>[] = [
        { title: '条码', dataIndex: 'mBarCode', width: '15%'},
        { title: '单位', dataIndex: 'unit', width: '15%' },
        { title: '采购价', dataIndex: 'purchase', width: '10%' },
        { title: '零售价', dataIndex: 'commodity', width: '10%' },
        { title: '销售价', dataIndex: 'wholesale', width: '10%' },
        { title: '最低售价', dataIndex: 'low', width: '10%' },
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
            request={async () => ({
                data: defaultData,
                total: 3,
                success: true,
            })}
            value={dataSource}
            onChange={setDataSource}
            editable={{
                type: 'multiple',
                editableKeys,
                onSave: async (rowKey, data, row) => {
                    console.log(rowKey, data, row);
                    await waitTime(2000);
                },
                onChange: setEditableRowKeys,
            }}
        />
    );
};
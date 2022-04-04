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

type DataSourceType = {
    barCode?: React.Key;
    name?: string;
    standard?: string;
    model?: string;
    color?: string;
    stock?: string;
    unit?: string;
    operNumber?: string;
    unitPrice?: string;
    allPrice?: string;
    taxRate?: string;
    taxMoney?: string;
    taxLastMoney?: string;
    remark?: string;
    children?: DataSourceType[];
};

const PurchaseOrderEditableTable = (props) => {
    // id: element.id || "",
    // depotId: element.depotId || "",
    // orderNum: element.orderNum || 0,
    const { getEditableValue, initialValues } = props;
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    // if (initialValues) { 
    //     initialValues.map((item, index) => {
    //         return dataSource.push({ id: parseInt((Math.random() * 5 + 1)as any, 10), ...item })
    //     })
    // }
    const columns: ProColumns<DataSourceType>[] = [
        {
            title: '仓库名称', key: 'depotId', width: '7%',
            formItemProps: {
                rules: [{ required: true, whitespace: true, message: '${title}不能为空' },]
            }
        },
        { title: '条码', key: 'barCode', width: '8%',
            formItemProps: {
                rules: [{ required: true, message: '${title}不能为空' },]
            }
        },
        { title: '名称', key: 'name', width: '6%' },
        { title: '规格', key: 'standard', width: '5%' },
        // { title: '型号', key: 'model', width: '5%' },
        // { title: '颜色', key: 'color', width: '5%' },
        // { title: '扩展信息', key: 'materialOther', width: '5%' },
        { title: '库存', key: 'stock', width: '5%' },
        { title: '单位', key: 'unit', width: '4%' },
        // { title: '序列号', key: 'snList', width: '12%',
        //     formItemProps: {
        //         rules: [{ pattern: /^\S{1,100}$/, whitespace: true, message: '请小于100位字符' },]
        //     }
        // },
        // { title: '批号', key: 'batchNumber', width: '5%', },
        // { title: '有效期', key: 'expirationDate', width: '7%', },
        // { title: '多属性', key: 'sku', width: '4%' },
        // { title: '原数量', key: 'preNumber', width: '4%' },
        // { title: '已入库', key: 'finishNumber', width: '4%' },
        { title: '数量', key: 'operNumber', width: '4%', 
            formItemProps: {
                rules: [{ required: true, message: '请小于100位字符' },]
            }
        },
        { title: '单价', key: 'unitPrice', width: '4%' },
        { title: '金额', key: 'allPrice', width: '5%'},
        { title: '税率', key: 'taxRate', width: '3%' },
        { title: '税额', key: 'taxMoney', width: '5%', readonly: true },
        { title: '价税合计', key: 'taxLastMoney', width: '5%' },
        { title: '备注', key: 'remark', width: '5%', },
    ];

    return (
        <EditableProTable<DataSourceType>
            className="EditableProTable-container"
            rowKey="barCode"//编辑功能识别的rowKey
            // headerTitle="选择商品"
            maxLength={5}
            loading={false}
            columns={columns}
            value={dataSource}
            onChange={setDataSource}
            editable={{
                type: 'multiple',
                editableKeys,
                onSave: async (rowKey, data, row) => {
                    // dataSource.push(data);
                    getEditableValue(rowKey, data, row);
                    console.log(dataSource);
                    await waitTime(2000);
                },
                onChange: setEditableRowKeys,
                onlyOneLineEditorAlertMessage:"",
                onlyAddOneLineAlertMessage:"",
            }}
        />
    );
};
export default PurchaseOrderEditableTable;
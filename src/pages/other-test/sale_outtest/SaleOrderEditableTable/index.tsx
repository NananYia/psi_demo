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

const SaleOrderEditableTable = (props) => {
    const { getEditableValue, initialValues } = props;
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    // if (initialValues) { 
    //     initialValues.map((item, index) => {
    //         return dataSource.push({ id: parseInt((Math.random() * 5 + 1)as any, 10), ...item })
    //     })
    // }
    const columns: ProColumns<DataSourceType>[] = [
        // { title: '仓库名称', dataIndex: 'depotId', width: '7%', },
        { title: '条码', dataIndex: 'barCode', width: '8%',
            formItemProps: {
                rules: [ { required: true, whitespace: true, message: '${title}不能为空' }, ]
            }
        },
        { title: '名称', dataIndex: 'name', width: '6%', },
        { title: '规格', dataIndex: 'standard', width: '5%',  },
        { title: '型号', dataIndex: 'model', width: '5%',  },
        { title: '颜色', dataIndex: 'color', width: '5%',  },
        // { title: '扩展信息', dataIndex: 'materialOther', width: '5%',  },
        { title: '库存', dataIndex: 'stock', width: '5%',  },
        { title: '单位', dataIndex: 'unit', width: '4%',  },
        // { title: '多属性', dataIndex: 'sku', width: '4%',    },
        { title: '数量', dataIndex: 'operNumber', width: '5%',
            formItemProps: {
                rules: [{ required: true, whitespace: true, message: '${title}不能为空' },]
            }
        },
        { title: '单价', dataIndex: 'unitPrice', width: '5%',    },
        { title: '金额', dataIndex: 'allPrice', width: '5%', },
        { title: '税率', dataIndex: 'taxRate', width: '3%',},
        { title: '税额', dataIndex: 'taxMoney', width: '5%',},
        { title: '价税合计', dataIndex: 'taxLastMoney', width: '5%',},
        { title: '备注', dataIndex: 'remark', width: '5%'}
    ];

    return (
        <EditableProTable<DataSourceType>
            className="EditableProTable-container"
            rowKey="barCode"//编辑功能识别的rowKey
            headerTitle="选择商品"
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
export default SaleOrderEditableTable;
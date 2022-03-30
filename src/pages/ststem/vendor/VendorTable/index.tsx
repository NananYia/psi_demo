import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Table, Input, Button, Popconfirm, Form, FormInstance, InputRef, Radio, Tag } from 'antd';
import VendorModalForminTable from '../VendorModalinTable';
import './index.less';
interface VendorTableProps { 
    columns: any;
    dataSource: any;
    rowSelection: any;
    getExitValue: (value: any) => {}
    getdeleteValue: (value: any) => {}
}
@observer
export default class VendorTable extends React.Component<VendorTableProps, any>{
    @observable
    private columns:any;
    @observable
    dataSource: any;
    @observable
    selectedRowKeys:any
    constructor(props) {
        super(props);
        makeObservable(this);
        this.dataSource = props.dataSource;
        this.columns = [
            ...props.columns,
            {
                title: '状态', dataIndex: 'enabled', width: 70, align: "center", scopedSlots: { customRender: 'customRenderFlag' },
                render: (enabled) => 
                    <Tag className="tag-style" color={enabled ? 'green' : 'geekblue'}>{enabled ? '启用' : '禁用'}</Tag>
            },
            {
                title: '操作', dataIndex: 'action',
                render: (_, record:{ key: React.Key }) =>
                    this.dataSource.length >= 1 ? (
                        <div>
                            <VendorModalForminTable buttonlabel="编辑" title="编辑" getModalValue={this.props.getExitValue} initialValues={record}/>
                            <Popconfirm title="Sure to delete?" onConfirm={()=>this.props.getdeleteValue(record)}><a>删除</a></Popconfirm>
                        </div>
                    ) : null,
            },
        ];
    }
    handleSave = (row) => {
        const newData = [...this.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.dataSource = newData;
    };
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
    };
    render() {
        const selectedRowKeys = this.selectedRowKeys;
        const rowSelection = { selectedRowKeys, onChange: this.onSelectChange };
        const columns = this.columns.map((col) => {
            if (!col.editable) { return col; }
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div className="EditableTable-container">
                <Table
                    rowSelection={rowSelection }
                    bordered
                    dataSource={this.dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}
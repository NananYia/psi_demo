import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Table, Input, Button, Popconfirm, Form, FormInstance, InputRef, Radio, Tag } from 'antd';
import AccountModalForm from '../AccountModal';
import './index.less';
interface CustomerTableProps { 
    columns: any;
    dataSource: any;
    rowSelection: any;
    getExitValue: (value: any) => {}
    getdeleteValue: (value: any) => {}
    updateDefault: (value: any) => {}
}
@observer
export default class CustomerTable extends React.Component<CustomerTableProps, any>{
    @observable
    private columns:any;
    @observable
    dataSource: any;
    @observable
    selectedRowKeys: any;
    constructor(props) {
        super(props);
        makeObservable(this);
        this.dataSource = props.dataSource;
        this.columns = [
            ...props.columns,
            { title: '是否默认', dataIndex: 'isDefault', width: "10%", align: "center",
                render: (isDefault) =>
                    <Tag className="tag-style" color={isDefault ? 'green' : 'orange'}>{isDefault ? '是' : '否'}</Tag>
            },
            { title: '备注', dataIndex: 'remark', width: "10%", align: "center" },
            { title: '操作', dataIndex: 'action',
                render: (_, record:{ key: React.Key }) =>
                    this.dataSource.length >= 1 ? (
                        <div>
                            <Popconfirm title="确认设为默认?" onConfirm={() => this.props.updateDefault(record)}><a style={{paddingRight:10}}>修改默认</a></Popconfirm>
                            <AccountModalForm buttonlabel="编辑" title="编辑仓库" getModalValue={this.props.getExitValue.bind(this)} initialValues={record}/>
                            <Popconfirm title="确认删除?" onConfirm={()=>this.props.getdeleteValue(record)}><a>删除</a></Popconfirm>
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
                    pagination={{ pageSize: 6 }}
                    scroll={{ y: 350 }}
                />
            </div>
        );
    }
}
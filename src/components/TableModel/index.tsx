import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Table, Input, Button, Popconfirm, Form, FormInstance, InputRef, Radio } from 'antd';
import './index.less';
interface EditableTableProps { 
    columns: any;
    dataSource: any;
    rowSelection: any;
}
@observer
export default class EditableTable extends React.Component<EditableTableProps, any>{
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
        // this.dataSource = [
        //     { key: '0', name: 'Edward King 0', age: '32', address: 'London, Park Lane no. 0', },
        //     { key: '1', name: 'Edward King 1', age: '32', address: 'London, Park Lane no. 1', },
        // ];
        this.columns = [
            ...props.columns,
            {
                title: '操作', dataIndex: 'action',
                render: (_, record:{ key: React.Key }) =>
                    this.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
    }
    handleDelete = (key) => {
        const dataSource = [...this.dataSource];
        this.dataSource=dataSource.filter((item) => item.key !== key)
    };
    handleAdd = () => {
        const count = this.dataSource.length;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: '32',
            address: `London, Park Lane no. ${count}`,
        };
        this.dataSource.push({ ...newData });
        
    };
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
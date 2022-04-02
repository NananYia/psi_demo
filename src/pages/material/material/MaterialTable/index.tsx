import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Table, Input, Button, Popconfirm, Form, FormInstance, InputRef, Radio, Tag } from 'antd';
import ModalFormButton from '../MaterialModal';
import './index.less';
interface VendorTableProps { 
    columns: any;
    dataSource: any;
    rowSelection: any;
    getExitValue: (value: any) => {}
    getdeleteValue: (value: any) => {}
}
@observer
export default class MaterialTable extends React.Component<VendorTableProps, any>{
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
                title: '序列号', dataIndex: 'enableSerialNumber', width: 80, align: "center", scopedSlots: { customRender: 'customRenderFlag' },
                render: (enableSerialNumber) =>
                    <Tag className="tag-style" color={enableSerialNumber === 1 ? 'green' : 'geekblue'}>{enableSerialNumber===1 ? '有' : '无'}</Tag>
            }, {
                title: '批号', dataIndex: 'enableBatchNumber', width: 70, align: "center", scopedSlots: { customRender: 'customRenderFlag' },
                render: (enableBatchNumber) =>
                    <Tag className="tag-style" color={enableBatchNumber===1 ? 'green' : 'geekblue'}>{enableBatchNumber===1 ? '启用' : '禁用'}</Tag>
            },
            {
                title: '操作', dataIndex: 'action', width: 100, fixed: 'right',
                render: (_, record:{ key: React.Key }) =>
                    this.dataSource.length >= 1 ? (
                        <div>
                            <ModalFormButton buttonlabel="编辑" title="编辑" getModalValue={this.props.getExitValue} initialValues={record}/>
                            <Popconfirm title="Sure to delete?" onConfirm={()=>this.props.getdeleteValue(record)}><a>删除</a></Popconfirm>
                        </div>
                    ) : null,
            },
        ];
    }
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
    };
    render() {
        const selectedRowKeys = this.selectedRowKeys;
        const rowSelection = { selectedRowKeys, onChange: this.onSelectChange };
        return (
            <div className="MaterialTable-container">
                <Table
                    rowSelection={rowSelection }
                    bordered
                    dataSource={this.dataSource}
                    columns={this.columns}
                    // pagination={{ pageSize: 50}}
                    scroll={{ x: 1500, y: 300 }} 
                />
            </div>
        );
    }
}
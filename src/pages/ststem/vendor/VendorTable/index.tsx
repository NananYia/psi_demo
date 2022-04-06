import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Table, Input, Button, Popconfirm, Form, FormInstance, InputRef, Radio, Tag } from 'antd';
import VendorModalForminTable from '../VendorModal';
import './index.less';
interface VendorTableProps { 
    columns: any;
    dataSource: any;
    rowSelection: any;
    getExitValue: (value: any) => {}
    getdeleteValue: (value: any) => {}
    getauditData: (value: any) => {}
}
@observer
export default class VendorTable extends React.Component<VendorTableProps, any>{
    @observable
    private columns:any;
    @observable
    dataSource: any = [];
    @observable
    selectedRowKeys:any
    constructor(props) {
        super(props);
        makeObservable(this);
        for (let index = 0; index < props.dataSource.length; index++) {
            const element = props.dataSource[index];
            this.dataSource.push({ ...element, key: element.id });
        }
        this.columns = [
            ...props.columns,
            {
                title: '状态', dataIndex: 'enabled', width: "10%", align: "center", scopedSlots: { customRender: 'customRenderFlag' },
                render: (enabled) => 
                    <Tag className="tag-style" color={enabled ? 'green' : 'geekblue'}>{enabled ? '启用' : '禁用'}</Tag>
            },
            {
                title: '操作', dataIndex: 'action', align: "center",
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
    onSelectChange = selectedRowKeys => {
        this.props.getauditData(selectedRowKeys);
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
    };
    render() {
        const selectedRowKeys = this.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
                Table.SELECTION_NONE,
            ],
        };
        return (
            <div className="EditableTable-container">
                <Table
                    rowSelection={{ ...rowSelection }}
                    bordered
                    dataSource={this.dataSource}
                    columns={this.columns}
                    // pagination={{ pageSize: 20 }}
                    // scroll={{ x: 1500, y: 300 }}
                />
            </div>
        );
    }
}
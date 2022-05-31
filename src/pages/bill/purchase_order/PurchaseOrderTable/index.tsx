import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Table, Input, Button, Popconfirm, Form, FormInstance, InputRef, Radio, Tag } from 'antd';
import ModalFormButton from '../PurchaseOrderModal';
import './index.less';
interface VendorTableProps { 
    columns: any;
    dataSource: any;
    rowSelection?: any;
    getExitValue?: (value: any) => {}
    getDeleteValue?: (value: any) => {}
    getUpdateValue?: (value: any) => {}
    getauditData?: (value: any) => {}
}
@observer
export default class PurchaseOrderTable extends React.Component<VendorTableProps, any>{
    @observable
    private columns:any;
    @observable
    dataSource: any=[];
    @observable
    selectedRowKeys: any
    @observable statusColor: string;//状态颜色
    @observable statusText: string;//状态内容
    constructor(props) {
        super(props);
        makeObservable(this);
        for (let index = 0; index < props.dataSource.length; index++) {
            const element = props.dataSource[index];
            this.dataSource.push({ ...element, key: element.id});
        }
        this.columns = [
            ...props.columns,
            {
                title: '状态', dataIndex: 'status', width: "10%", align: "center", scopedSlots: { customRender: 'customRenderFlag' },
                render: (status) => {
                    this.getstatusText(status)
                    return <Tag className="tag-style" color={this.statusColor}>{this.statusText}</Tag>
                }
            },
            {
                title: '操作', dataIndex: 'action', width: "10%", align: "center",
                render: (_, record:{ key: React.Key }) =>
                    this.dataSource.length >= 1 ? (
                        <div>
                            <ModalFormButton buttonlabel="编辑" title="编辑" getModalValue={this.props.getExitValue} initialValues={record}/>
                            <Popconfirm title="Sure to delete?" onConfirm={()=>this.props.getDeleteValue(record)}><a>删除</a></Popconfirm>
                        </div>
                    ) : null,
            },
        ];
    }
    getstatusText = (status) => {
        if (status === "0") {
            this.statusColor = "red";
            this.statusText = "未审核";
        } else if (status === "1") { 
            this.statusColor = "green";
            this.statusText = "已审核";
        } else if (status === "2") {
            this.statusColor = "cyan";
            this.statusText = "完成采购";
        } else {
            this.statusColor = "blue";
            this.statusText = "部分采购";
        }
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
            <div className="PurchaseOrderTable-container">
                <Table
                    rowSelection={{ ...rowSelection } }
                    bordered
                    dataSource={this.dataSource}
                    columns={this.columns}
                    pagination={{ pageSize: 20}}
                />
            </div>
        );
    }
}
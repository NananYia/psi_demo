import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Table, Tag } from 'antd';
interface PurchaseinModelTableProps {
    columns?: any;
    dataSource: any;
    rowSelection?: any;
    getselectData?: (value: any) => {}
}
@observer
export default class PurchaseinModelTable extends React.Component<PurchaseinModelTableProps, any>{
    @observable private columns: any;
    @observable private dataSource: any = [];
    @observable selectedRowKeys: any
    @observable statusColor: string;//状态颜色
    @observable statusText: string;//状态内容
    
    constructor(props) {
        super(props);
        makeObservable(this);
        for (let index = 0; index < props.dataSource.length; index++) {
            const element = props.dataSource[index];
            this.dataSource.push({ ...element, key: element.id });
        }
        this.columns = [
            { title: '供应商', dataIndex: 'organName', width: '12%', fixed: 'left', align: "center" },
            { title: '单据编号', dataIndex: 'number', width: '17%', ellipsis: true, fixed: 'left', align: "center" },
            { title: '商品信息', dataIndex: 'materialsList', width: '28%', ellipsis: true, align: "center" },
            { title: '单据日期', dataIndex: 'operTimeStr', width: '15%', ellipsis: true, align: "center" },
            { title: '操作员', dataIndex: 'userName', width: '10%', ellipsis: true, align: "center",},
            { title: '金额合计', dataIndex: 'totalPrice', width: '10%', align: "center" },
            {
                title: '状态', dataIndex: 'status', width: '8%', align: "center", scopedSlots: { customRender: 'customRenderFlag' },
                render: (status) => {
                    this.getstatusText(status)
                    return <Tag className="tag-style" color={this.statusColor}>{this.statusText}</Tag>
                }
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
        }
    }
    onSelectChange = selectedRowKeys => {
        this.props.getselectData(selectedRowKeys);
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys
    };
    render() {
        const selectedRowKeys = this.selectedRowKeys;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            // selections: [
            //     Table.SELECTION_ALL,
            //     Table.SELECTION_INVERT,
            //     Table.SELECTION_NONE,
            // ],
        };
        return (
            <div className="PurchaseInTable-container" style={{ paddingLeft: 0 }} >
                <Table
                    rowSelection={{ ...rowSelection }}
                    dataSource={this.dataSource}
                    columns={this.columns}
                    pagination={{ pageSize: 20 }}
                />
            </div>
        );
    }
}
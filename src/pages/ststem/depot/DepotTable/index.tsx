import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Table, Input, Button, Popconfirm, Form, FormInstance, InputRef, Radio, Tag } from 'antd';
import DepotModalForm from '../DepotModal';
import './index.less';
interface CustomerTableProps { 
    columns: any;
    dataSource: any;
    rowSelection: any;
    getExitValue: (value: any) => {}
    getdeleteValue: (value: any) => {}
    updateDefault: (value: any) => {}
    getauditData: (value: any) => {}
}
@observer
export default class CustomerTable extends React.Component<CustomerTableProps, any>{
    @observable
    private columns:any;
    @observable
    dataSource: any = [];
    @observable
    selectedRowKeys: any;
    constructor(props) {
        super(props);
        makeObservable(this);
        for (let index = 0; index < props.dataSource.length; index++) {
            const element = props.dataSource[index];
            this.dataSource.push({ ...element, key: element.id });
        }
        this.columns = [
            ...props.columns,
            // { title: '是否默认', dataIndex: 'isDefault', width: "10%", align: "center",
            //     render: (isDefault) =>
            //         <Tag className="tag-style" color={isDefault ? 'green' : 'orange'}>{isDefault ? '是' : '否'}</Tag>
            // },
            { title: '备注', dataIndex: 'remark', width: "15%", align: "center" },
            { title: '操作', dataIndex: 'action', align: "center",
                render: (_, record:{ key: React.Key }) =>
                    this.dataSource.length >= 1 ? (
                        <div>
                            {/* <Popconfirm title="确认修改默认?" onConfirm={() => this.props.updateDefault(record)}><a style={{paddingRight:10}}>修改默认</a></Popconfirm> */}
                            <DepotModalForm buttonlabel="编辑" title="编辑仓库" getModalValue={this.props.getExitValue.bind(this)} initialValues={record}/>
                            <Popconfirm title="确认删除?" onConfirm={()=>this.props.getdeleteValue(record)}><a>删除</a></Popconfirm>
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
                    pagination={{ pageSize: 50 }}
                    scroll={{ y: 350 }}
                />
            </div>
        );
    }
}
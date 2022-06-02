import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Table } from 'antd';
interface PurchaseinModelTableProps {
    columns?: any;
    dataSource: any;
    rowSelection: any;
    getselectData: (value: any) => {}
}
@observer
export default class PurchaseinModelTable extends React.Component<PurchaseinModelTableProps, any>{
    @observable
    private columns: any;
    @observable
    private dataSource: any = [];
    @observable
    selectedRowKeys: any
    constructor(props) {
        super(props);
        makeObservable(this);
        for (let index = 0; index < props.dataSource.length; index++) {
            const element = props.dataSource[index];
            this.dataSource.push({ ...element, key: element.mBarCode });
        }
        this.columns = [
            { title: '条码', dataIndex: 'mBarCode', width: '15%', fixed: 'left', align: "center" },
            { title: '名称', dataIndex: 'name', width: '15%', ellipsis: true, fixed: 'left', align: "center" },
            { title: '颜色', dataIndex: 'color', width: '10%', ellipsis: true, align: "center" },
            { title: '类别', dataIndex: 'categoryName', width: '10%', ellipsis: true, align: "center" },
            { title: '单位', dataIndex: 'unit', width: '10%', ellipsis: true, align: "center",},
            { title: '保质期', dataIndex: 'expiryNum', width: '15%', align: "center" },
            { title: '库存', dataIndex: 'stock', width: '15%', align: "center" },
        ];
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
            <div className="PurchaseInTable-container">
                <Table
                    rowSelection={{ ...rowSelection }}
                    dataSource={this.dataSource}
                    columns={this.columns}
                    pagination={{ pageSize: 6 }}
                />
            </div>
        );
    }
}
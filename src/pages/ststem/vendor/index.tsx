import React, { Component } from "react";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { notification, Modal, Button } from "antd";
import VendorTable from "./VendorTable";
import SearchForm from "../../../components/SearchForm";
import { filterObj } from "src/utils/util";
import MySpin from "src/components/Spin";
import { deleteAction, getAction, postAction } from "src/api/manage";
import VendorModalForm from './VendorModal';
import { CheckOutlined, StopOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from "../../../api/api";
import "./index.less";

const FormitemValue = [
    { queryParam:"supplier", text: "名称", placeholder: "请输入名称查询" },
    { queryParam: "telephone", text: "手机号码", placeholder: "请输入手机号码查询" },
    // { queryParam: "phonenum", text: "联系电话", placeholder: "请输入联系电话查询" },
]
const columns =[
    { title: '名称', dataIndex: 'supplier', width: "17%", align: "center" },
    { title: '联系人', dataIndex: 'contacts', width: "10%", align: "center" },
    { title: '手机号码', dataIndex: 'telephone', width: "15%", align: "center" },
    { title: '联系电话', dataIndex: 'phoneNum', width: "10%", align: "center" },
    { title: '电子邮箱', dataIndex: 'email', width: "17%", align: "center" },
]
@observer
export default class VendorList extends Component<any,any> {
    @observable private queryParam: any = {};
    @observable private searchqueryParam: any = {};
    @observable private loading: boolean=false;
    @observable public dataSource: any = {};
    @observable public modalValue: any = {};
    @observable public auditData: any = {};
    /* 排序参数 */
    private isorter: any= {
        column: 'createTime',
        order: 'desc',
    }
    /* 筛选参数 */
    private filters: any = {};
    /* 分页参数 */
    private ipagination: any ={
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
    }
    constructor(props) {
        super(props);
        makeObservable(this);
        this.getSearchVendorList();
    }
    getSearchQueryParams(values) {
        this.searchqueryParam = {
            supplier: values?.supplier||"",
            type: '供应商',
            telephone: values?.telephone||"",
            phonenum: values?.phonenum||""
        }
        //获取查询条件
        let searchObj = { search: "", }
        // if (this.superQueryParams) {
        //     sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        //     sqp['superQueryMatchType'] = this.superQueryMatchType
        // }
        searchObj.search = JSON.stringify(this.searchqueryParam);
        var param = Object.assign("", searchObj, this.isorter, this.filters);
        param.field = this.getQueryField();
        param.currentPage = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
    }
    getQueryField() {
        var str = "id,";
        columns.forEach(function (value) {
            str += "," + value.dataIndex;
        });
        return str + ",beginNeedPay" + ",allNeedPay" + ",taxRate" + ",enabled"+",action";
    }
    getSearchVendorList = async (values?) => {
        var params = this.getSearchQueryParams(values);//查询参数
        this.loading = false;
        try {
            const result: any = await getAction("/supplier/list", params);
            if (result.code === 200) {
                this.dataSource = result.data.rows;
                this.ipagination.total = result.data.total;
                this.tableAddTotalRow(columns, this.dataSource)
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
            this.loading = true;
        } catch (error) {
            console.log(error);
        }
    }
    addVendorList = async (value?) => {
        let params = {
            ...value,
            // supplier: value.supplier,
            type: '供应商',
        };
        try {
            const result: any = await api.addSupplier(params);
            if (result.code === 200) {
                this.getSearchVendorList()
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    editVendorList = async (value?) => {
        let params = { ...value, type: '供应商',};
        try {
            const result: any = await api.editSupplier(params);
            if (result.code === 200) {
                this.getSearchVendorList()
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    deleteVendorList = async (values?, maney?) => {
        try {
            if (maney) {
                var result: any = await deleteAction("/supplier/deleteBatch?" + "ids=" + values, null);
            } else { 
                var result: any = await deleteAction("/supplier/delete?" + "id=" + values.id, null);
            }
            if (result.code === 200) {
                this.getSearchVendorList()
            }
            if (result.code === 510 || result.code === 601) {
                notification.warning({ message: result.data.message })
            }
        } catch (error) {
            console.log(error);
        }
    }
    getauditData = (value) => {
        this.auditData = []
        this.auditData = value.join();
    }
    /**删除弹框 */
    deleteconfirm = () => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: "是否操作选中数据?",
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.deleteVendorList(this.auditData,true)
        });
    }
    /**启用禁用弹框 */
    confirm = (status) => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: "是否操作选中数据?",
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.auditOrder(status)
        });
    }
    auditOrder = async (audit?) => {
        try {
            const result: any = await postAction("supplier/batchSetStatus", { status: audit, ids: this.auditData });
            if (result.code === 200) {
                this.getSearchVendorList()
            }
            if (result.code === 510) {
                notification.warning(result.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div className="vendor-container">
                <div className="title">供应商信息</div>
                <SearchForm
                    FormitemValue={FormitemValue}
                    getSearchList={this.getSearchVendorList.bind(this)}
                />
                {this.loading ?
                    <div className="search-result-list">
                        <VendorModalForm buttonlabel="新建" title="新建供应商" getModalValue={this.addVendorList.bind(this)} />
                        <Button icon={<DeleteOutlined />} style={{ marginLeft: 10 }} onClick={() => this.deleteconfirm()} > 删除 </Button>
                        <Button icon={<CheckOutlined />} style={{ marginLeft: 10 }} onClick={() => this.confirm(true)} > 启用 </Button>
                        <Button icon={<StopOutlined />} style={{ marginLeft: 10 }} onClick={() => this.confirm(false)} > 禁用 </Button>
                        <VendorTable
                            columns={columns}
                            dataSource={this.dataSource}
                            // loading={this.loading}
                            rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                            getExitValue={this.editVendorList.bind(this)}
                            getdeleteValue={this.deleteVendorList.bind(this)}
                            getauditData={this.getauditData.bind(this)}
                        />
                    </div>
                    : <MySpin />}
            </div>
        );
    }
    /** 表格增加合计行 */
    tableAddTotalRow(columns, dataSource) {
        if (dataSource.length > 0 && this.ipagination.pageSize % 10 === 1) {
            //分页条数为11、21、31等的时候增加合计行
            let numKey = 'rowIndex'
            let totalRow = { [numKey]: '合计' }
            //需要合计的列
            let parseCols = 'initialStock,currentStock,currentStockPrice,initialAmount,thisMonthAmount,currentAmount,inSum,inSumPrice,inOutSumPrice,' +
                'outSum,outSumPrice,outInSumPrice,operNumber,allPrice,numSum,priceSum,prevSum,thisSum,thisAllPrice,billMoney,changeAmount,' +
                'allPrice,currentNumber,lowSafeStock,highSafeStock,lowCritical,highCritical'
            columns.forEach(column => {
                let { key, dataIndex } = column
                if (![key, dataIndex].includes(numKey)) {
                    let total:any = 0
                    dataSource.forEach(data => {
                        if (parseCols.indexOf(dataIndex) > -1) {
                            if (data[dataIndex]) {
                                total += Number.parseFloat(data[dataIndex])
                            } else {
                                total += 0
                            }
                        } else {
                            total = '-'
                        }
                    })
                    if (total !== '-') {
                        total = total.toFixed(2)
                    }
                    totalRow[dataIndex] = total
                }
            })
            dataSource.push(totalRow)
            //总数要增加合计的行数，每页都有一行合计，所以总数要加上
            let size = Math.ceil(this.ipagination.total / (this.ipagination.pageSize - 1))
            this.ipagination.total = this.ipagination.total + size
        }
    }
}
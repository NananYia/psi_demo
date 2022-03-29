import React, { Component } from "react";
import "./index.less";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { notification } from "antd";
import EditableTable from "../../../components/TableModel";
import SearchForm from "../../../components/SearchForm";
import { filterObj } from "src/utils/util";
import MySpin from "src/components/Spin";
import { getAction, postAction } from "src/api/manage";
import ModalForm from './VendorModal';
import api from "../../../api/api";

const FormitemValue = [
    { queryParam:"supplier", text: "名称", placeholder: "请输入名称查询" },
    { queryParam: "telephone", text: "手机号码", placeholder: "请输入手机号码查询" },
    { queryParam: "phonenum", text: "联系电话", placeholder: "请输入联系电话查询" },
]
const columns =[
    { title: '#', dataIndex: '', key: 'rowIndex', width: 60, align: "center",
        customRender: function (t, r, index) {
            return parseInt(index) + 1;
        }
    },
    { title: '名称', dataIndex: 'supplier', width: 100 },
    { title: '联系人', dataIndex: 'contacts', width: 100, align: "center" },
    { title: '手机号码', dataIndex: 'telephone', width: 100, align: "center" },
    { title: '联系电话', dataIndex: 'phoneNum', width: 100, align: "center" },
    { title: '电子邮箱', dataIndex: 'email', width: 150, align: "center" },
    { title: '期初应付', dataIndex: 'beginNeedPay', width: 80, align: "center" },
    { title: '期末应付', dataIndex: 'allNeedPay', width: 80, align: "center" },
    { title: '税率(%)', dataIndex: 'taxRate', width: 80, align: "center" },
    { title: '状态', dataIndex: 'enabled', width: 70, align: "center", scopedSlots: { customRender: 'customRenderFlag' } },
    // { title: '操作', dataIndex: 'action', width: 200, align: "center", scopedSlots: { customRender: 'action' }, },
]
@observer
export default class VendorList extends Component<any,any> {
    @observable private queryParam: any = {};
    @observable private searchqueryParam: any = {};
    @observable private loading: boolean=false;
    @observable public dataSource: any = {};
    @observable public modalValue: any = {};
    @observable public firstTotal: any;
    @observable public lastTotal: any;
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
        return str+",action";
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
            supplier: value.supplier,
            type: '供应商',
        };
        try {
            const result: any = await api.addSupplier(params);
            if (result.code === 200) {
                this.getVendorList()
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    getVendorList = async (arg?) => { 
        if (arg === 1) {
            this.ipagination.current = 1;
        }
        let param = Object.assign({}, this.queryParam, this.isorter);//查询条件
        param.field = this.getQueryField();
        param.currentPage = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize - 1;
        this.loading = false;
        const result: any = await getAction("/supplier/list", param)
        if (result.code === 200) {
            this.dataSource = result.data.rows;
            this.ipagination.total = result.data.total;
            this.tableAddTotalRow(columns, this.dataSource)
            if (this.queryParam.organId) {
                this.firstTotal = '期初应付：' + result.data.firstMoney + "，"
                this.lastTotal = '期末应付：' + result.data.lastMoney
            }
        }
        if (result.code === 510) {
            notification.warning(result.data)
        }
        this.loading = true;
    }
    getModalValue(value?) {
        // this.modalValue = value;
        this.addVendorList(value);
    }
    render() {
        return (
            <div className="vendor-container">
                <SearchForm
                    FormitemValue={FormitemValue}
                    getSearchList={this.getSearchVendorList.bind(this)}
                />
                {this.loading ?
                    <div className="search-result-list">
                        <ModalForm buttonlabel="新建" title="新建供应商" getModalValue={this.getModalValue.bind(this)} />
                        <EditableTable
                            columns={columns}
                            dataSource={this.dataSource}
                            // loading={this.loading}
                            rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
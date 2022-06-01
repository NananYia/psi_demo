import React, { Component } from "react";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, Modal, notification } from "antd";
import SearchForm from "../../../components/SearchForm";
import { filterObj } from "src/utils/util";
import MySpin from "src/components/Spin";
import { deleteAction, getAction, postAction, putAction } from "src/api/manage";
import SaleOutTable from "./SaleOutTable";
import api from "../../../api/api";
import "./index.less";

const columns =[
    { title: '条码', dataIndex: 'barCode', width: '7%', fixed: 'left', align: "center" },
    { title: '名称', dataIndex: 'materialName', width: '15%', ellipsis: true, fixed: 'left', align: "center"},
    { title: '规格', dataIndex: 'materialStandard', width: '8%', ellipsis: true, align: "center" },
    { title: '型号', dataIndex: 'materialModel', width: '8%', ellipsis: true, align: "center" },
    { title: '单位', dataIndex: 'materialUnit', width: '8%', ellipsis: true, align: "center", },
    { title: '销售数量', dataIndex: 'outSum', width: '10%', align: "center", sorter: (a, b) => a.outSum - b.outSum },
    { title: '销售金额', dataIndex: 'outSumPrice', width: '10%', align: "center", sorter: (a, b) => a.outSumPrice - b.outSumPrice },
]
@observer
export default class SaleOutList extends Component<any,any> {
    @observable private queryParam: any = {};
    @observable private searchqueryParam: any = {};
    @observable private loading: boolean=false;
    @observable private dataSource: any = {};
    @observable public modalValue: any = {};
    @observable public auditData: any = {};
    private FormitemValue: any = []
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
        pageSize: 11,
        pageSizeOptions: ['11', '21', '31', '101', '201']
    }
    constructor(props) {
        super(props);
        makeObservable(this);
        this.getSearchSaleOutList();
    }
    
    /**拿到搜索的参数 */
    getSearchQueryParams(values) {
        this.searchqueryParam = {
            monthTime: values?.monthTime || '',
            materialParam: values?.materialParam || '',
            mpList: ''
        }
        var param = Object.assign({}, this.searchqueryParam, this.isorter);
        param.field = this.getQueryField();
        param.currentPage = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
    }
    /**获取要请求的字段 */
    getQueryField() {
        var str = "id,";
        columns.forEach(function (value) {
            str += "," + value.dataIndex;
        });
        return str;
    }
    /**请求查询的数据 */
    getSearchSaleOutList = async(values ?,arg ?) => {
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
            this.ipagination.current = 1;
        }
        var params = this.getSearchQueryParams(values);//查询参数
        this.loading = false;
        try {
            const result: any = await getAction("/depotItem/saleOut", params);
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
   
    render() {
        this.FormitemValue = [
            { queryParam: "monthTime", text: "月份", type: "dateRange" },
            { queryParam: "materialParam", text: "商品信息", placeholder: "请输入名称、条码查询" },
        ]
        return (
            <div className="SaleOut-container">
                <div className="title">销售统计</div>
                <SearchForm
                    FormitemValue={this.
                        FormitemValue}
                    getSearchList={this.getSearchSaleOutList.bind(this)}
                />
                {this.loading ?
                    <div className="search-result-list">
                        <SaleOutTable
                            columns={columns}
                            dataSource={this.dataSource}
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
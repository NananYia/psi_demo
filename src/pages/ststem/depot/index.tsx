import React, { Component } from "react";
import { observer } from 'mobx-react'
import SearchForm from "../../../components/SearchForm";
import { makeObservable, observable } from 'mobx';
import { notification } from "antd";
import { filterObj } from "src/utils/util";
import MySpin from "src/components/Spin";
import { deleteAction, getAction } from "src/api/manage";
import api from "../../../api/api";
import DepotModalForm from "./DepotModal"
import DepotTable from "../depot/DepotTable";
import "./index.less";

const FormitemValue = [
    { queryParam: "name", text: "仓库名称", placeholder: "请输入仓库名称查询" },
    { queryParam: "remark", text: "手机号码", placeholder: "请输入描述查询" },
]
const columns = [
    { title: '仓库名称', dataIndex: 'name', width: "10%" },
    { title: '仓库地址', dataIndex: 'address', width: "12%", align: "center" },
    { title: '仓储费', dataIndex: 'warehousing', width: "10%", align: "center" },
    { title: '搬运费', dataIndex: 'truckage', width: "10%", align: "center" },
    { title: '负责人', dataIndex: 'principalName', width: "10%", align: "center" },
    { title: '排序', dataIndex: 'sort', width: "8%", align: "center" },
    // { title: '是否默认', dataIndex: 'isDefault', width: "10%", align: "center" },
    // { title: '备注', dataIndex: 'remark', width: "8%", align: "center" },
    // { title: '操作', dataIndex: 'action', width: 200, align: "center", scopedSlots: { customRender: 'action' }, },
]
@observer
export default class DepotList extends Component<any,any> {
    @observable private queryParam: any = {};
    @observable private searchqueryParam: any = {};
    @observable private loading: boolean = false;
    @observable public dataSource: any = {};
    @observable public modalValue: any = {};
    @observable public firstTotal: any;
    @observable public lastTotal: any;
    /* 排序参数 */
    private isorter: any = {
        column: 'createTime',
        order: 'desc',
    }
    /* 筛选参数 */
    private filters: any = {};
    /* 分页参数 */
    private ipagination: any = {
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
        this.getSearchDepotList();
    }
    getSearchQueryParams(values) {
        this.searchqueryParam = {
            name: values?.name || "",
            remark: values?.remark || "",
        }
        //获取查询条件
        let searchObj = { search: "", }
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
        return str + ",isDefault" + ",remark"+ ",action";
    }
    getSearchDepotList = async (values?) => {
        var params = this.getSearchQueryParams(values);//查询参数
        this.loading = false;
        try {
            const result: any = await getAction("/depot/list", params);
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
    addList = async (value?) => {
        let params = { ...value};
        try {
            const result: any = await api.addSupplier(params);
            if (result.code === 200) {
                this.getSearchDepotList()
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    editList = async (value?) => {
        let params = { ...value, type: '仓库', };
        try {
            const result: any = await api.editSupplier(params);
            if (result.code === 200) {
                this.getSearchDepotList()
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    updateDefault = async (values?) => {
        try {
            const result: any = await deleteAction("depot/updateIsDefault?", values?.id);
            if (result.code === 200) {
                this.getSearchDepotList()
            }
            if (result.code === 510) {
                notification.warning(result.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    deleteList = async (values?) => {
        try {
            const result: any = await deleteAction("/depot/delete?" + "id=" + values.id, null);
            if (result.code === 200) {
                this.getSearchDepotList()
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
            <div className="Depot-container">
                <div className="title">仓库信息</div>
                <SearchForm
                    FormitemValue={FormitemValue}
                    getSearchList={this.getSearchDepotList.bind(this)}
                />
                {this.loading ?
                    <div className="search-result-list">
                        <DepotModalForm buttonlabel="新建" title="新增仓库" getModalValue={this.addList.bind(this)} />
                        <DepotTable
                            columns={columns}
                            dataSource={this.dataSource}
                            rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                            getExitValue={this.editList.bind(this)}
                            getdeleteValue={this.deleteList.bind(this)}
                            updateDefault={this.updateDefault.bind(this)}
                        />
                    </div>
                    : <MySpin />
                }
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
                    let total: any = 0
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
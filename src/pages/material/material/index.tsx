import React, { Component } from "react";
import "./index.less";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { notification } from "antd";
import SearchForm from "../../../components/SearchForm";
import { filterObj } from "src/utils/util";
import MySpin from "src/components/Spin";
import { deleteAction, getAction, postAction } from "src/api/manage";
import MaterialTable from "./MaterialTable";
import MaterialModalForm from './MaterialModal';
import api from "../../../api/api";

const FormitemValue = [
    { queryParam: "categoryId", text: "类别", placeholder: "请选择类别" },
    { queryParam: "barCode", text: "条码", placeholder: "请输入条码查询" },
    { queryParam: "name", text: "名称", placeholder: "请输入名称查询" },
]
const columns =[
    { title: '条码', dataIndex: 'mBarCode', width: '8%', fixed: 'left' },
    { title: '名称', dataIndex: 'name', width: '6%', ellipsis: true, fixed: 'left'},
    { title: '规格', dataIndex: 'standard', width: '5%', ellipsis: true },
    { title: '型号', dataIndex: 'model', width: '5%', ellipsis: true },
    { title: '颜色', dataIndex: 'color', width: '5%', ellipsis: true },
    { title: '类别', dataIndex: 'categoryName', width: '5%', ellipsis: true },
    { title: '扩展信息', dataIndex: 'materialOther', width: '6%', ellipsis: true },
    { title: '单位', dataIndex: 'unit', width: '5%', ellipsis: true,
        customRender: function (t, r, index) {
            if (r) {
                let name = t ? t : r.unitName
                if (r.sku) {
                    return name + '[SKU]';
                } else {
                    return name;
                }
            }
        }
    },
    { title: '保质期', dataIndex: 'expiryNum', width: '5%' },
    { title: '库存', dataIndex: 'stock', width: '5%' },
    { title: '采购价', dataIndex: 'purchaseDecimal', width: '5%' },
    { title: '零售价', dataIndex: 'commodityDecimal', width: '5%' },
    { title: '销售价', dataIndex: 'wholesaleDecimal', width: '5%' },
    { title: '最低售价', dataIndex: 'lowDecimal', width: '6%' },
]
@observer
export default class MaterialList extends Component<any,any> {
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
        this.getSearchMaterialList();
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
    getSearchMaterialList = async (values?) => {
        var params = this.getSearchQueryParams(values);//查询参数
        this.loading = false;
        try {
            const result: any = await getAction("/material/list", params);
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
    getMaterialList = async (arg?) => { 
        if (arg === 1) {
            this.ipagination.current = 1;
        }
        let param = Object.assign({}, this.queryParam, this.isorter);//查询条件
        param.field = this.getQueryField();
        param.currentPage = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize - 1;
        this.loading = false;
        const result: any = await getAction("/material/list", param)
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
    addMaterialList = async (value?) => {
        let params = {
            supplier: value.supplier,
            type: '供应商',
        };
        try {
            const result: any = await api.addSupplier(params);
            if (result.code === 200) {
                this.getMaterialList()
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    editMaterialList = async (value?) => {
        let params = { ...value, type: '供应商',};
        try {
            const result: any = await api.editSupplier(params);
            if (result.code === 200) {
                this.getMaterialList()
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    deleteMaterialList = async (values?) => {
        try {
            const result: any = await deleteAction("/material/delete?" + "id="+ values.id, null);
            if (result.code === 200) {
                this.getMaterialList()
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
            <div className="Material-container">
                <SearchForm
                    FormitemValue={FormitemValue}
                    getSearchList={this.getSearchMaterialList.bind(this)}
                />
                {this.loading ?
                    <div className="search-result-list">
                        <MaterialModalForm buttonlabel="新建" title="新增商品" getModalValue={this.addMaterialList.bind(this)} />
                        <MaterialTable
                            columns={columns}
                            dataSource={this.dataSource}
                            // loading={this.loading}
                            rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                            getExitValue={this.editMaterialList.bind(this)}
                            getdeleteValue={ this.deleteMaterialList.bind(this)}
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
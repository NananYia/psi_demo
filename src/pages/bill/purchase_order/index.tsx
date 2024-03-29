import React, { Component } from "react";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, Modal, notification } from "antd";
import SearchForm from "../../../components/SearchForm";
import { filterObj } from "src/utils/util";
import store from "store";
import MySpin from "src/components/Spin";
import { deleteAction, getAction, httpAction, postAction, putAction } from "src/api/manage";
import PurchaseOrderTable from "./PurchaseOrderTable";
import PurchaseOrderModalForm from './PurchaseOrderModal';
import { CheckOutlined, StopOutlined } from '@ant-design/icons';
import { LoginOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from "../../../api/api";
import { USER_ID } from "../../../store/mutation-types";
import "./index.less";

const columns =[
    { title: '供应商', dataIndex: 'organName', width: '17%', ellipsis: true},
    { title: '单据编号', dataIndex: 'number', width: '17%', ellipsis: true,
        render:  (text, record, index)=> {
            if (record.linkNumber) {
                return text + "[转]";
            } else {
                return text;
            }
        }
    },
    { title: '商品信息', dataIndex: 'materialsList', width: '17%', ellipsis: true,
        render:  (text, record, index) =>{
            if (text) {
                return text.replace(",", "，");
            }
        }
    },
    { title: '单据日期', dataIndex: 'operTimeStr', width: '17%' },
    { title: '操作员', dataIndex: 'userName', width: '10%', ellipsis: true }
]
@observer
export default class PurchaseOrderList extends Component<any,any> {
    @observable private queryParam: any = {};
    @observable private searchqueryParam: any = {};
    @observable private loading: boolean=false;
    @observable public dataSource: any = {};
    @observable public modalValue: any = {};
    @observable public fileList: any = [];
    @observable public model: any = {};
    @observable public auditData: any = {};
    @observable private supplierData: any = [];
    @observable private userData: any = [];
    @observable private accountData: any = [];
    @observable private MaterialData: [];
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
        this.getSearchList();
        this.getSupplierName();
        this.getUserName();
        this.loadMaterialData();
        this.FormitemValue = [
            { queryParam: "number", text: "单据编号", placeholder: "请输入单据编号" },
            { queryParam: "materialParam", text: "商品名称", placeholder: "请输入名称" },
            { queryParam: "organId", text: "选供应商", placeholder: "选择供应商", type: "select", options: this.supplierData},
            { queryParam: "creator", text: "选操作员", placeholder: "选择操作员", type: "select", options: this.userData },
        ]
    }
    /**拿到供应商列表 */
    getSupplierName = async () => {
        try {
            const result: any = await api.findBySelectSup({});
            result.map((item) => {
                const dataitem = {
                    value: item.supplier,
                    id: item.id
                }
                return this.supplierData.push(dataitem)
            })
        } catch (error) {
            console.log(error);
        }
    }
    /**拿到操作员列表 */
    getUserName = async () => {
        try {
            const result: any = await api.getUserList({});
            result.map((item) => {
                const dataitem = {
                    value: item.userName,
                    id: item.id
                }
                return this.userData.push(dataitem)
            })
        } catch (error) {
            console.log(error);
        }
    }
    /**拿到库存信息 */
    loadMaterialData = async (arg?) => {
        const params = {
            depotId: 21,//嘿嘿仓库
            column: "createTime",
            order: "desc",
            mpList: "制造商, 自定义1, 自定义2, 自定义3",
            page: 1,
            rows: 10,
        }
        if (arg === 1) {
            this.ipagination.current = 1;
        }
        const result: any = await api.getMaterialBySelect(params)
        if (result) {
            this.MaterialData = result.rows
            this.ipagination.total = result.total
        }
    }
    /**拿到搜索的参数 */
    getSearchQueryParams(values) {
        this.searchqueryParam = {
            number: values?.number ||"",
            materialParam: values?.materialParam ||"",
            type: "其它",
            subType: "采购订单",
            roleType: store.get('roleType'),
            organId: values?.organId ||"",
            depotId: values?.depotId ||"",
            creator: values?.creator ||""
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
    /**获取要请求的字段 */
    getQueryField() {
        var str = "id,";
        columns.forEach(function (value) {
            str += "," + value.dataIndex;
        });
        return str;
    }
    /**请求查询的数据 */
    getSearchList = async(values ?,arg ?) => {
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
            this.ipagination.current = 1;
        }
        var params = this.getSearchQueryParams(values);//查询参数
        this.loading = false;
        try {
            const result: any = await getAction("/depotHead/list", params);
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
   
    /** 整理成formData */
    classifyIntoFormData=(allValues)=> {
        let totalPrice = 0;
        let billMain = Object.assign(this.model, allValues.formValue)
        let detailArr = allValues.tablesValue.values
        billMain.type = '其它';
        billMain.subType = '采购订单';
        billMain.defaultNumber = billMain.number
        for (let item of detailArr) {
            item.depotId = '' //订单不需要仓库
            totalPrice += item.allPrice - 0
        }
        billMain.totalPrice = 0 - totalPrice
        if (this.fileList && this.fileList.length > 0) {
            billMain.fileName = this.fileList
        } else {
            billMain.fileName = ''
        }
        if (allValues.id===null) {
            billMain.id = allValues.id
        }
        return {
            info: JSON.stringify(billMain),
            rows: JSON.stringify(detailArr),
        }
    }
    addList = async (allvalues?) => {
        let formData = this.classifyIntoFormData(allvalues)
        try {
            //进一步校验单位
            if (allvalues.id!==null) { //存在id执行更新
                const result: any = await httpAction("/depotHead/updateDepotHeadAndDetail", formData, 'post')
                if (result.code === 200) { this.getSearchList() }
                if (result.code === 510) { notification.warning(result.data) }
            } else {        //不存在id执行新增
                const result: any = await httpAction("/depotHead/addDepotHeadAndDetail", formData, 'post')
                if (result.code === 200) { this.getSearchList() }
                if (result.code === 510) { notification.warning(result.data) }
            }
        } catch (error) {
            console.log(error);
        }
    }
    deleteList = async (values?) => {
        try {
            const result: any = await deleteAction("/depotHead/delete?" + "id="+ values.id, null);
            if (result.code === 200) {
                this.getSearchList()
            }
            if (result.code === 510) {
                notification.warning(result.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    getauditData = (value) => {
        this.auditData=[]
        this.auditData = value.join();
    }
    /**操作弹框 */
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
    /** */
    auditOrder = async(audit?) => { 
        try {
            const result: any = await postAction("/depotHead/batchSetStatus", {status:audit, ids: this.auditData});
            if (result.code === 200) {
                this.getSearchList()
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
            <div className="PurchaseOrder-container">
                <div className="title">采购订单</div>
                <SearchForm
                    FormitemValue={this.FormitemValue}
                    getSearchList={this.getSearchList.bind(this)}
                />
                {this.loading ?
                    <div className="search-result-list">
                        <PurchaseOrderModalForm
                            buttonlabel="新建"
                            title="新增采购订单"
                            getModalValue={this.addList.bind(this)}
                            getAccountData={this.accountData}
                            getsupplierData={this.supplierData}
                            getMaterialData={this.MaterialData}
                        />
                        {store.get(USER_ID) !== 150 &&
                            <Button icon={<CheckOutlined />} style={{ marginLeft: 10 }} onClick={() => this.confirm(1)} > 审核 </Button>
                        }
                        {store.get(USER_ID) !== 150 &&
                            <Button icon={<StopOutlined />} style={{ marginLeft: 10 }} onClick={() => this.confirm(0)} > 反审核 </Button>
                        }
                        <PurchaseOrderTable
                            columns={columns}
                            dataSource={this.dataSource}
                            // loading={this.loading}
                            // rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                            getExitValue={this.addList.bind(this)}
                            getDeleteValue={this.deleteList.bind(this)}
                            getauditData={this.getauditData.bind(this)}
                            getAccountData={this.accountData}
                            getsupplierData={this.supplierData}
                            getMaterialData={this.MaterialData}
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
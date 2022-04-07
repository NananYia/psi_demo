import React, { Component } from "react";
import { observer } from 'mobx-react'
import SearchForm from "../../../components/SearchForm";
import { makeObservable, observable } from 'mobx';
import { Button, Modal, notification } from "antd";
import { filterObj } from "src/utils/util";
import MySpin from "src/components/Spin";
import { deleteAction, getAction, postAction } from "src/api/manage";
import api from "../../../api/api";
import UserModalForm from "./DepotModal"
import { CheckOutlined, StopOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserTable from "./DepotTable";
import "./index.less";

const FormitemValue = [
    { queryParam: "loginName", text: "登录名称", placeholder: "输入登录名称" },
    { queryParam: "userName", text: "用户姓名", placeholder: "输入用户姓名" },
]
const columns = [
    { title: '登录名称', dataIndex: 'loginName', width: "18%", align: "center" },
    { title: '用户姓名', dataIndex: 'username', width: "18%", align: "center" },
    { title: '角色', dataIndex: 'roleName', width: "18%", align: "center" },
    { title: '电话号码', dataIndex: 'phonenum', width: "18%", align: "center" },
]
@observer
export default class DepotList extends Component<any,any> {
    @observable private queryParam: any = {};
    @observable private searchqueryParam: any = {};
    @observable private loading: boolean = false;
    @observable public dataSource: any = {};
    @observable public modalValue: any = {};
    @observable public auditData: any = {};
    @observable public firstTotal: any;
    @observable public lastTotal: any;
    @observable private loadRoleData: any = [];
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
        this.getSearchUserList();
        this.getRoleData();
    }
    /**拿到角色列表 */
    getRoleData = async () => {
        const result: any = await api.roleAllList({});
        if (result) {
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                this.loadRoleData.push({ label: element.name, value: element.id });
            }

        }
    }
    getSearchQueryParams(values) {
        this.searchqueryParam = {
            loginName: values?.loginName || "",
            userName: values?.userName || "",
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
        return str;
    }
    getSearchUserList = async (values?) => {
        var params = this.getSearchQueryParams(values);//查询参数
        this.loading = false;
        try {
            const result: any = await getAction("/user/list", params);
            if (result.code === 200) {
                this.dataSource = result.data.rows;
                this.ipagination.total = result.data.total;
                // this.tableAddTotalRow(columns, this.dataSource)
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
            const result: any = await api.addUser(params);
            if (result.code === 200) {
                this.getSearchUserList()
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
            const result: any = await api.editUser(params);
            if (result.code === 200) {
                this.getSearchUserList()
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
            const result: any = await postAction("user/updateIsDefault", { id: values?.id });
            if (result.code === 200) {
                this.getSearchUserList()
            }
            if (result.code === 510) {
                notification.warning(result.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    deleteList = async (values?, maney?) => {
        try {
            if (maney) {
                var result: any = await deleteAction("/user/deleteBatch?" + "ids=" + values, null);
            } else {
                var result: any = await deleteAction("/user/delete?" + "id=" + values.id, null);
            }
            if (result.code === 200) {
                this.getSearchUserList()
            }
            if (result.code === 510) {
                notification.warning(result.data.message)
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
            onOk: () => this.deleteList(this.auditData, true)
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
            const result: any = await postAction("/user/batchSetStatus", { status: audit, ids: this.auditData });
            if (result.code === 200) {
                this.getSearchUserList()
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
            <div className="User-container">
                <div className="title">用户信息</div>
                <SearchForm
                    FormitemValue={FormitemValue}
                    getSearchList={this.getSearchUserList.bind(this)}
                />
                {this.loading ?
                    <div className="search-result-list">
                        <UserModalForm
                            buttonlabel="新建"
                            title="新增用户"
                            getModalValue={this.addList.bind(this)}
                            getRoleData={this.loadRoleData}
                        />
                        <Button icon={<DeleteOutlined />} style={{ marginLeft: 10 }} onClick={() => this.deleteconfirm()} > 删除 </Button>
                        <Button icon={<CheckOutlined />} style={{ marginLeft: 10 }} onClick={() => this.confirm(0)} > 启用 </Button>
                        <Button icon={<StopOutlined />} style={{ marginLeft: 10 }} onClick={() => this.confirm(2)} > 禁用 </Button>
                        <UserTable
                            columns={columns}
                            dataSource={this.dataSource}
                            rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                            getExitValue={this.editList.bind(this)}
                            getdeleteValue={this.deleteList.bind(this)}
                            updateDefault={this.updateDefault.bind(this)}
                            getauditData={this.getauditData.bind(this)}
                        />
                    </div>
                    : <MySpin />
                }
            </div>
        );
    }
    
}
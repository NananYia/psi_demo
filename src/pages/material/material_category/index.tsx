import React, { Component } from "react";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, notification, TreeSelect } from "antd";
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import MySpin from "src/components/Spin";
import { deleteAction, getAction, postAction } from "src/api/manage";
import CategoryModalFormButton from './MaterialCategoryModal';
import api from "../../../api/api";
import "./index.less";

const { SHOW_PARENT } = TreeSelect;

@observer
export default class MaterialCategoryList extends Component<any, any> {
    @observable private loading: boolean = false;
    @observable private categoryTree: any = [];
    @observable private checkedData: Array<number> = [];
    @observable private isOpen: boolean = true;
    
    constructor(props) {
        super(props);
        makeObservable(this);
        this.loadTreeData()
    }
    addTreeData = async (value?, parentId?) => {
        value = {...value, parentId: parentId}
        try {
            const result: any = await postAction("/materialCategory/add", value);
            if (result.code === 200) {
                this.loadTreeData()
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    deleteTreeData = async (values?) => {
        try {
            const result: any = await deleteAction("materialCategory/deleteBatch?" + "ids=" + values.join(),null);
            if (result.code === 200) {
                this.loadTreeData()
            }
            if (result.code === 510) {
                notification.warning(result.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    loadTreeData = async()=> {
        let params:any = {};
        params.id = '';
        this.loading = false;
        try {
            const result: any = await api.queryMaterialCategoryTreeList(params);
            this.categoryTree = result;
            this.loading = true;
        } catch (error) {
            console.log(error);
        }
    }
    onChange = (value:number) => {
        console.log('checked = ', value);
        this.checkedData.push(value);
    };

    render() {
        return (
            <div className="MaterialCategory-container">
                <div className="title">商品类别</div>
                    <div className="search-result-list">
                        <CategoryModalFormButton
                            buttonlabel="添加类别"
                            title="新增商品类别"
                            getModalValue={this.addTreeData.bind(this)}
                            loadTreeData={this.categoryTree}
                        />
                    <Button icon={<DeleteOutlined />} style={{ marginRight: 10 }}
                        onClick={()=>this.deleteTreeData(this.checkedData)}
                    >
                        批量删除
                    </Button>
                    <Button icon={<RedoOutlined />} onClick={() => {this.loadTreeData() }}>
                        刷新
                    </Button>
                    {this.loading ?
                        <TreeSelect
                            treeData={this.categoryTree}
                            treeCheckable
                            showSearch={false}
                            treeDefaultExpandAll
                            showCheckedStrategy={ SHOW_PARENT }
                            placeholder='点击展开'
                            style={{ width: 500 }}
                            onChange={this.onChange}
                            open={ this.isOpen}
                            onDropdownVisibleChange={(open) => {
                                this.isOpen = open;
                            }}
                        />
                        : <MySpin />}
                    </div>
            </div>
        );
    }
}
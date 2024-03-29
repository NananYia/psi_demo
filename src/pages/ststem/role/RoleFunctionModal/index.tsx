import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { message, notification, TreeSelect } from 'antd';
import { deleteAction, getAction, postAction } from "src/api/manage";
import {  ModalForm } from '@ant-design/pro-form';
import api from "../../../../api/api";
import MySpin from '../../../../components/Spin';
import './index.less';

interface ModalFunctionFormProps {
    buttonlabel?: string;
    title?: string;
    getModalValue?: (value: any) => {}
    initialValues?: any//穿参为编辑，不传为新增
    doSearch?: () => {}
}
@observer
export default class ModalFunctionForm extends React.Component<ModalFunctionFormProps, any>{
    @observable private model = { id: "" };
    @observable private TreeValue: any;
    @observable private loadTreeData: any = [];
    @observable private isOpen: boolean = true;
    @observable private loading: boolean = false;
    @observable private categoryTree: any = [];
    @observable private checkedData: Array<number> = [];
    @observable private roleId: number;


    constructor(props) {
        super(props);
        makeObservable(this);
        // this.loadTree();
        // this.roleId = this.props.initialValues?this.props.initialValues.id:0;
    }

    waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };
    checkUserBusiness = async() => {
        try {
            const result: any = await api.checkUserBusiness({ 'type': 'RoleFunctions', 'keyId': this.roleId });
            if (result.data && result.data.id) {
                this.editUserBusiness(this.checkedData, result.data.id);
            } else {
                this.addUserBusiness(this.checkedData);
            }
        } catch (error) {
            
        }
    }
    addUserBusiness = async (value) => { 
        const params = {
            keyId: this.roleId,
            type: "RoleFunctions",
            value: value,
        }
        try {
            const result: any = await api.addUserBusiness(params);
            if (result && result.code === 200) {
                // this.props.doSearch();
            } else { 
                notification.warning({message: result.data.message})
            }
        } catch (error) {
            
        }
    }
    editUserBusiness = async (value,id) => {
        const params = {
            id: id,
            keyId: this.roleId,
            type: "RoleFunctions",
            value: value,
        }
        try {
            const result: any = await api.editUserBusiness(params);
            if (result && result.code === 200) {
                // this.props.doSearch();
            } else {

                notification.warning({ message: result.data.message })
            }
        } catch (error) {

        }
    }
    loadTree = async (id) => {
        this.roleId = id;
        this.loading = false;
        try {
            const result: any = await await getAction("/function/findRoleFunction?UBType=RoleFunctions&UBKeyId=" + this.roleId, null);
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    let temp = result[i];
                    this.categoryTree = [];
                    this.categoryTree.push(temp);
                }
                this.loading = true;
            }
        } catch (error) {
            console.log(error);
        }
    }

    onChange = (value: number) => {
        console.log('checked = ', value);
        this.checkedData = [];
        this.checkedData.push(value);
    };
    render() {
        const { initialValues } = this.props;
        return (
            <div className="FunctionModalFormText-container">
                <ModalForm<{ name: string; company: string; }>
                    title={this.props.title}
                    trigger={<a onClick = { () => this.loadTree(initialValues?initialValues.id: 0) }>分配功能</a>}
                    autoFocusFirstInput
                    modalProps={{ onCancel: () => console.log('run'), }}
                    onFinish={async (values) => {
                        await this.waitTime(1000);
                        this.checkUserBusiness()
                        message.success('提交成功');
                        return true;
                    }}
                    width={550}
                    initialValues={initialValues ? initialValues : null}
                    className="FunctionModalFormText-content"
                    
                >
                    {this.loading ?
                        <TreeSelect
                            allowClear
                            treeData={this.categoryTree}
                            treeCheckable
                            showSearch={false}
                            treeDefaultExpandAll
                            // showCheckedStrategy={SHOW_PARENT}
                            placeholder='点击展开'
                            style={{ width: 500 }}
                            onChange={this.onChange}
                            open={this.isOpen}
                            onDropdownVisibleChange={(open) => {
                                this.isOpen = open;
                            }}
                        />
                        : <MySpin />}
                </ModalForm>
            </div >
        )
    }
}
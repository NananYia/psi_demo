import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, message, TreeSelect } from 'antd';
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormTextArea,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import api from "../../../../api/api";

import './index.less'
interface CategoryModalFormButtonProps {
    buttonlabel: string;
    title: string;
    loadTreeData: any;
    getModalValue: (value: any, parentId:any) => {}
}
@observer
export default class CategoryModalFormButton extends React.Component<CategoryModalFormButtonProps, any>{
    @observable
    private model = { id: "" };
    @observable
    private TreeValue:any;

    constructor(props) {
        super(props);
        makeObservable(this);
    }
    waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };
    /**校验商品类型名称 */
    validateSupplierName = async (value: any, callback: any) => {
        let params = {
            name: value,
            id: this.model.id ? this.model.id : 0
        };
        const result: any = await api.checkMaterialCategory(params)
        if (result && result.code === 200) {
            if (!result.data.status) {
                //必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
                callback();
            } else {
                callback("名称已经存在");
            }
        } else {
            callback(result.data);
        }
    }
    onChange = value => {
        console.log(value);
        this.TreeValue = value;
    };

    render() {
        return (
            <div className="ModalFormButton-container">
                <ModalForm<{ name: string; company: string; }>
                    title={this.props.title}
                    trigger={
                        <Button type="primary">
                            <PlusOutlined /> {this.props.buttonlabel}
                        </Button>
                    }
                    autoFocusFirstInput
                    modalProps={{ onCancel: () => console.log('run'), }}
                    onFinish={async (values) => {
                        await this.waitTime(1000);
                        this.props.getModalValue(values, this.TreeValue)
                        console.log(values);
                        message.success('提交成功');
                        return true;
                    }}
                    width={450}
                    className="CategoryModalForm-content"
                >
                    <ProForm.Group>
                        <ProFormText width="md" name="name" label="名称" tooltip="最长为 24 位" placeholder="请输入名称"
                            rules={[
                                { required: true, message: '请输入供应商名称', },
                                { validator: (rule, value, callback) => { this.validateSupplierName(value, callback); } }
                            ]}
                        />
                        <ProFormText width="md" name="serialNo" label="编号" placeholder="请输入编号" />
                    </ProForm.Group>
                    {/* <ProForm.Group > */}
                    <div className="TreeSelect-title">上级目录</div>
                        <TreeSelect
                        style={{ width: 330, paddingBottom:20}}
                            value={this.TreeValue}
                            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                            treeData={this.props.loadTreeData}
                            placeholder="请选择上级目录"
                            treeDefaultExpandAll
                            onChange={this.onChange}
                        />
                    {/* </ProForm.Group> */}
                    <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入备注" />
                </ModalForm>
            </div >
        )
    }
}
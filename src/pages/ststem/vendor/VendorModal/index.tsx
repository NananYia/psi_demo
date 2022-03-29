import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, message } from 'antd';
import ProForm, { ModalForm, ProFormText, ProFormDateRangePicker, ProFormSelect,} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import api from "../../../../api/api";

import './index.less'
interface ModalFormProps {
    buttonlabel: string;
    title: string;
    getModalValue?: (value: any) => {}
    inTable?: boolean;
    initialValues?: any;
}
@observer
export default class VendorModalForm extends React.Component<ModalFormProps, any>{
    @observable
    private model = { id: "" };

    constructor(props) {
        super(props);
        makeObservable(this);
    }
    /**确认后加载状态 */
    waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };

    /**校验供应商名称 */
    validateSupplierName = async (value: any, callback: any) => {
        let params = {
            name: value,
            type: '供应商',
            id: this.model.id ? this.model.id : 0
        };
        const result: any = await api.checkSupplier(params)
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

    render() {
        return (
            <div className={this.props.inTable ? "ModalForm-container" : "ModalFormButton-container"}>
                <ModalForm<{ name: string; company: string; }>
                    title={this.props.title}
                    trigger={
                        this.props.inTable ? <a>编辑</a> :
                        <Button type="primary">
                            <PlusOutlined /> {this.props.buttonlabel}
                        </Button>
                    }
                    autoFocusFirstInput
                    modalProps={{ onCancel: () => console.log('run'), }}
                    onFinish={
                        async (values) => {
                            await this.waitTime(1000);
                            const { id, tenantId,enabled} = this.props.initialValues;
                            this.props.getModalValue({ ...values, id: id, tenantId: tenantId ,enabled:enabled})
                            console.log(values);
                            message.success('提交成功');
                            return true;
                        }
                    }
                    initialValues={this.props.inTable ? this.props.initialValues:null}
                >
                    <ProFormText width="md" name="supplier" label="供应商名称" tooltip="最长为 24 位" placeholder="请输入名称"
                        rules={[
                            { required: true, message: '请输入供应商名称', },
                            // { type: 'email', message: '请输入正确的电子邮箱', },
                            { validator: (rule, value, callback) => { this.validateSupplierName(value, callback); } }
                        ]}
                    />

                    {/* <ProForm.Group>
                        <ProFormText width="md" name="name" label="签约客户名称" tooltip="最长为 24 位" placeholder="请输入名称" />
                        <ProFormText width="md" name="company" label="我方公司名称" placeholder="请输入名称" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="md" name="contract" label="合同名称" placeholder="请输入名称" />
                        <ProFormDateRangePicker name="contractTime" label="合同生效时间" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormSelect width="xs" name="unusedMode" label="合同约定失效效方式"
                            options={[{ value: 'time', label: '履行完终止', },]}
                        />
                    </ProForm.Group>
                    <ProFormText width="sm" name="id" label="主合同编号" /> */}
                </ModalForm>
            </div >
        )
    }
}
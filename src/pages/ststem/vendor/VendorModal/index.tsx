import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, message } from 'antd';
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
interface ModalFormButtonProps {
    buttonlabel: string;
    title: string;
    getModalValue: (value: any) => {}
    initialValues?: any;
}
@observer
export default class ModalFormButton extends React.Component<ModalFormButtonProps, any>{
    @observable
    private model = { id: "" };

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

    /**校验供应商名称 */
    validateSupplierName = async (value: any, callback: any) => {
        if (this.props.initialValues.supplier === value) { callback(); }
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
        const { initialValues}= this.props;
        return (
            <div className={initialValues ? "vendorText-container" : "vendorButton-container" }>
                <ModalForm
                    title={this.props.title}
                    trigger={initialValues ? <a>编辑</a>:
                        <Button type="primary">
                            <PlusOutlined /> {this.props.buttonlabel}
                        </Button>
                    }
                    autoFocusFirstInput
                    modalProps={{ onCancel: () => console.log('run'), }}
                    onFinish={async (values) => {
                        await this.waitTime(1000);
                        this.props.getModalValue(values)
                        console.log(values);
                        message.success('提交成功');
                        return true;
                    }}
                    width={550}
                    initialValues={initialValues}
                >
                    <ProForm.Group>
                        <ProFormText width="sm" name="supplier" label="供应商名称" tooltip="最长为 24 位" placeholder="请输入名称"
                            rules={[
                                { required: true, message: '请输入供应商名称', },
                                { validator: (rule, value, callback) => { this.validateSupplierName(value, callback); } }
                            ]}
                        />
                        <ProFormText width="sm" name="contacts" label="联系人" placeholder="请输入联系人" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="telephone" label="手机号码" placeholder="请输入手机号码" />
                        <ProFormText width="sm" name="phoneNum" label="联系电话" placeholder="请输入联系电话" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="email" label="电子邮箱" placeholder="请输入电子邮箱"
                            rules={[{ type: 'email', message: '请输入正确的电子邮箱', },]}
                        />
                        <ProFormTextArea width="sm" name="description" label="备注" placeholder="请输入备注" />
                    </ProForm.Group>



                    {/* <ProForm.Group>
                        <ProFormText width="sm" name="fax" label="传真" placeholder="请输入传真" /> 
                        <ProFormText width="sm" name="beginNeedGet" label="期初应收" placeholder="请输入期初应收" />
                        <ProFormText width="sm" name="allNeedGet" label="期末应收" readonly={true} />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="taxNum" label="纳税人识别号" placeholder="请输入纳税人识别号" />
                        <ProFormText width="sm" name="taxRate" label="税率(%)" placeholder="请输入税率(%)" />
                        <ProFormText width="sm" name="bankName" label="请输入开户行" placeholder="开户行" />
                        <ProFormText width="sm" name="accountNumber" label="账号" placeholder="请输开户行入账号" />
                    </ProForm.Group> */}
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
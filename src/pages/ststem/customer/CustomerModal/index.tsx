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
    initialValues?: any;
    getModalValue: (value: any) => {}
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
    /**校验客户名称 */
    validateSupplierName = async (value: any, callback: any) => {
        let params = {
            name: value,
            type: '客户',
            id: this.model.id ? this.model.id : 0
        };
        const result: any = await api.checkSupplier(params)
        if (result && result.code === 200) {
            if (!result.data.status) {
                callback();
            } else {
                callback("名称已经存在");
            }
        } else {
            callback(result.data);
        }
    }

    render() {
        const { initialValues } = this.props;
        return (
            <div className={initialValues ? "CustomerText-container" : "CustomerButton-container"}>
                <ModalForm<{ name: string; company: string; }>
                    title={this.props.title}
                    trigger={initialValues ? <a>编辑</a> :
                        <Button type="primary">
                            <PlusOutlined /> {this.props.buttonlabel}
                        </Button>
                    }
                    autoFocusFirstInput
                    modalProps={{ onCancel: () => console.log('run'), }}
                    onFinish={async (values) => {
                        await this.waitTime(1000);
                        if (initialValues) {
                            values = { ...initialValues, ...values };
                        }
                        this.props.getModalValue(values)
                        console.log(values);
                        message.success('提交成功');
                        return true;
                    }}
                    width={550}
                >
                    <ProForm.Group>
                        <ProFormText width="sm" name="supplier" label="名称" tooltip="最长为 30 位" placeholder="请输入名称"
                            rules={[
                                { required: true, message: '请输入名称', },
                                { min: 2, max: 30, message: '长度在 2 到 30 个字符', },
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
                            rules={[ { type: 'email', message: '请输入正确的电子邮箱', }, ]}
                        />
                        <ProFormTextArea width="md" name="description" label="备注" placeholder="请输入备注" />
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
                </ModalForm>
            </div >
        )
    }
}
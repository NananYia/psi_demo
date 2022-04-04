import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, message, Select, TreeSelect } from 'antd';
import ProForm, {
    ModalForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import api from "../../../../api/api";
import './index.less';

interface ModalFormButtonProps {
    buttonlabel: string;
    title: string;
    getModalValue: (value: any) => {}
    initialValues?: {}//穿参为编辑，不传为新增
}
@observer
export default class ModalFormButton extends React.Component<ModalFormButtonProps, any>{
    @observable
    private model = { id: "" };
    @observable
    private TreeValue: any;
    @observable
    private loadTreeData: any = [];

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
    /**校验账户名称 */
    validateAccountName = async (value: any, callback: any) => {
        let params = {
            name: value,
            id: this.model.id ? this.model.id : 0
        };
        const result: any = await api.checkAccount(params)
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
    onChange = value => {
        console.log(value);
        this.TreeValue = value;
    };
    render() {
        const { initialValues } = this.props;
        return (
            <div className={initialValues ? "ModalFormText-container":"ModalFormButton-container"}>
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
                        this.props.getModalValue(values)
                        console.log(values);
                        message.success('提交成功');
                        return true;
                    }}
                    width={750}
                    initialValues={initialValues ? initialValues : null}
                >
                    <ProForm.Group>
                        <ProFormText width="md" name="name" label="名称" tooltip="最长为 24 位" placeholder="请输入名称"
                            rules={[
                                { required: true, message: '请输入供应商名称', },
                                { validator: initialValues ?null:(rule, value, callback) => { this.validateAccountName(value, callback); } }
                            ]}
                        />
                        <ProFormText width="md" name="serialNo" label="编号" placeholder="请输入编号" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="md" name="initialAmount" label="期初金额" placeholder="请输入期初金额" />
                        <ProFormText width="md" name="currentAmount" label="当前余额" placeholder="请输入当前余额" readonly />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入备注" />
                    </ProForm.Group>
                </ModalForm>
            </div >
        )
    }
}
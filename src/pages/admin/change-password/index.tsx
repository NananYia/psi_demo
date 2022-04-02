import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import store from "store";
import { USER_ID} from "../../../store/mutation-types"
import { Button, message, notification } from 'antd';
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
} from '@ant-design/pro-form';
import './index.less'
import md5 from "md5"
import { putAction } from '../../../api/manage';
@observer
export default class ChangepwdModal extends React.Component<any, any>{
    @observable
    private model = { id: "" };
    @observable
    private modelshow: boolean = true;
    @observable
    private password: boolean = true;

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
    }
    chanpwd = async (values?) => { 
        const params = {
            userId: store.get(USER_ID),
            oldpassword: md5(values.oldpassword),
            password: md5(values.password),
            confirmpassword: values.confirmpassword
        }
        try {
            const result:any = await putAction("/user/updatePwd", params)
            if (result && result.code === 200) {
                if (result.data.status === 2 || result.data.status === 3) {
                    // this.modelshow = false;
                    notification.warning({ message: result.data.message});
                } else {
                    // this.modelshow = true;
                    notification.success({ message: result.data.message });
                }
            } else {
                // this.modelshow = false;
                notification.warning({ message: result.data.message });
            }
        } catch (error) {
            
        }
    }
    validateToNextPassword(value, callback) {
        this.password = value;
        callback();
    }
    compareToFirstPassword( value, callback) {
        if (value && value !== this.password) {
            callback('两次输入的密码不一样！');
        } else {
            callback()
        }
    }
    render() {
        return (
            <div className="ChangepwdModal-container">
                <ModalForm
                    title="修改密码"
                    trigger={<a>修改密码</a>}
                    autoFocusFirstInput
                    modalProps={{ onCancel: () => console.log('run'), }}
                    onFinish={async (values) => {
                        await this.waitTime(1000);
                        this.chanpwd(values)
                        console.log(values);
                        return true;
                    }}
                    width={500}
                >
                    <ProFormText width="lg" name="oldpassword" label="旧密码" placeholder="请输入旧密码"
                        rules={[
                            { required: true, message: '请输入旧密码', },
                        ]}
                    />
                    <ProFormText width="lg" name="password" label="新密码" placeholder="请输入新密码"
                        rules={[
                            { required: true, message: '请输入新密码', },
                            { validator: (rule, value, callback) => { this.validateToNextPassword(value, callback)} }
                        ]}
                    />
                    <ProFormText width="lg" name="confirmpassword" label="确认新密码" placeholder="请确认新密码"
                        rules={[
                            { required: true, message: '请确认新密码', },
                            { validator: (rule, value, callback) => { this.compareToFirstPassword(value, callback); } }
                        ]}
                    />
                </ModalForm>
            </div >
        )
    }
}
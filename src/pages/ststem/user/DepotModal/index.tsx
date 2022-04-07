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

const { Option } = Select;
interface ModalFormButtonProps {
    buttonlabel: string;
    title: string;
    getModalValue: (value: any) => {}
    initialValues?: {}//穿参为编辑，不传为新增
    getRoleData?: []
}
@observer
export default class ModalFormButton extends React.Component<ModalFormButtonProps, any>{
    @observable
    private model = { id: "" };
    @observable
    private TreeValue: any;

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
    onChange = value => {
        console.log(value);
        this.TreeValue = value;
    };
    render() {
        const { initialValues ,getRoleData} = this.props;
        return (
            <div className={initialValues ? "ModalFormText-container":"ModalFormButton-container"}>
                <ModalForm<{ name: string; company: string; }>
                    title={this.props.title}
                    trigger={initialValues ? <div ><a>编辑</a></div>:
                        <Button type="primary" >
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
                    width={480}
                    initialValues={initialValues ? initialValues : null}
                >
                    <ProFormText width="lg" name="loginName" label="登录名称" tooltip="最长为 24 位" placeholder="请输入登录名称"
                        rules={[
                            { required: true, message: '请输入登录名称', },
                        ]}
                    />
                    <ProFormText width="lg" name="username" label="用户姓名" placeholder="请输入用户姓名"
                        rules={[
                            { required: true, message: '请输入用户姓名', },
                        ]}
                    />
                    <ProFormSelect width="lg" name="roleId" label="角色" options={getRoleData} placeholder="选择角色"
                        rules={[
                            { required: true, message: '选择角色', },
                        ]}
                    />
                    <ProFormText width="lg" name="email" label="电子邮箱" placeholder="请输入电子邮箱" />
                    <ProFormText width="lg" name="phonenum" label="电话号码" placeholder="请输入电话号码" />
                    <ProFormTextArea width="lg" name="description" label="描述" placeholder="请输入描述" />
                </ModalForm>
            </div >
        )
    }
}
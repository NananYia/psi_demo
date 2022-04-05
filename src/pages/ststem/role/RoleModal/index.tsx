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
        this.getUserList()
    }

    waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };
    /**校验角色名称 */
    validateRoleName = async (value: any, callback: any) => {
        let params = {
            name: value,
            id: this.model.id ? this.model.id : 0
        };
        const result: any = await api.checkDepot(params)
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
    /**负责人列表 */
    getUserList = async () => {
        const result: any = await api.getUserList({})
        if (result) {
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                this.loadTreeData.push({ label: element.userName,value: element.id});
            }
           
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
                    width={450}
                    initialValues={initialValues ? initialValues : null}
                >
                    <ProFormText width="md" name="name" label="角色名称" placeholder="请输入仓库名称"
                        rules={[
                            { required: true, message: '请输入角色名称', },
                            { validator: (rule, value, callback) => { this.validateRoleName(value, callback); } }
                        ]}
                    />
                    <ProFormSelect width="md" name="type" label="数据类型" placeholder="请选择数据类型"
                        // 3、本机构数据-该角色对应的用户可以看到自己所在机构的全部单据；
                        tooltip="1、全部数据-该角色对应的用户可以看到全部单据；
                        2、个人数据-该角色对应的用户只可以看到自己的单据。单据是指采购入库、销售出库等"
                        options={[{ value: '全部数据', label: '全部数据', },
                            // { value: '本机构数据', label: '本机构数据', },
                            { value: '个人数据', label: '个人数据', }]} 
                        rules={[
                            { required: true, message: '请选择数据类型', },
                        ]}
                    />
                    <ProFormTextArea width="md" name="description" label="描述" placeholder="请输入描述"
                        rules={[
                            { min: 0, max: 126, message: '长度不超过 126 个字符', },
                        ]}
                    />
                </ModalForm>
            </div >
        )
    }
}
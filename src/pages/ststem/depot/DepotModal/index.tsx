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
    /**校验仓库名称 */
    validateSupplierName = async (value: any, callback: any) => {
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
                    width={750}
                    initialValues={initialValues ? initialValues : null}
                >
                    <ProForm.Group>
                        <ProFormText width="md" name="name" label="仓库名称" tooltip="最长为 24 位" placeholder="请输入仓库名称"
                            rules={[
                                { required: true, message: '请输入供应商名称', },
                                { validator: (rule, value, callback) => { this.validateSupplierName(value, callback); } }
                            ]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="md" name="address" label="仓库地址" placeholder="请输入仓库地址" />
                        <ProFormSelect width="md" name="principal" label="负责人" options={this.loadTreeData} placeholder="请输入负责人" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="md" name="warehousing" label="仓储费" placeholder="请输入仓储费(元/天/KG)" />
                        <ProFormText width="md" name="truckage" label="搬运费" placeholder="请输入搬运费(元)" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入备注" />
                        <ProFormText width="md" name="sort" label="排序" placeholder="请输入排序" />
                    </ProForm.Group>
                </ModalForm>
            </div >
        )
    }
}
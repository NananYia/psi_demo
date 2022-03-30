import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, message, Table } from 'antd';
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import api from "../../../../api/api";
import MaterialEditableTable from '../MaterialEditableTable';
import './index.less'
interface ModalFormButtonProps {
    buttonlabel: string;
    title: string;
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
                        this.props.getModalValue(values)
                        console.log(values);
                        message.success('提交成功');
                        return true;
                    }}
                    width={1050}
                >
                    <ProForm.Group>
                        <ProFormText width="sm" name="supplier" label="名称" tooltip="最长为 24 位" placeholder="请输入名称" data-intro="名称必填，可以重复"
                            rules={[
                                { required: true, message: '请输入正确的供应商名称', },
                                { validator: (rule, value, callback) => { this.validateSupplierName(value, callback); } }
                            ]}
                        />
                        <ProFormText width="sm" name="standard" label="规格" placeholder="请输入规格" data-intro="规格不必填，比如：10克" />
                        <ProFormText width="sm" name="model" label="型号" placeholder="请输入型号" data-intro="型号是比规格更小的属性，比如：RX-01" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="unit" label="单位" placeholder="请输入单位" data-intro="单位必填，比如：克" rules={[  { required: true,}, ]}/>
                        <ProFormText width="sm" name="color" label="颜色" placeholder="请输入颜色"  />
                        <ProFormText width="sm" name="weight" label="基础重量" placeholder="请输入基础重量(kg)" />
                        <ProFormText width="sm" name="expiryNum" label="保质期" placeholder="请输入保质期(天)" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormSelect width="xs" name="categoryId" label="类别"
                            options={[{ value: '1', label: '有', }, { value: '2', label: '无', }]}
                        />
                        <ProFormSelect width="xs" name="enableSerialNumber" label="有无序列号"
                            options={[{ value: '1', label: '有', }, { value: '2', label: '无', }]}
                        />
                        <ProFormSelect width="xs" name="enableBatchNumber" label="有无批号"
                            options={[{ value: '1', label: '有', }, { value: '2', label: '无', }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <MaterialEditableTable/>
                    </ProForm.Group>
                </ModalForm>
            </div >
        )
    }
}
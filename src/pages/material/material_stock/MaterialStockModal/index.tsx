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
// import MaterialEditableTable from '../MaterialEditableTable';
import './index.less'
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
    private editabledata:any = {};
    @observable
    private editrowdata:any = {};

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

    /**校验商品名称 */
    validateSupplierName = async (value: any, callback: any) => {
        let params = {
            name: value,
            type: '商品',
            id: this.model.id ? this.model.id : 0
        };
        const result: any = await api.checkDepot(params)
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

    /**拿到子表格信息 */
    getEditableTabl = (id?,data?, row?) => { 
        this.editabledata = data;
        this.editrowdata = row;
        return true
    }

    render() {
        const { initialValues } = this.props;
        return (
            <div className={initialValues ?"ModalFormaText-container":"ModalFormButton-container"}>
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
                        const allValues = {
                            name: values.name,
                            standard: values.standard,
                            model: values.model || "",
                            unit: values.unit,
                            unitId: values.unitId || "",
                            color: values?.color || "",
                            weight: values.weight  || "",
                            expiryNum: values?.expiryNum || null,
                            meList: [
                                {
                                    id: this.editabledata?.id || null,
                                    barCode: this.editabledata?.mBarCode || "",
                                    commodityUnit: values.unit || "",
                                    sku: "",
                                    purchaseDecimal: this.editabledata?.purchase ||"",
                                    commodityDecimal: this.editabledata?.commodity ||"",
                                    wholesaleDecimal: this.editabledata.wholesale ||"",
                                    lowDecimal: this.editabledata?.low || ""
                                }
                                // this.editabledata.map((item) => { 
                                //     return {
                                //         id:  item?.id || null,
                                //         barCode:  item?.mBarCode || "",
                                //         commodityUnit: values.unit || "",
                                //         sku: "",
                                //         purchaseDecimal:  item?.purchase ||"",
                                //         commodityDecimal:  item?.commodity ||"",
                                //         wholesaleDecimal:  item.wholesale ||"",
                                //         lowDecimal: item?.low || ""
                                //     }
                                // })
                                
                            ],
                            stock: [],
                            sortList: [],
                            imgName: values?.imgName || ""
                        }
                        if (initialValues) {
                            this.props.getModalValue({ ...allValues, id: values.id})
                        } else { 
                            this.props.getModalValue(allValues)
                        }
                        console.log("allValues===>", allValues);
                        message.success('提交成功');
                        return true;
                    }}
                    width={1050}
                    initialValues={initialValues?this.props.initialValues:null}
                >
                    <ProForm.Group>
                        <ProFormText width="sm" name="name" label="名称" tooltip="最长为 24 位" placeholder="请输入名称" data-intro="名称必填，可以重复"
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
                    {/* <ProForm.Group>
                        <ProFormSelect width="xs" name="categoryId" label="类别" options={[{ value: '1', label: '有', }, { value: '2', label: '无', }]}/>
                        <ProFormSelect width="xs" name="enableSerialNumber" label="有无序列号" options={[{ value: '1', label: '有', }, { value: '2', label: '无', }]}/>
                        <ProFormSelect width="xs" name="enableBatchNumber" label="有无批号"  options={[{ value: '1', label: '有', }, { value: '2', label: '无', }]}/>
                    </ProForm.Group> */}
                    {/* <ProForm.Group>
                        <MaterialEditableTable getEditableValue={this.getEditableTabl.bind(this)}/>
                    </ProForm.Group> */}
                </ModalForm>
            </div >
        )
    }
}
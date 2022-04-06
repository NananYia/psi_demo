import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, Cascader, DatePicker, Input, message, notification, Table, TimePicker, TreeSelect } from 'antd';
import addInitUtil from "../../mixins/addInit"
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormDateTimePicker,
    ProFormTextArea,
    ProFormUploadButton,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import api from "../../../../api/api";
import PurchaseOrderEditableTable from '../SaleOutEditableTable';
import './index.less'
import { getAction } from '../../../../api/manage';
interface ModalFormButtonProps {
    buttonlabel: string;
    title: string;
    getModalValue: (value: any) => {}
    initialValues?: {}//穿参为编辑，不传为新增
    getAccountData?: any[]
    getcustomerData?: any[]
}
@observer
export default class ModalFormButton extends React.Component<ModalFormButtonProps, any>{
    @observable private model = { id: "" };
    @observable private editabledata:any = {};
    @observable private editrowdata: any = {};
    @observable private TreeValue: any;
    @observable private customerData: any=[];
    @observable private number: string;//单据编号
    @observable private timeopen: boolean = false;
    private prefixNo = 'XSCK';

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
    /**拿到编号 */
    buildNumber = async (amountNum) => {
        const result: any = await getAction('/sequence/buildNumber');
        if (result && result.code === 200) {
            this.number = amountNum + result.data.defaultNumber;
        }
    }
    /**拿到客户列表 */
    getCustomerName = async () => {
        try {
            const result: any = await api.findBySelectCus({});
            result.map((item) => {
                const dataitem = {
                    value: item.supplier,
                    id: item.id
                }
                return this.customerData.push(dataitem)
            })
        } catch (error) {
            console.log(error);
        }
    }
    /**拿到子表格信息 */
    getEditableTabl = (id?,data?, row?) => { 
        this.editabledata = data;
        this.editrowdata = row;
        return true
    }
    /**拿到客户信息 */
    onChange = value => {
        console.log(value);
        this.TreeValue = value;
    };
    ondateChange(date, dateString) {
        console.log(date, dateString);
    }
    onClick = () => {
        this.buildNumber(this.prefixNo)
        this.getCustomerName()
    }
    render() {
        const { initialValues, getAccountData, getcustomerData } = this.props;
        return (
            <div className={initialValues ?"ModalFormaText-container":"ModalFormButton-container"}>
                <ModalForm
                    className="saleout-modal-form"
                    title={this.props.title}
                    trigger={initialValues ? <a onClick={() => this.onClick()}>编辑</a>:
                        <Button type="primary" onClick={() => this.onClick()} >
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
                    width={1200}
                    initialValues={initialValues?initialValues:null}
                >
                    <ProForm.Group>
                        <ProFormSelect width="sm" name="organId" label="客户" placeholder="请选择客户" options={getcustomerData} />
                        <ProFormDateTimePicker name="operTime" label="单据日期" />
                        <ProFormText initialValue={this.number} width="sm" name="number" label="单据编号" readonly tooltip="单据编号自动生成、自动累加、开头是单据类型的首字母缩写，累加的规则是每次打开页面会自动占用一个新的编号" />
                        <ProFormTextArea width="sm" name="remark" label="备注" placeholder="请输入备注" style={{ height: 32 }} />
                        <ProFormUploadButton width="sm" name="fileName" label="附件" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <PurchaseOrderEditableTable getEditableValue={this.getEditableTabl.bind(this)} />
                    </ProForm.Group>
                </ModalForm>
            </div >
        )
    }
}
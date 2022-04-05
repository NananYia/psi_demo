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
import PurchaseOrderEditableTable from '../PurchaseInEditableTable';
import './index.less'
import { getAction } from '../../../../api/manage';
interface ModalFormButtonProps {
    buttonlabel: string;
    title: string;
    getModalValue: (value: any) => {}
    initialValues?: {}//穿参为编辑，不传为新增
    getAccountData?: any[]
    getsupplierData?: any[]
}
@observer
export default class ModalFormButton extends React.Component<ModalFormButtonProps, any>{
    @observable private model = { id: "" };
    @observable private editabledata:any = [];
    @observable private editrowdata: any = {};
    @observable private TreeValue: any;
    @observable private supplierData: any=[];
    @observable private number: string;//单据编号
    @observable private timeopen: boolean = false;

    private prefixNo = 'CGRK';

    constructor(props) {
        super(props);
        makeObservable(this);
        // this.buildNumber(this.prefixNo)
        // this.getSupplierName();
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
    /**拿到子表格信息 */
    getEditableTabl = (id?, data?, row?) => { 
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const datatype = {
                id: element.id || "",
                depotId: element.depotId || "",
                name: element.name || "",
                standard: element.standard || "",
                model: element.model || "",
                color: element.color || "",
                materialOther: element.materialOther || "",
                stock: element.stock || 0,
                unit: element.unit || "",
                sku: element.sku || "",
                operNumber: element.operNumber || 0,
                unitPrice: element.unitPrice || 0,
                allPrice: element.allPrice || 0,
                taxRate: element.taxRate || 0,
                taxMoney: element.taxMoney || 0,
                taxLastMoney: element.taxLastMoney || 0,
                remark: element.remark || "",
                orderNum: element.orderNum || 0,
                barCode: element.barCode ||"",
            }
            this.editabledata.push(datatype);
        }
        
        this.editrowdata = row;
        return true
    }
    /**拿到供应商信息 */
    onChange = value => {
        console.log(value);
        this.TreeValue = value;
    };
    ondateChange(date, dateString) {
        console.log(date, dateString);
    }

    render() {
        const { initialValues ,getAccountData,getsupplierData} = this.props;
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
                            info: {
                                organId: values.organId,
                                operTime: values.operTime,
                                number: values.number || "",
                                discount: values.discount || 0,
                                discountMoney: values.unitId || 0,
                                discountLastMoney: values?.discountLastMoney || 0,
                                // type: "其它",
                                // subType: "采购订单",
                                // defaultNumber: this.number,
                                // totalPrice: values?.totalPrice || 0,
                                // fileName: values?.fileName || "",
                            },
                            rows: {
                                ...this.editabledata
                            },
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
                    width={1500}
                    initialValues={initialValues?initialValues:null}
                >
                    <ProForm.Group>
                        <ProFormSelect width="sm" name="organId" label="供应商" placeholder="请选择供应商" options={getsupplierData}/>
                        <ProFormDateTimePicker name="operTime" label="单据日期" />
                        <ProFormText width="sm" name="linkNumber" label="关联订单" placeholder="请选择关联订单" />
                        <ProFormText initialValue={this.number} width="sm" name="number" label="单据编号" readonly tooltip="单据编号自动生成、自动累加、开头是单据类型的首字母缩写，累加的规则是每次打开页面会自动占用一个新的编号" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <PurchaseOrderEditableTable getEditableValue={this.getEditableTabl.bind(this)}/>
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormTextArea width="sm" name="remark" label="备注" placeholder="请输入备注" style={{height:32}}/>
                        <ProFormText width="sm" name="discount" label="优惠率" placeholder="请输入优惠率(%)" />
                        <ProFormText width="sm" name="discountMoney" label="付款优惠" placeholder="请输入付款优惠" />
                        <ProFormText width="sm" name="discountLastMoney" label="优惠后金额" placeholder="请输入优惠后金额" />
                        <ProFormText width="sm" name="otherMoney" label="其它费用" placeholder="请输入其它费用" />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormSelect width="sm" name="accountId" label="结算账户" placeholder="选择结算账户" options={getAccountData} />
                        <ProFormText width="sm" name="changeAmount" label="本次付款" placeholder="请输入本次付款" />
                        <ProFormText width="sm" name="debt" label="本次欠款" placeholder="请输入本次欠款" />
                        <ProFormUploadButton width="sm" name="debt" label="附件" />
                    </ProForm.Group>
                </ModalForm>
            </div >
        )
    }
}
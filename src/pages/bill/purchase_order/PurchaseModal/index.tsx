import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx';
import store from "store";
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
import PurchaseOrderEditableTable from '../PurchaseEditableTable';
import { getAction } from '../../../../api/manage';
import MySpin from '../../../../components/Spin';
import './index.less'
import { filterObj, getMpListShort } from '../../../../utils/util';
import PurchaseinModelTable from '../PurchaseinModelTable';
interface ModalFormButtonProps {
    buttonlabel: string;
    title: string;
    getModalValue: (value: any) => {}
    initialValues?: {}//穿参为编辑，不传为新增
    getAccountData?: any[]
    getsupplierData?: any[]
    getMaterialData?: any[]
}
@observer
export default class ModalFormButton extends React.Component<ModalFormButtonProps, any>{
    @observable private model = { id: "" };
    @observable private editabledata: any = [];
    @observable private curMaterialdata: any = {};
    @observable private editrowdata: any = {};
    @observable private TreeValue: any;
    @observable public auditData: any = {};//字表信息
    @observable private supplierData: any = [];
    // @observable private DepotData: any = [];
    @observable private number: string;//单据编号
    @observable private timeopen: boolean = false;

    private prefixNo = 'CGRK';
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
    /**拿到供应商列表 */
    getSupplierName = async () => {
        try {
            const result: any = await api.findBySelectSup({});
            result.map((item) => {
                const dataitem = {
                    label: item.supplier,
                    value: item.id,
                }
                return this.supplierData.push(dataitem)
            })
            // this.supplierData = result;
        } catch (error) {
            console.log(error);
        }
    }
    /**拿到编号 */
    buildNumber = async (amountNum) => {
        const result: any = await getAction('/sequence/buildNumber');
        if (result && result.code === 200) {
            this.number = amountNum + result.data.defaultNumber;
        }
    }
    /**拿到子表格信息 */
    getEditableTable = (values?, data?, row?) => { 
        this.curMaterialdata = this.props.getMaterialData.find((item) => {
            return item.mBarCode = this.auditData
        })
        this.editabledata[0]={
            id: this.curMaterialdata.id || "",
            depotId: 21,
            name: this.curMaterialdata.name || "",
            standard: this.curMaterialdata.standard || "",
            model: this.curMaterialdata.model || "",
            color: this.curMaterialdata.color || "",
            materialOther: this.curMaterialdata.materialOther || "",
            stock: this.curMaterialdata.stock || 0,
            unit: this.curMaterialdata.unit || "",
            snList: this.curMaterialdata.snList || "",
            batchNumber: this.curMaterialdata.batchNumber || "",
            expirationDate: this.curMaterialdata.expirationDate || "",
            sku: this.curMaterialdata.sku || "",
            preNumber: this.curMaterialdata.preNumber || "",
            finishNumber: this.curMaterialdata.finishNumber ||"",
            operNumber: values.operNumber || 0,
            unitPrice: this.curMaterialdata.unitPrice || 0,
            allPrice: this.curMaterialdata.allPrice || 0,
            taxRate: this.curMaterialdata.taxRate || 0,
            taxMoney: this.curMaterialdata.taxMoney || 0,
            taxLastMoney: this.curMaterialdata.taxLastMoney || 0,
            remark: this.curMaterialdata.remark || "",
            orderNum: this.curMaterialdata.orderNum || 0,
            barCode: this.curMaterialdata.mBarCode || "",
        }
        const allValues = {
            formValue: {
                organId: values.organId,
                operTime: values.operTime,
                number: values.number || "",
                discount: values.discount || 0,
                discountMoney: values.unitId || 0,
                discountLastMoney: values?.discountLastMoney || 0,
                otherMoney: values.otherMoney || 0,
                changeAmount: values.changeAmount || 0,
                debt: values.debt || 0,
                remark: values.remark || "",
            },
            tablesValue: {
                values: this.editabledata,
            }
        }
        if (this.props.initialValues) {
            this.props.getModalValue({ ...allValues, id: values.id })
        } else {
            this.props.getModalValue(allValues)
        }
    }
    /**拿到供应商信息 */
    onChange = value => {
        console.log(value);
        this.TreeValue = value;
    };
    onClick = () => {
        this.buildNumber(this.prefixNo)
        this.getSupplierName()
    }
    /**子表的信息mbarCode */
    getauditData = (value) => {
        this.auditData = []
        this.auditData = value.join();
    }
    render() {
        const { initialValues, getMaterialData,getsupplierData} = this.props;
        return (
            <div className={initialValues ?"ModalFormaText-container":"ModalFormButton-container"}>
                <ModalForm
                    className="purchasein-content"
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
                        this.getEditableTable(values)
                        console.log("values===>", values);
                        message.success('提交成功');
                        return true;
                    }}
                    width={900}
                    initialValues={initialValues?initialValues:null}
                >
                    {this.number ?
                        <ProForm.Group>
                            <ProForm.Group>
                                <ProFormSelect width="sm" name="organId" label="供应商" placeholder="请选择供应商" options={getsupplierData} />
                                <ProFormDateTimePicker name="operTime" label="单据日期" />
                                <ProFormText initialValue={this.number} width="sm" name="number" label="单据编号" readonly tooltip="单据编号自动生成、自动累加、开头是单据类型的首字母缩写，累加的规则是每次打开页面会自动占用一个新的编号" />
                            </ProForm.Group>
                            <ProForm.Group>
                                <ProFormText width="sm" name="operNumber" label="采购数量" />
                                <ProFormTextArea width="sm" name="remark" label="备注" placeholder="请输入备注" style={{ height: 32 }} />
                                <ProFormUploadButton width="sm" name="debt" label="附件" />
                            </ProForm.Group>
                            <ProForm.Group>
                                {initialValues ? null
                                    : <PurchaseinModelTable
                                        dataSource={getMaterialData}
                                        rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                                        getselectData={this.getauditData.bind(this)}
                                    />
                                }
                            </ProForm.Group>
                        </ProForm.Group>
                        : <MySpin />}
                </ModalForm>
            </div >
        )
    }
}
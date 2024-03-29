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
import MySpin from '../../../../components/Spin';
import SaleOutinModelTable from '../SaleOutinModelTable';
import PurchaseinModelTable from '../../purchase_in/PurchaseinModelTable';
interface ModalFormButtonProps {
    buttonlabel: string;
    title: string;
    getModalValue: (value: any) => {}
    initialValues?: {}//穿参为编辑，不传为新增
    getAccountData?: any[]
    getcustomerData?: any[]
    getMaterialData?: any[]
    getVoucherData?: any[]
    getDepotData?: any[]
}
@observer
export default class ModalFormButton extends React.Component<ModalFormButtonProps, any>{
    @observable private model = { id: "" };
    @observable private curMaterialdata: any = {};
    @observable private editabledata: any = [];
    @observable private editrowdata: any = {};
    @observable private TreeValue: any;
    @observable private customerData: any=[];
    @observable private number: string;//单据编号
    @observable public auditData: any = {};//字表信息
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
    /**拿到选中单据对应信息 */
    loadVoucherData = async (values?) => {
        var params = {
            headerId: this.auditData.split(",")[0],
            mpList: ""
        }
        try {
            const result: any = await getAction("depotItem/getDetailList", params);
            if (result.code === 200) {
                this.curMaterialdata = result.data.rows;
                this.getEditableTable(values);
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
            // this.loading = true;
        } catch (error) {
            console.log(error);
        }
    }
    /**拿到子表格信息 */
    getEditableTable = (values?, data?, row?) => {
        for (let index = 0; index < this.curMaterialdata.length; index++) {
            this.editabledata[index] = {
                id: this.curMaterialdata[index].id || "",
                name: this.curMaterialdata[index].name || "",
                standard: this.curMaterialdata[index].standard || "",
                model: this.curMaterialdata[index].model || "",
                color: this.curMaterialdata[index].color || "",
                materialOther:"",
                stock: this.curMaterialdata[index].stock || 0,
                unit: this.curMaterialdata[index].unit || "",
                snList:"",
                batchNumber: this.curMaterialdata[index].batchNumber || "",
                expirationDate: this.curMaterialdata[index].expirationDate || "",
                sku: this.curMaterialdata[index].sku || "",
                preNumber: this.curMaterialdata[index].preNumber || 0,
                finishNumber: this.curMaterialdata[index].finishNumber || "",
                operNumber: this.curMaterialdata[index].preNumber|| 0,//出库数量同步销售订单数量
                unitPrice: this.curMaterialdata[index].unitPrice || 0,
                allPrice: this.curMaterialdata[index].allPrice || 0,
                taxRate: "0",
                taxMoney: "0",
                taxLastMoney:"0",
                remark: this.curMaterialdata[index].remark || "",
                orderNum: this.curMaterialdata[index].orderNum || 0,
                depotId: values.depotId || "",
                barCode: this.curMaterialdata[index].barCode || "",
            }
        }
        const allValues = {
            formValue: {
                organId: values.organId,
                operTime: values.operTime,
                number: values.number || "",
                linkNumber: this.props.getVoucherData.find((item) => { return item.id = this.auditData[0] }).number || 0,
                discount: values.discount || 0,
                discountMoney: values.unitId || 0,
                discountLastMoney: values?.discountLastMoney || 0,
                otherMoney: values.otherMoney || 0,
                accountId: 24,//默认账户
                changeAmount: values.changeAmount || 0,
                debt: values.debt || 0,
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
    /**子表的信息mbarCode */
    getauditData = (value) => {
        this.auditData = []
        this.auditData = value.join();
    }
    render() {
        const { initialValues, getAccountData, getVoucherData, getcustomerData, getDepotData } = this.props;
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
                        values.depotId = getDepotData.find(value => value.value === values.depotId).id;
                        this.loadVoucherData(values)
                        console.log("values===>", values);
                        message.success('提交成功');
                        return true;
                    }}
                    width={1200}
                    initialValues={initialValues?initialValues:null}
                >
                    {this.number ?
                        <ProForm.Group>
                            <ProForm.Group>
                                <ProFormSelect width="sm" name="organId" label="客户" placeholder="请选择客户" options={getcustomerData} />
                                <ProFormSelect width="sm" name="depotId" label="仓库" placeholder="请选择仓库" options={getDepotData} />
                                <ProFormDateTimePicker name="operTime" label="单据日期" />
                                <ProFormText initialValue={this.number} width="sm" name="number" label="单据编号" readonly tooltip="单据编号自动生成、自动累加、开头是单据类型的首字母缩写，累加的规则是每次打开页面会自动占用一个新的编号" />
                               </ProForm.Group>
                            <ProForm.Group>
                                {/* <ProFormText width="sm" name="operNumber" label="销售数量" /> */}
                                <ProFormTextArea width="sm" name="remark" label="备注" placeholder="请输入备注" style={{ height: 32 }} />
                                {/* <ProFormUploadButton width="sm" name="fileName" label="附件" /> */}
                            </ProForm.Group>
                            <ProForm.Group>
                                {initialValues ? null
                                    : <PurchaseinModelTable
                                        type="客户"
                                        dataSource={getVoucherData}
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
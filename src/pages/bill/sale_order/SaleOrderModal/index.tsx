import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, Cascader, DatePicker, Input, message, notification, Spin, Table, TimePicker, TreeSelect } from 'antd';
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
import { getAction } from '../../../../api/manage';
import PurchaseinModelTable from '../../purchase_order/PurchaseinModelTable';
import './index.less'
interface ModalFormButtonProps {
    buttonlabel: string;
    title: string;
    getModalValue: (value: any) => {}
    initialValues?: {}//穿参为编辑，不传为新增
    getMaterialData?: any[]
    getCustomerName?: any[]
    getPersonData?: any[]
}
@observer
export default class ModalFormButton extends React.Component<ModalFormButtonProps, any>{
    @observable editabledata:any = [];
    @observable number: string;//单据编号
    @observable private curMaterialdata: any = {};
    @observable public auditData: any;//字表信息
    @observable loading: boolean = false;
    @observable detailDataSource: any = {};

    private prefixNo = 'XSDD';

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
    /**拿到子表格信息 */
    getEditableTable = (values?, data?, row?) => {
        for (let index = 0; index < this.auditData.split(",").length; index++) {
            this.curMaterialdata = this.props.getMaterialData.find((item) => {
                return item.mBarCode = this.auditData.split(",")[index]
            })
            this.editabledata[index] = {
                id: this.curMaterialdata.id || "",
                depotId: this.curMaterialdata.depotId || "",
                name: this.curMaterialdata.name || "",
                standard: this.curMaterialdata.standard || "",
                model: this.curMaterialdata.model || "",
                color: this.curMaterialdata.color || "",
                materialOther: this.curMaterialdata.materialOther || "",
                stock: this.curMaterialdata.stock || 0,
                unit: this.curMaterialdata.unit || "",
                sku: this.curMaterialdata.sku || "",
                operNumber: values.operNumber || 0,
                unitPrice: this.curMaterialdata.unitPrice || 0,
                allPrice: values.allPrice || 0,
                taxRate: this.curMaterialdata.taxRate || 0,
                taxMoney: this.curMaterialdata.taxMoney || 0,
                taxLastMoney: this.curMaterialdata.taxLastMoney || 0,
                remark: this.curMaterialdata.remark || "",
                orderNum: this.curMaterialdata.orderNum || 0,
                barCode: this.curMaterialdata.mBarCode || "",
            }
        }
        const allValues = {
            formValue: {
                organId: values.organId || "",
                operTime: values.operTime,
                number: values.number || "",
                discount: values.discount || 0,
                discountMoney: values.unitId || 0,
                discountLastMoney: values?.discountLastMoney || 0,
                salesMan: values?.salesMan || "",
                // totalPrice: values?.allPrice * this.auditData.split(",").length || 0,
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
    onClick = () => {
        this.buildNumber(this.prefixNo)
    }
    /**子表的信息mbarCode */
    getauditData = (value) => {
        this.auditData = []
        this.auditData = value.join();
    }
    render() {
        const { initialValues, getMaterialData ,getCustomerName,getPersonData} = this.props;
        return (
            <div className={initialValues ?"ModalFormaText-container":"ModalFormButton-container"}>
                <ModalForm
                    className="sale-order-modal"
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
                        values.organId = getCustomerName.find(value => value.value === values.organId).id;
                        values.salesMan = getPersonData.find(value => value.value === values.salesMan).id;
                        this.getEditableTable(values)
                        console.log("values===>", values);
                        message.success('提交成功');
                        return true;
                    }}
                    width={1200}
                    initialValues={initialValues?initialValues:null}
                >
                    <ProForm.Group>
                        <ProFormSelect width="sm" name="organId" label="客户" placeholder="请选择客户" options={getCustomerName}/>
                        <ProFormDateTimePicker name="operTime" label="单据日期"/>
                        <ProFormText initialValue={this.number} width="sm" name="number" label="单据编号" readonly tooltip="单据编号自动生成、自动累加、开头是单据类型的首字母缩写，累加的规则是每次打开页面会自动占用一个新的编号" />
                        <ProFormSelect width="sm" name="salesMan" label="销售人员" placeholder="请选择销售人员" options={getPersonData} />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="operNumber" label="销售数量" />
                        <ProFormTextArea width="sm" name="remark" label="备注" placeholder="请输入备注" style={{ height: 32 }} />
                        <ProFormTextArea width="sm" name="allPrice" label="金额" placeholder="请输入总金额" style={{ height: 32 }} />
                    </ProForm.Group>
                    <ProForm.Group>
                        {initialValues ? null
                            // this.detailDataSource === {} ?
                            //     <PurchaseinModelTable
                            //         dataSource={this.detailDataSource}
                            //         rowSelection={false}
                            //     />
                            //     : <Spin />
                            : <PurchaseinModelTable
                                dataSource={getMaterialData}
                                getselectData={this.getauditData.bind(this)}
                            />
                        }
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormUploadButton width="sm" name="debt" label="附件" />
                    </ProForm.Group>
                </ModalForm>
            </div >
        )
    }
}
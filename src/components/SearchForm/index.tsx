import React, { useState } from 'react';
import { observer } from 'mobx-react'
import { FormInstance } from 'antd/es/form';
import { makeObservable, observable } from 'mobx'
import { Form, Row, Col, Input, Button, DatePicker } from 'antd';
import './index.less';
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm' || undefined;

interface DataType {
    FormitemValue: any;
    getSearchList: (value: any) => {}
}
@observer
export default class SearchForm extends React.Component<DataType, any>{ 
    @observable
    private expand: any = false;
    @observable
    private FormitemValue: any;
    @observable
    private beginTime: undefined;//开始时间
    @observable
    private endTime: undefined;  //结束时间

    private formRef = React.createRef<FormInstance>();

    constructor(props) {
        super(props);
        makeObservable(this);
        this.FormitemValue = this.props.FormitemValue;
    }

    onFinish = (values) => {
        console.log('Received values of form: ', values);
        this.props.getSearchList({ ...values, createTimeRange: [moment(this.beginTime, dateFormat), moment(this.endTime, dateFormat)],beginTime:this.beginTime,endTime:this.endTime})
    };

    onReset = () => {
        this.formRef.current!.resetFields();
    };
    //切换tab的时候的回调函数
    tabChange = (activeKey) => {
        this.beginTime = undefined;//开始时间
        this.endTime = undefined; //结束时间
    }

    //时间改变的方法
    onPickerChange = (date, dateString) => {
        console.log("data", date, "dateString", dateString);
        //这两个参数值antd自带的参数
        console.log("dateString", dateString[0], "dateString", dateString[1]);
        this.beginTime = dateString[0];//开始时间
        this.endTime = dateString[1]; //结束时间
    }
    AdvancedSearchForm = () => { 
        return (
            <Form
                ref={this.formRef}
                name="advanced_search"
                className="ant-advanced-search-form"
                onFinish={this.onFinish}
            >
                <Row gutter={24}>
                    {
                        this.FormitemValue.map((item, index) => {
                            if (item.queryParam === "createTimeRange") {
                                return (
                                    <Col span={8} key={index}>
                                        <Form.Item name={item.queryParam} label={item.text}>
                                            <RangePicker
                                                onChange={this.onPickerChange}
                                                placement="bottomLeft"
                                                format={dateFormat}
                                                value={this.beginTime === undefined || this.endTime === undefined || this.beginTime === "" || this.endTime === "" ? null : [moment(this.beginTime, dateFormat), moment(this.endTime, dateFormat)]}
                                                placeholder={['开始时间', '结束时间']}
                                            />
                                        </Form.Item>
                                    </Col>
                                )
                            } else {
                                return (
                                    <Col span={8} key={index}>
                                        <Form.Item name={item.queryParam} label={item.text} rules={[{ message: 'Input something!', },]} >
                                            <Input placeholder={item.placeholder} />
                                        </Form.Item>
                                    </Col>
                                )
                             } 
                        })
                    }
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right', }} >
                        <Button type="primary" htmlType="submit"> 查询 </Button>
                        <Button style={{  margin: '0 8px', }} onClick={() => { this.onReset() }} > 重置 </Button>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        return (
            <div className="SearchForm-container">
                {this.AdvancedSearchForm()}
            </div >
        )
    }
}
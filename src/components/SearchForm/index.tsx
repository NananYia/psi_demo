import React from 'react';
import { observer } from 'mobx-react'
import { FormInstance } from 'antd/es/form';
import { makeObservable, observable } from 'mobx'
import { Form, Row, Col, Input, Button, DatePicker, Select, Space, Cascader } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './index.less'; 

import type { DatePickerProps } from 'antd';

const { Option } = Select;
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
    @observable
    private isShowAll: boolean = true; //展开关闭
    @observable
    private monthTime: any;  //月份时间

    private formRef = React.createRef<FormInstance>();

    constructor(props) {
        super(props);
        makeObservable(this);
        this.FormitemValue = this.props.FormitemValue;
    }

    onFinish = (values) => {
        console.log('Received values of form: ', values);
        this.props.getSearchList({
            ...values,
            createTimeRange: [moment(this.beginTime, dateFormat), moment(this.endTime, dateFormat)],
            beginTime: this.beginTime,
            endTime: this.endTime,
            monthTime: this.monthTime,
        })
    };

    onReset = () => {
        this.formRef.current!.resetFields();
    };

    //时间改变的方法
    onPickerChange = (date, dateString) => {
        console.log("data", date, "dateString", dateString);
        //这两个参数值antd自带的参数
        console.log("dateString", dateString[0], "dateString", dateString[1]);
        this.beginTime = dateString[0];//开始时间
        this.endTime = dateString[1]; //结束时间
    }
    //月份
    onMonthChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        this.monthTime = date;
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
                    {this.isShowAll ?
                        this.FormitemValue.map((item, index) => {
                            if (index < 3) { 
                                if (item.type === "cascader") {
                                    return (
                                        <Col span={8} key={index}>
                                            <Form.Item name={item.queryParam} label={item.text}>
                                                <Cascader style={{ width: '70%' }} options={item.options} placeholder="Select Address" />
                                            </Form.Item>
                                        </Col>
                                    )
                                } else if (item.type === "select") {
                                    return (
                                        <Col span={8} key={index}>
                                            <Form.Item name={item.queryParam} label={item.text}>
                                                <Select>
                                                    {item.options.map((option, index) => {
                                                        return <Option key={index} value={option.id}>{option.value}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    )
                                } else if (item.type === "dateRange") {
                                    return (
                                        <Col span={8} key={index}>
                                            <Form.Item name={item.queryParam} label={item.text}>
                                                {/* <DatePicker onChange={this.onMonthChange} locale={locale} picker="month" /> */}
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
                            }
                        })
                    :
                        this.FormitemValue.map((item, index) => {
                            if (item.type === "select") { 
                                return (
                                    <Col span={8} key={index}>
                                        <Form.Item name={item.queryParam} label={item.text}>
                                            <Select>
                                                {item.options.map((option, index) => {
                                                    return <Option key={index} value={option.id}>{option.value}</Option>
                                                }) }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )
                            } else if (item.type === "dateRange") {
                                return (
                                    <Col span={8} key={index}>
                                        <Form.Item name={item.queryParam} label={item.text}>
                                            {/* <Space direction="vertical">
                                                <DatePicker onChange={this.onMonthChange} locale={locale} picker="month" />
                                            </Space> */}
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
                        <Button style={{ margin: '0 8px', }} onClick={() => { this.onReset() }} > 重置 </Button>
                        {this.FormitemValue.length > 3 && 
                            <a onClick={() => { this.isShowAll = !this.isShowAll }}>{this.isShowAll ? "展开" : "收起"}</a>
                        }
                        {this.FormitemValue.length > 3 ?
                            this.isShowAll ? <DownOutlined style={{ color: '#1890ff' }} /> : <UpOutlined style={{ color: '#1890ff' }} />
                            : null
                        }
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
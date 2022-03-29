import React, { useState } from 'react';
import { observer } from 'mobx-react'
import { FormInstance } from 'antd/es/form';
import { makeObservable, observable } from 'mobx'
import { Form, Row, Col, Input, Button, Select } from 'antd';
import './index.less'

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

    private formRef = React.createRef<FormInstance>();

    constructor(props) {
        super(props);
        makeObservable(this);
        this.FormitemValue = this.props.FormitemValue;
    }

    onFinish = (values) => {
        console.log('Received values of form: ', values);
        this.props.getSearchList(values)
    };

    onReset = () => {
        this.formRef.current!.resetFields();
    };

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
                            return (
                                <Col span={8} key={index}>
                                    <Form.Item name={item.queryParam} label={item.text} rules={[{ message: 'Input something!', },]} >
                                        <Input placeholder={item.placeholder} />
                                    </Form.Item>
                                </Col>
                            )
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
import React, { Component, useState } from 'react';
import { Card, Row, Col, } from 'antd';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import ReactEcharts from 'echarts-for-react';
import "./line.less";

@observer
export default class HomeLine extends Component<any, any> {

    @observable xdate: any = [];
    @observable ydate: any = [];
    @observable title: any = [];

    constructor(props) { 
        super(props);
        this.title=props.title;
        const date = props.dataSource;
        for (let index = 0; index < date.length; index++) {
            this.xdate[index] = date[index].x;
            this.ydate[index] = date[index].y;
        }
    }
    // 配置对象
    getOption = (sal?, sto?) => {
        return {
            title: {
                text: this.title
            },
            tooltip: {},
            legend: {
                data: ['金额']
            },
            xAxis: {
                data: this.xdate
            },
            yAxis: {
                // data: [0,500,1000,1500,2000,2500]
            },
            series: [
                {
                    name: '金额',
                    type: 'line',
                    data: this.ydate
                },
            ]
        }
    };
    render() {
        return (
            <div className="HomeLine-container">
                <Card title="" className="shadowBox" >
                    <ReactEcharts option={this.getOption(this.ydate)} />
                </Card> 
            </div>
        )
    }
}
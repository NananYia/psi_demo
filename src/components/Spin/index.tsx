import { Spin } from "antd";
import React, { Component } from "react";
import './index.less';

export default class MySpin extends Component<any, any>{ 

    render() {
        return (
            <div className="homespin"><Spin></Spin></div>
        )
    }
}
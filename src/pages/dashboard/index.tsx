import React, { Component } from "react";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, Modal, notification } from "antd";
import MySpin from "src/components/Spin";
import { deleteAction, getAction, postAction, putAction } from "src/api/manage";
import "./index.less";

@observer
export default class Home extends Component<any, any> {

    render() {
        return (
            <div className="Home-container">
            </div>
        );
    }
}
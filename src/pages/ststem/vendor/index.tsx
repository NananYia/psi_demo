import React, { Component } from "react";
import "./index.less";
import { Link, withRouter } from "react-router-dom";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Menu, Spin } from "antd";
@observer
export default class VendorList extends Component {

    constructor(props) {
        super(props);
        // makeObservable(this);
    }
    
    getVendorList = async () => {
        try {
            // const menuData: any = await GetPermissionList();
            // if (menuData === null || menuData === "" || menuData === undefined) {
            //     return;
            // }
            // const result = generateIndexRouter(menuData);
            // return this.constRoutes = result;
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div className="vendor-container">
                供应商
            </div>
        );
    }
}
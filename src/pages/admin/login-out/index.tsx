import React from 'react';
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { LoginOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import store from "store";
import md5 from "md5"
import { Modal, notification } from 'antd';
import { Logout } from '../../../store/modules/user';
import './index.less'

@observer
export default class LoginOutText extends React.Component<any, any>{

    constructor(props) {
        super(props);
    }

    handleLogout = async () => {
        try {
            await Logout({})
            window.location.href = "/";
        }catch (err){
            notification.error({ message: err.message,duration: 1500 });
        }
    }
    
    confirm=() =>{
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '确定要注销登录嘛？',
            okText: '确认',
            cancelText: '取消',
            onOk: ()=>this.handleLogout()
        });
    }

    render() {
        return (
            <div className="loginOut-container">
                <div className="loginOut-content" onClick={this.confirm}>
                    <LoginOutlined style={{ fontSize: '16px', color: '#ffffff' }} />
                    <a>退出登录</a>
                </div>
            </div >
        )
    }
}
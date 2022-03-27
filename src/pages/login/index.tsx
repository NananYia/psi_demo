import React, { Component } from "react";
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import store from "store";
import { Form, Input, Button, message, Checkbox, Tabs, Tooltip, Alert, notification, Spin } from "antd";
import { SmileOutlined } from '@ant-design/icons';
import { Icon, Toast } from 'antd-mobile';
import md5 from "md5"
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import Admin from "../admin/admin";
import { putAction, postAction, getAction } from '../../api/manage'
import { LoginIn, Logout } from "../../store/modules/user";
import './index.less';
import Link from "antd/lib/typography/Link";
import Register from "../register";

const { TabPane } = Tabs;
@observer
export default class Login extends Component<any, any>{
    @observable
    private loginType: number;
    @observable
    private loginBtn: boolean;
    @observable
    private rememberchecked: boolean = false;
    @observable
    private Loading: boolean;

    constructor(props) {
        super(props);
        this.Loading = true;
    }

    onFinish = async (values) => {
        const { username, password } = values;
        this.loginBtn = true;
        const param = {
            loginName: username,
            password: md5(password)
        }
        if (param) {
            try {
                const result = await LoginIn(param);
                this.departConfirm(result, username)
            } catch (error) {
                this.requestFailed(error);
                console.log("请求出错", error);
            }
        } else {
            this.loginBtn = false;
        }
    };
    departConfirm(res, loginName) {
        if (res.code === 200) {
            const err = { message: "" };
            if (res.data.msgTip === 'user can login') {
                store.set('winBtnStrList', res.data.userBtn, 7 * 24 * 60 * 60 * 1000);
                store.set('roleType', res.data.roleType, 7 * 24 * 60 * 60 * 1000);
                this.loginSuccess(res, loginName)
            } else if (res.data.msgTip === 'user is not exist') {
                err.message = '用户不存在';
                this.requestFailed(err)
                // Logout();
            } else if (res.data.msgTip === 'user password error') {
                err.message = '用户密码不正确';
                this.requestFailed(err)
                // Logout();
            } else if (res.data.msgTip === 'user is black') {
                err.message = '用户被禁用';
                this.requestFailed(err)
                // Logout();
            } else if (res.data.msgTip === 'tenant is black') {
                if (loginName === 'jsh') {
                    err.message = 'jsh用户已停用，请注册账户进行体验！';
                } else {
                    err.message = '用户所属的账户被禁用';
                }
                this.requestFailed(err)
                // Logout();
            } else if (res.data.msgTip === 'tenant is expire') {
                err.message = '用户所属的账户已过期';
                this.requestFailed(err)
                // Logout();
            } else if (res.data.msgTip === 'access service error') {
                err.message = '查询服务异常';
                this.requestFailed(err)
                // Logout();
            }
        } else {
            this.requestFailed(res)
            // Logout();
        }
    };
    requestFailed(err) {
        this.loginBtn = false;
        notification.warning({ message: '系统提示', description: ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试", duration: 1500 });
        return
    };
    loginSuccess = async (res, loginName) => {
        this.props.history.replace("/home/admin");//登录成功跳转
        // this.props.history.replace("/dashboard/analysis");//登录成功跳转
        notification.success({ message: '欢迎', description: `${loginName}，欢迎回来`, duration: 1500 });
        if (res.data && res.data.user) {
            if (res.data.user.loginName === 'admin') {
                let desc = 'admin只是平台运维用户，真正的管理员是账户，admin不能编辑任何业务数据，只能配置平台菜单和创建账户';
                Toast.show(desc, 30);
            } else {
                const result = await getAction("/user/infoWithTenant", {})
                if (result && result?.data.code === 200) {
                    let currentTime: any = new Date(); //新建一个日期对象，默认现在的时间
                    let expireTime: any = new Date(result.data.expireTime); //设置过去的一个时间点，"yyyy-MM-dd HH:mm:ss"格式化日期
                    let difftime = expireTime - currentTime; //计算时间差
                    //如果距离到期还剩5天就进行提示续费
                    if (difftime < 86400000 * 5) {
                        Toast.show('您好，服务即将到期，请及时续费！', 5);
                    }
                }
            }
        }
        this.initMPropertyShort();
    };
    //加载商品属性
    initMPropertyShort = async () => {
        let mPropertyListShort = '';
        let params = { currentPage: 0, pageSize: 0 };
        params.currentPage = 1;
        params.pageSize = 100;
        const res = await getAction('/materialProperty/list', params)
        if (res && res.data.code === 200) {
            if (res.data) {
                let thisRows = res.data.rows; //属性列表
                store.set('materialPropertyList', thisRows, 7 * 24 * 60 * 60 * 1000);
            }
        }
    }
    onFinishFailed = (errorInfo) => {
        console.log("检验失败", errorInfo);
    };
    // 对密码进行自定义验证
    validatePwd = (rule, value) => {
        if (!value) {
            return Promise.reject("密码必须输入");
        } else if (value.length < 4) {
            return Promise.reject("密码长度不能小于4");
        } else if (value.length > 12) {
            return Promise.reject("密码长度不能大于12");
        } else if (!/^(?=.*[a-z])(?=.*\d).{6,}$/) {
            return Promise.reject("密码6位数字、小写字母组成");
        } else {
            const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            if (regex.test(value)) {
                this.loginType = 0
            } else {
                this.loginType = 1
            }
            return Promise.resolve("通过"); //验证通过
        }
    };
    validatesurePwd(rule, value) {
        if (!value) {
            return Promise.reject("密码必须输入");
        } else if (value.surepassword! === value.password) {
            return Promise.reject("两次密码不一致哦，请确认");
        } else {
            return Promise.resolve("通过"); //验证通过
        }
    }

    render() {
        // 如果用户已经登陆, 自动跳转到管理界面
        // const user = this.props.user;
        // if (user && user._id) {
        //     return <Redirect to="/home" />;
        // }
        const errorMsg = null;
        this.Loading= false;
        return (
            <div className="login-container" >
                <Spin spinning={this.Loading} tip="加载中......" size="large"></Spin>
                <header className="login-left">
                    <div className="left-name">
                        {/* <img src={require('../../assets/images/icon.png')} alt="logo" /> */}
                        <div className="name">Nanan</div>
                    </div>
                    <div className="left-title">基于Java的进销存管理系统</div>
                </header>
                <section className="login-content">
                    <div className={errorMsg ? "error-msg show" : "error-msg"}>
                        {errorMsg}
                    </div>
                    <Tabs defaultActiveKey="1" className="content-title">
                        <TabPane tab="用户登录" key="1" >
                            {this.renderloginItem()}
                        </TabPane>
                        <TabPane tab="注册账户" key="2">
                            {this.rendersignItem()}
                        </TabPane>
                    </Tabs>
                </section>
            </div>
        )
    }
    renderloginItem() {
        return (
            <Form name="loginBasic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                autoComplete="off"
                className="login-form"
            >
                <Form.Item label="" name="username" >
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item label="" name="password" >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item className="center" name="">
                    <Form.Item label="" name="rememberMe" className="rememberMe">
                        <Checkbox onChange={() => { this.rememberchecked = !this.rememberchecked }} />
                        自动登录
                    </Form.Item>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16, }} name="">
                    <Button type="primary" htmlType="submit" className="login-form-button" >
                        登录
                    </Button>
                </Form.Item>
            </Form>
        )
    }
    rendersignItem() {
        return (
            <Register />
        )
    }
}
import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import Admin from "../admin/admin";
import { login } from "../../redux/action";
import './index.less';

export default class Login extends Component<any, any>{
    onFinish = (values) => {
        this.props.history.replace("/home/admin");
        // const { username, password } = values;
        // try {
        //     //调用异步请求，
        //     // this.props.login(username, password);
        // } catch (error) {
        //     console.log("请求出错", error);
        // }
    };

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
        } else if (!/^[a-zA-Z0-9_]+$/) {
            return Promise.reject("密码必须是英文、数字或下划线组成");
        } else {
            return Promise.resolve("通过"); //验证通过
        }
    };
    render() {
        const judjevalue = [
            [{
                required: true,
                whitespace: true,
                message: "用户名必须输入",
            },
            {
                min: 4,
                message: "用户名至少4位",
            },
            {
                max: 12,
                message: "用户名最多12位",
            },
            {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "用户名必须是英文、数字或下划线组成",
            },],
            [{
                required: true,
                // message: "请输入密码",
                validator: this.validatePwd,
            },]
        ];
        // 如果用户已经登陆, 自动跳转到管理界面
        // const user = this.props.user;
        // if (user && user._id) {
        //     return <Redirect to="/home" />;
        // }
        const errorMsg = null;
        return (
            <div className="login-container" >
                <header className="login-left">
                    <div className="left-name">
                        <img src={require('../../assets/images/icon.png')} alt="logo" />
                        <div className="name">Nanan</div>
                    </div>
                    <div className="left-title">基于Java的进销存管理系统</div>
                </header>
                <section className="login-content">
                    <div className={errorMsg ? "error-msg show" : "error-msg"}>
                        {errorMsg}
                    </div>
                    <div className="content-title">用户登录</div>
                    <Form name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        autoComplete="off"
                        className="login-form"
                    >
                        {/* // 声明式验证：直接使用别人定义好的验证规则进行验证 */}
                        <Form.Item label="" name="username" rules={judjevalue[0]} >
                            <Input placeholder="Name"/>
                        </Form.Item>

                        <Form.Item label="" name="password"
                            rules={judjevalue[1]}
                        >
                            <Input.Password  placeholder="Password"/>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16, }} >
                            <Button type="primary" htmlType="submit" className="login-form-button" >
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
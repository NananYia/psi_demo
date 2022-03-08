import * as React from 'react';
import { Form, Input, Button, message } from "antd";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../redux/action";
import "./login.less";

// 登录的路由组件
export default class Login extends React.Component<any, any> {
  // onFinish = async (values) => {
  //   const { username, password } = values;
  //   try {
  //     //调用异步请求，
  //     this.props.login(username, password);
  //   } catch (error) {
  //     console.log("请求出错", error);
  //   }
  // };

  // onFinishFailed = (errorInfo) => {
  //   console.log("检验失败", errorInfo);
  // };
  // // 对密码进行自定义验证
  // validatePwd = (rule, value) => {
  //   if (!value) {
  //     return Promise.reject("密码必须输入");
  //   } else if (value.length < 4) {
  //     return Promise.reject("密码长度不能小于4");
  //   } else if (value.length > 12) {
  //     return Promise.reject("密码长度不能大于12");
  //   } else if (!/^[a-zA-Z0-9_]+$/) {
  //     return Promise.reject("密码必须是英文、数字或下划线组成");
  //   } else {
  //     return Promise.resolve("通过"); //验证通过
  //   }
  // };
  render() {
    // 如果用户已经登陆, 自动跳转到管理界面
    // const user = this.props.user;
    // if (user && user._id) {
    //   return <Redirect to="/home" />;
    // }
    // const errorMsg = this.props.user.errorMsg;
    return (
      <div className="login">
        <header className="login-header">
          <img src={"@src/assets/images/bg.jpg"} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
      </div>
    );
  }
}
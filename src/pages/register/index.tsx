import React, { Component } from "react";
import { makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react'
import { Form, Input, Button } from "antd";
import { SmileOutlined } from '@ant-design/icons';
import md5 from "md5"
import { postAction, getAction } from '../../api/manage'
import './index.less';

@observer
export default class Register extends Component<any, any>{

    private formRef:any = React.createRef();//用于重置表单
    @observable
    private loginType: number;
    @observable
    private requestCodeSuccess: boolean = false;
    @observable
    private randCode: any = '';
    @observable
    private randCodeImage:string = '';

    constructor(props) {
        super(props);
        makeObservable(this);
        this.handleChangeCheckCode();
    }

    handleChangeCheckCode = async() => {
        var currdatetime = new Date().getTime();
        try {
            const result: any= await getAction(`/user/randomImage/${currdatetime}`);
            if (result.code == 200) {
                this.randCode = result.data.codeNum;
                this.randCodeImage = result.data.base64;
                this.requestCodeSuccess = true;
            } else {
                // <NoticeAlert alertType="error" description={result.data} />
                this.requestCodeSuccess = false;
            }
        } catch (error) {
            this.requestCodeSuccess = false;
        }
    }
    onFinish = async (values) => {
        const { inputCode, username, password } = values;
        if (inputCode == this.randCode) {
            let register = {
                loginName: username,
                password: md5(password)
            };
            try {
                const result = await postAction("/user/registerUser", register);
                if (result.status === 200) {
                    setTimeout(function () {
                        //this.formRef.resetFields();//表单重置操作
                    }, 2000);
                    return
                    // <NoticeAlert alertType="success" message="提示" description={"注册成功， 请使用该账户登录!"} />
                }
            } catch (error) {
                return
                // <NoticeAlert alertType="error" message="提示" description={error || "注册失败"} />
            }
        } else {
            return
            // <NoticeAlert alertType="error" message="提示" description="验证码错误" />
        }
    }
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
            // const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            // if (regex.test(value)) {
            //     this.loginType = 0
            // } else {
            //     this.loginType = 1
            // }
            return Promise.resolve("通过"); //验证通过
        }
    };
    // 对两次密码进行自定义验证
    validatesurePwd(rule, value) {
        if (!value) {
            return Promise.reject("密码必须输入");
        }
        // else if (value.surepassword! === value.password) {
        //     // return Promise.reject("两次密码不一致哦，请确认");
        // }
        else {
            return Promise.resolve("通过"); //验证通过
        }
    }
    render() {
        const judjevalue = [
            [
                { required: true, whitespace: true, message: "用户名必须输入", },
                { min: 4, message: "用户名至少4位", },
                { max: 12, message: "用户名最多12位", },
                { pattern: /^[a-zA-Z0-9_]+$/, message: "用户名必须是英文、数字或下划线组成", },
            ],
            [
                { required: true, validator: this.validatePwd, },
            ],
            [
                { required: true, validator: this.validatesurePwd, },
            ]
        ];
        return (
            <Form name="basic"
                ref={this.formRef}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                autoComplete="off"
                className="login-form"
            >
                <Form.Item label="" name="username" rules={judjevalue[0]}>
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item label="" name="password" rules={judjevalue[1]}>
                    <Input placeholder="Password" />
                </Form.Item>
                <Form.Item label="" name="surepassword" rules={judjevalue[2]} >
                    <Input placeholder="Sure you Password" />
                </Form.Item>
                {/* 不输入验证码可： default-value="xxxx" */}
                <Form.Item label="" className="inputCode-content">
                    <Form.Item label="" name="inputCode" className="inputCode-left">
                        <Input placeholder="inputCode" prefix={<SmileOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} />
                    </Form.Item>
                    <Form.Item className="inputCode-right">
                    {this.requestCodeSuccess ?
                        <img src={this.randCodeImage }onClick={this.handleChangeCheckCode} />
                        :
                        <img src={require('../../../src/assets/images/checkcode.png')} alt="code" onClick={this.handleChangeCheckCode} />
                    }
                    </Form.Item>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16, }} >
                    <Button type="primary" htmlType="submit" className="login-form-button" >
                        注册账户
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    

}
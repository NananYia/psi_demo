import { getAction } from '../api/manage';
import { observable } from 'mobx'
import React, { Component } from "react";
import { observer } from 'mobx-react'
import { Toast } from 'antd-mobile';
import NoticeAlert from "./NoticeAlert/index";

@observer
export default class Register extends Component<any, any>{ 
    // name: 'JGraphicCode'
    @observable private length: number = 4;
    @observable private fontSizeMin: number = 20;
    @observable private fontSizeMax: number = 45;
    @observable private backgroundColorMin: number = 180;
    @observable private backgroundColorMax: number = 240;
    @observable private colorMin: number = 50;
    @observable private colorMax: number = 160;
    @observable private lineColorMin: number = 40;
    @observable private lineColorMax: number = 180;
    @observable private dotColorMin: number = 0;
    @observable private dotColorMax: number = 255;
    @observable private contentWidth: number = 136;
    @observable private contentHeight: number = 38;
    @observable private remote: boolean = false;
    @observable private checkKey: any ="";
    @observable private code: any = "";
    
    // 生成一个随机数
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
    // 生成一个随机的颜色
    randomColor(min, max) {
        let r = this.randomNum(min, max)
        let g = this.randomNum(min, max)
        let b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    }
    randomLocalCode() {
        let random = ''
        //去掉了I l i o O
        let str = "QWERTYUPLKJHGFDSAZXCVBNMqwertyupkjhgfdsazxcvbnm1234567890"
        for (let i = 0; i < this.length; i++) {
            let index = Math.floor(Math.random() * 57);
            random += str[index];
        }
        this.code = random
    }

    randomCode() {
        return new Promise((resolve) => {
            if (this.remote == true) {
                getAction("/sys/getCheckCode").then(res => {
                    if (res.success) {
                        this.checkKey = res.result.key
                        this.code = window.atob(res.result.code)
                        resolve;
                    } else {
                        Toast.show("生成验证码错误,请联系系统管理员")
                        this.code = 'BUG'
                        resolve;
                    }
                }).catch(() => {
                    console.log("生成验证码连接服务器异常")
                    this.code = 'BUG'
                    resolve;
                })
            } else {
                this.randomLocalCode();
                resolve;
            }
        })
    }
    drawPic() {
        this.randomCode().then(() => {
            let canvas = document.getElementById('gc-canvas')[0]
            let ctx = canvas.getContext('2d')
            ctx.textBaseline = 'bottom'
            // 绘制背景
            ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
            ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
            // 绘制文字
            for (let i = 0; i < this.code.length; i++) {
                this.drawText(ctx, this.code[i], i)
            }
            this.drawLine(ctx)
            this.drawDot(ctx)
            Toast.show("success", this.code)
        })
    }
    drawText(ctx, txt, i) {
        ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
        let fontSize = this.randomNum(this.fontSizeMin, this.fontSizeMax)
        ctx.font = fontSize + 'px SimHei'
        let padding = 10;
        let offset = (this.contentWidth - 40) / (this.code.length - 1)
        let x = padding;
        if (i > 0) {
            x = padding + (i * offset)
        }
        //let x = (i + 1) * (this.contentWidth / (this.code.length + 1))
        let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
        if (fontSize > 40) {
            y = 40
        }
        var deg = this.randomNum(-10, 10)
        // 修改坐标原点和旋转角度
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        // 恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
    }
    drawLine(ctx) {
        // 绘制干扰线
        for (let i = 0; i < 1; i++) {
            ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
            ctx.beginPath()
            ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
            ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
            ctx.stroke()
        }
    }
    drawDot(ctx) {
        // 绘制干扰点
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = this.randomColor(0, 255)
            ctx.beginPath()
            ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
    reloadPic() {
        this.drawPic()
    }
    render() {
        return (
            <div className="gc-canvas" onClick={()=>this.reloadPic()}>
                <canvas id="gc-canvas" style={{ width: this.contentWidth,height: this.contentHeight}}></canvas>
            </div>
        ) 
    }
}

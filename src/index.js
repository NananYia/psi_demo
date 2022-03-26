// 应用的入口组件
import React, { Component } from "react";
import App from "./App";
import "antd/dist/antd.css";
import memoryUtils from "./utils/memoryUtils";
import storageUtils from "./utils/storageUtils";
import { Provider } from "react-redux";
import reactDOM from "react-dom";
import store from "./store/store";
import {BrowserRouter} from 'react-router-dom'
// 读取local中保存的user，保存到内存中
const user = storageUtils.getUser();
memoryUtils.user = user;
// 将App组件标签渲染到index页面的div上
reactDOM.render(
  /* 此处需要用Provider包裹App，目的是让App所有的后代容器组件都能接收到store */
  <Provider store={store}>
    <BrowserRouter>
      <App />
      </BrowserRouter>,
  </Provider>,
  document.getElementById("root")
);

import React, { Component } from "react";
import { Card, Statistic, DatePicker, Timeline } from "antd";
// import moment from "moment";
// import {
//   QuestionCircleOutlined,
//   ArrowDownOutlined,
//   ArrowUpOutlined,
//   ReloadOutlined,
// } from "@ant-design/icons";
// import Line from "./line";
// import Bar from "./bar";
import "./home.less";

const dateFormat = "YYYY/MM/DD";
const { RangePicker } = DatePicker;

export default class Home extends Component {
  state = {
    isVisited: true,
  };

  handleChange = (isVisited) => {
    return () => this.setState({ isVisited });
  };

  render() {
    const { isVisited } = this.state;

    return (
      <div className="home">
        home
      </div>
    );
  }
}

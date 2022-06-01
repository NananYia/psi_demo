import React, { Component } from "react";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Button, Modal, notification, Tooltip } from "antd";
import MySpin from "src/components/Spin";
import { InfoOutlined } from '@ant-design/icons';
import { deleteAction, getAction, postAction, putAction } from "src/api/manage";
import api from "../../../api/api";
import HomeLine from "../../../components/ECharts/line";
import Spin from "src/components/Spin";
import "../../dashboard/index.less";
@observer
export default class Home extends Component<any, any> {
    @observable topContent: any = [];
    @observable statistics: any = {};
    @observable buyPriceData: any = {};
    @observable salePriceData: any = {};
    @observable private loading: boolean = false;

    constructor(props) {
        super(props);
        makeObservable(this);
        this.getStatistics();
        this.getbuyOrSalePrice();
        this.topContent = [
            { title: "今日累计销售", number: 0, placeholder: "统计今日销售单据的总金额" },
            { title: "本月累计销售", number: 0, placeholder: "统计本月销售单据的总金额" },
        ]
    }
    /** 获取今日/本月等数据 */
    getStatistics = async () => {
        try {
            const result: any = await api.getBuyAndSaleStatistics(null);
            if (result.code === 200) {
                this.statistics = result.data;
                this.topContent[0].number = this.statistics.todaySale || 0;
                this.topContent[1].number = this.statistics.monthSale || 0;
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    /** 获取今日/本月等数据 */
    getbuyOrSalePrice = async () => {
        this.loading = false;
        try {
            const result: any = await api.buyOrSalePrice(null);
            if (result.code === 200) {
                this.buyPriceData = result.data.buyPriceList;
                this.salePriceData = result.data.salePriceList;
                this.loading = true;
            }
            if (result.code === 510) {
                notification.warning(result.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className="Home-container">
                <div className="top">
                    {this.topNumberContent()}
                </div>
                {this.loading ?
                    <div className="content">
                        <HomeLine dataSource={this.salePriceData} title="销售统计" />
                    </div>
                    : <Spin />
                }

            </div>
        );
    }

    /** 顶部展示数据框 */
    topNumberContent = () => {
        return (
            this.topContent.map((item, index) => {
                return (
                    <div className="top-cell" key={index}>
                        <div className="top-cell-title">
                            <div className="title-left">
                                {item.title}
                            </div>
                            <Tooltip title={item.placeholder} className="title-right">
                                <Button shape="circle" icon={<InfoOutlined />} />
                            </Tooltip>
                        </div>
                        <div className="top-cell-number">
                            ¥{item.number}
                        </div>
                    </div>
                )
            })
        )
    }
}
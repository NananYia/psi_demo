
import React from 'react';
import {
    SettingOutlined, HomeOutlined, ShoppingCartOutlined, BarChartOutlined,
    FormOutlined, SnippetsOutlined, FileDoneOutlined, FileSyncOutlined, ShoppingOutlined,
    TransactionOutlined, ReconciliationOutlined
} from '@ant-design/icons';

export function HomeIcons(name: string){
    if (name === "home") {
        return <HomeOutlined />;//首页
    } else if (name === "profile") {
        return <FileSyncOutlined />;//零售订单，采购订单.....
    } else if (name === "gift") {
        return <ReconciliationOutlined />;//零售管理
    } else if (name === "retweet") {
        return <ShoppingOutlined />;//采购管理
    } else if (name === "shopping-cart") {
        return <ShoppingCartOutlined />;//销售管理 shopping-cart
    } else if (name === "hdd") {
        return <FileDoneOutlined />;//采购管理
    } else if (name === "money-collect") {
        return <TransactionOutlined />;//财务管理 money-collect
    } else if (name === "pie-chart") {
        return <BarChartOutlined />;//报表查询 pie-chart
    } else if (name === "shopping") {
        return <SnippetsOutlined />;//商品管理
    } else if (name === "appstore") {
        return <FormOutlined />;//基本资料
    } else if (name === "setting") {
        return <SettingOutlined />;//系统设置
    }
};

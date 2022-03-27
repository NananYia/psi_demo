import { Spin } from 'antd'   //引入Spin组件
import React from 'react';
import { observable } from 'mobx'
import { observer } from 'mobx-react'

interface LoadingLayoutProps{
    tip?: string;
    size?: "small" | "large" | "default";
    show: boolean;
 }
@observer
export default class LoadingLayout extends React.Component<LoadingLayoutProps, any>{
    
    @observable
    private Loading: boolean;

    
    constructor(props) { 
        super(props);
    }

    render() {
        let { tip = '加载中...', size = "large", show } = this.props
        return (
            <div>
                {show ?
                    <Spin tip={tip} size={size} style={{ minHeight: '100vh', position: 'fixed', textAlign: 'center' }} />
                    :null
                }
            </div>
        )
    }
    
}
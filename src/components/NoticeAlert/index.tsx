/**操作提示组件 */
import { Alert } from 'antd';
import React from 'react';
import { observable } from 'mobx'
import { observer } from 'mobx-react'

export interface NoticeAlertProps{
    alertType?: string;
    description?: any;
    message?: any;
}

export default class NoticeAlert extends React.Component<NoticeAlertProps, any>{ 

    constructor(props) {
        super(props)
    }

    render() {
        const { alertType, message,description } = this.props;
        return (
            <>
                {alertType === "success" &&
                    <Alert message={message} type="success" showIcon />
                }
                {alertType === "info" &&
                    <Alert message={message} type="info" showIcon />
                }
                {alertType === "warning" &&
                    <Alert message={message} type="warning" showIcon closable />
                }
                {alertType == "error" &&
                    <Alert message={message} type="error" showIcon />
                }

                {alertType === "success" && description &&
                    <Alert message={message} description={description} type="success" showIcon
                    />
                }
                {alertType === "info" && description &&
                    <Alert message={message} description={description} type="info" showIcon />
                }
                {alertType === "warning" && description &&
                    <Alert message={message} description={description} type="warning" showIcon closable />
                }
                {alertType == "error" && description &&
                    <Alert message={message} description={description} type="error" showIcon />
                }
            </>
            // mountNode,
        )
    }
}
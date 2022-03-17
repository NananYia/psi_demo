import React from 'react';
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { Menu, Switch, Divider } from 'antd';
import {
    MailOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    SettingOutlined,
    LinkOutlined,
} from '@ant-design/icons';
const { SubMenu } = Menu;

@observer
export default class SubMenuTheme extends React.Component<any,any>{

    @observable
    private mode: any = 'inline';
    @observable
    private theme: any = 'light';

    render() {
        const changeMode = value => {
            this.mode = value ==="inline" ? 'vertical' : 'inline';
        };

        const changeTheme = value => {
            this.theme = value ==="light" ? 'dark' : 'light';
        };

        return (
            <>
                <Switch onChange={changeMode} /> Change Mode
                <Divider type="vertical" />
                <Switch onChange={changeTheme} /> Change Style
                <br />
                <br />
                <Menu
                    style={{ width: 256 }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode={this.mode}
                    theme={this.theme}
                >
                    <Menu.Item key="1" icon={<MailOutlined />}>
                        Navigation One
                    </Menu.Item>
                    <Menu.Item key="2" icon={<CalendarOutlined />}>
                        Navigation Two
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Navigation Two">
                        <Menu.Item key="3">Option 3</Menu.Item>
                        <Menu.Item key="4">Option 4</Menu.Item>
                        <SubMenu key="sub1-2" title="Submenu">
                            <Menu.Item key="5">Option 5</Menu.Item>
                            <Menu.Item key="6">Option 6</Menu.Item>
                        </SubMenu>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">
                        <Menu.Item key="7">Option 7</Menu.Item>
                        <Menu.Item key="8">Option 8</Menu.Item>
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                    </SubMenu>
                </Menu>
            </>
        );
    }
};
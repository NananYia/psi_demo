import * as React from 'react';
import * as classNames from 'classnames';
import {observer} from 'mobx-react';

import {tipState} from "./TipState";
import './tip.less';

let loadCount=0;

export const getLoadCount=():number=>{
    return loadCount;
}

@observer
export default class Tip extends React.Component<any, any> {

    private tipMain: any;

    constructor(props,context){
        super(props,context);
        loadCount+=1;
    }

    render() {
        const className = classNames.default({
            "TipBox": true,
            "TipBoxSuccess": tipState.type === "success",
            "TipBoxError": tipState.type === "error",
            "TipBoxWarning": tipState.type === "warning",
        });
        if (tipState.open) {
            let iconName = "";
            if (tipState.type === "success") {
                iconName = "tip-success"
            }
            if (tipState.type === "error") {
                iconName = "tip-error"
            }
            if (tipState.type === "warning") {
                iconName = ""
            }
            return (
                <div className={className} ref={this.processRefMain}>
                    {/* {iconName && <FontIcon size={16} iconName={iconName}/>} */}
                    <span className="tip_msg">{tipState.msg}</span>
                </div>
            )
        } else {
            return null;
        }
    }

    private processRefMain(ref){
        this.tipMain = ref;
    }

    componentDidUpdate(){
        if(tipState.open && this.tipMain){
            this.tipMain["style"]["marginLeft"] = "-" + parseInt(parseInt(this.tipMain["clientWidth"]) / 2 + "") + "px";
            this.tipMain["style"]["marginTop"] = "-" + parseInt(parseInt(this.tipMain["clientHeight"]) / 2 + "") + "px";
        }
    }
}

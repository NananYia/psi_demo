import {observable, runInAction} from "mobx";

const tipState:any = observable({
    open: false,
    type: 'success',
    msg: '',
});

export interface TipOptions {
    type?: "success" | "error" | "warning" ,
    msg?: string,
	duration?: number,
}


/**
 * 显示 tip
 * @param options
 */
function showTip(options:TipOptions = {type: "success", msg: "操作成功", duration: 3000}) {
    let {type, msg, duration} = options;
    duration = duration || 3000;
    runInAction(() => {
        tipState.open = true;
        tipState.msg = msg;
        tipState.type =type
    });

    window.setTimeout(function () {
        tipState.open = false;
    },duration)
}

function closeTip(){
    tipState.open = false;
}

function showError(msg:string): void {
    showTip({type: 'error', msg});
}

function showSuccess(msg:string): void {
    showTip({type: 'success', msg});
}

function showWarning(msg:string): void {
    showTip({type: 'warning', msg});
}

export {
    tipState,
    showTip,
    closeTip,
    showError,
    showSuccess,
    showWarning,
};

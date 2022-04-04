import { getAction } from "../../../../src/api/manage";
import api from "../../../../src/api/api";
import store from "store";
const USER_KEY = "user_key";
 
/* 生成编号 */
const buildNumber = async(amountNum) => {
        const result: any = await getAction('/sequence/buildNumber');
        if (result && result.code === 200) {
            return amountNum + result.data.defaultNumber ;
        }
        // this.$nextTick(() => {
        //     this.form.setFieldsValue({
        //         'operTime': getNowFormatDateTime(), 'discount': 0,
        //         'discountMoney': 0, 'discountLastMoney': 0, 'otherMoney': 0, 'changeAmount': 0, 'debt': 0
        //     })
        // })
}
const addInit = async (amountNum) => {
    const accountIdresult: any = await api.getAccount({});
    if (accountIdresult && accountIdresult.code === 200) {
        for (const item of accountIdresult.data.accountList) {
            if (item.isDefault) {
                return { 'accountId': item.id };
            }
        }
    }
}
export default {
    addInit,
    buildNumber
}

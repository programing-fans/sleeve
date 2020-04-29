import {Http} from "../utils/http";
import {promisic} from "../utils/util";

class Payment{

    static async getPayParms(orderId) {
        const serverParams = await Http.request({
            url:`payment/pay/order/${orderId}`,
            method:'POST'
        })
        return  serverParams
    }

    static async pay(serverParams) {
        try {
            const res = await promisic(wx.requestPayment)({
                nonceStr:serverParams.nonceStr,
                timeStamp:serverParams.timeStamp,
                package:serverParams.package,
                signType:serverParams.signType,
                paySign:serverParams.paySign
            })
            return res;
        } catch (e) {
            throw e;
        }
    }
}

export {
    Payment
}

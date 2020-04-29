// 引用使用es6的module引入和定义
// 全局变量以g_开头
// 私有函数以_开头
import {
    config
}
    from '../config/config.js'
import {promisic} from "../utils/util";
import {getConfig} from "../config/config";

class Token {
    constructor() {
        this.verifyUrl = getConfig().api_base_url + 'token/verify'
        this.tokenUrl = getConfig().api_base_url + 'token'
    }

    async verify() {
        const token = wx.getStorageSync('token')
        if (!token) {
            await this.getTokenFromServer()
        } else {
            await this._verifyFromServer(token)
        }
    }

    async _verifyFromServer(token) {
        console.log(token)
        const res = await promisic(wx.request)({
            url: this.verifyUrl,
            method: 'POST',
            data: {token},
            header:{
                appkey:`${getConfig().appkey}`,
                clientkey:`${getConfig().clientkey}`
            }
        })
        console.log(res)
        const valid = res.data.is_valid
        console.log(valid)

        if (!valid) {
            return this.getTokenFromServer()
        }
    }

    async getTokenFromServer() {
        const r = await promisic(wx.login)()
        const res = await promisic(wx.request)({
            url: this.tokenUrl,
            method: 'POST',
            header:{
                appkey:`${getConfig().appkey}`,
                clientkey:`${getConfig().clientkey}`,
            },
            data: {
                account: r.code,
                type: 0
            }
        })
        wx.setStorageSync('token', res.data.token)
        return res.data.token;
    }
}

export {
    Token
};
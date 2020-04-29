import {
    config
} from '../config/config.js'

import {promisic} from "./util";
import {Token} from "../models/token";
import {behavior, codes} from "../config/excpetion-config";
import {HttpException} from "../core/http-exception";
import {getConfig} from "../config/config";


class Http {
    static async request({
                             url,
                             data = {},
                             method = 'GET',
                             noRefetch = false,
                             throwError = false,
                         }) {
        let res;
        try {
            console.log(url)
            res = await promisic(wx.request)({
                url: getConfig().api_base_url + url,
                data,
                method,
                header: {
                    'content-type': 'application/json',
                    'appkey': getConfig().appkey,
                    'authorization': `Bearer ${wx.getStorageSync('token')}`,
                    'clientkey':getConfig().clientkey
                }
            })
        } catch (e) {
            if (throwError) {
                throw new HttpException(-1, '请求失败，可能是网络中断',
                    null)
            }
            Http.showError(-1)
            return null
        }
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
            return res.data
        } else {
            if (code === '401') {
                if (!noRefetch) {
                    return Http._refetch({
                            url,
                            data,
                            method
                        }
                    )
                }
            } else {
                if (throwError) {
                    throw new HttpException(res.data.error_code, res.data.msg,
                        res.statusCode)
                }
                if (code === '404') {
                    // 404 不抛出异常
                    return isArray ? [] : null
                }
                const error_code = res.data.error_code;
                this.showError(error_code, res.data)
            }
        }
    }


    static async _refetch(data) {
        const token = new Token()
        await token.getTokenFromServer()
        data.noRefetch = true
        return await Http.request(data)
    }


    static showError(error_code, serverError) {
        console.log(error_code, serverError)
        if (!error_code) {
            error_code = 999
        }
        else if (codes[error_code] === undefined) {
            error_code = serverError.msg
        }
        // } else {
        //     error_code = 777
        // }
        let tip
        tip = codes[error_code]
        wx.showToast({
            icon: "none",
            title: tip,
            duration: 3000
        })
    }


}

export {
    Http
}
























import {Http} from "../utils/http";

class Activity {
    // static locationD = 'a-1'
    static locationD = 'a-2'

    // static getHomeLocationD() {
    //     return Http.request({
    //         url: `activity/name/${Activity.locationD}`
    //     })
    // }

    static async getHomeLocationD() {
        return Http.request({
            url: `activity/name/${Activity.locationD}`
        })
    }

    static async getActivityWithCoupon() {
        return Http.request({
            url:`activity/name/${Activity.locationD}/with_coupon`
        })
    }
}

export {
    Activity
}

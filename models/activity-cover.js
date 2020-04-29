import {Http} from "../utils/http";

class ActivityCover{
    static locationD = 'a-1'
    static locationE = 'a-2'

    static getHomeLocationD() {
        return Http.request({
            url: `activity_cover/name/${ActivityCover.locationD}`
        })
    }

    static getHomeLocationE() {
        return Http.request({
            url: `activity_cover/name/${ActivityCover.locationE}`
        })
    }

    static async getByIdWithCoupons(id) {
        const cover = await Http.request({
            url: `activity_cover/id/${id}`
        })
        console.log(cover)
    }


}

export {
    ActivityCover
}

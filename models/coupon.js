import {Http} from "../utils/http";

class Coupon{
    coupon
    constructor(couponWithCategory){
        this.coupon = couponWithCategory
    }
    canUse(orderItems) {
        const couponCategoryIds = this.coupon.categories.map(category=>{
            return category.id
        })
        // const couponCategory = this.coupon.
    }

    static async getWholeStoreCoupons(){
        return Http.request({
            url:`coupon/whole_store`
        })
    }

    static async getTop2CouponsByCategory(cid) {
        let coupons = await Http.request({
            url: `coupon/by/category/${cid}`,
        })
        if (coupons.length === 0) {
            const otherCoupons = await Coupon.getWholeStoreCoupons()
            return Coupon.getTop2(otherCoupons)
        }
        if(coupons.length >= 2){
            return coupons.slice(0,2)
        }
        if(coupons.length === 1){
            const otherCoupons = await Coupon.getWholeStoreCoupons()
            coupons = coupons.concat(otherCoupons)
            return Coupon.getTop2(coupons)
        }
    }



    static getTop2(coupons) {
        if(!coupons){
            return null
        }
        if(coupons.length >= 2){
            return coupons.slice(0,2)
        }
        if(coupons.length === 1){
            return coupons
        }
        return null
    }

    static async getCouponsByCategory(cid){
        return Http.request({
            url: `coupon/by/category/${cid}`,
        })
    }

    static async collectCoupon(cid) {
        return await Http.request({
            method:'POST',
            url:`coupon/collect/${cid}`,
            throwError:true
        })
        // return await Http
    }

    // static async getCouponsByCategoryActivity(cid) {
    //     return await Http.request({
    //         url: `coupon/by/category/${cid}/`
    //     })
    // }

    static async getMySelfWithCategory() {
        return Http.request({
            url:`coupon/myself/available/with_category`
        })
    }

    static async getMyCoupons(status) {
        return await Http.request({
            url:`coupon/myself/by/status/${status}`
        })
    }
}

export {
    Coupon
}

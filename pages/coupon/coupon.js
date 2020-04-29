// pages/coupon-center/coupon-center'.js
import {ActivityCover} from "../../models/activity-cover";
import {CouponCenterType} from "../../core/enum";
import {Coupon} from "../../models/coupon";
import {Activity} from "../../models/activity";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        coupons:[],
        userCollected:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const cid = options.cid
        const aName = options.name
        const type= options.type
        console.log(cid, aName, type)
        let coupons;
        if(type==CouponCenterType.ACTIVITY){
             const activity = await Activity.getActivityWithCoupon()
            coupons = activity.coupons
        }
        if(type==CouponCenterType.SPU_CATEGORY){
             coupons = await Coupon.getCouponsByCategory(cid)
             const wholeStoreCoupons = await Coupon.getWholeStoreCoupons()
             coupons = coupons.concat(wholeStoreCoupons)
        }
        console.log(coupons)
        if (coupons.length === 0) {
            wx.lin.showEmptyScreen({
                text:'暂无优惠券'
            })
        }else{
            this.setData({
                coupons
            });
        }
    },

    initCoupons(activityCover) {
        const activities = activityCover.activities()
    },

    async onCollectCoupon(event) {
    },


    onShareAppMessage: function () {

    }
})
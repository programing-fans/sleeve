// pages/my/my.js
import {Coupon} from "../../models/coupon";
import {AuthAddress, CouponStatus} from "../../core/enum";
import {promisic} from "../../utils/util";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        couponCount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: async function (options) {
        const coupon = await Coupon.getMyCoupons(CouponStatus.AVAILABLE)
        console.log(coupon.length)
        this.setData({
            couponCount: coupon.length
        })
    },

    onGotoMyCoupon(event) {
        wx.navigateTo({
            url: "/pages/my-coupon/my-coupon"
        })
    },

    onGotoMyOrder(event) {
        wx.navigateTo({
            url: "/pages/my-order/my-order?key=0"
        })
    },

    onGotoMyCourse(event) {
        wx.navigateTo({
            url:"/pages/about-course/about-course"
        })
    },

    onGotoLinUI() {
        wx.navigateToMiniProgram({
            appId:'wxdcec05d9a27f9064'
        })
    },

    async onMgrAddress(event) {
        // wx.open
        const authStatus = await this.hasAuthorizedAddress()
        if (authStatus === AuthAddress.DENY) {
            this.setData({
                showDialog: true
            })
            // wx.openSetting()
            return
        }
        this.openAddress()
    },

    async hasAuthorizedAddress() {
        const setting = await promisic(wx.getSetting)();
        console.log(setting)
        const addressSetting = setting.authSetting['scope.address']
        if (addressSetting === undefined) {
            return AuthAddress.NOT_AUTH
        }
        if (addressSetting === false) {
            return AuthAddress.DENY
        }
        if (addressSetting === true) {
            return AuthAddress.AUTHORIZED
        }
    },

    async openAddress() {
        let res;
        res = await promisic(wx.chooseAddress)();
    },

})
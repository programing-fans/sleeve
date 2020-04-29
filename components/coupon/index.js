// components/coupon/index.js
import {getSlashYMD, toDate, getDotYMD} from "../../utils/date";
import {Coupon} from "../../models/coupon";
import {showToast} from "../../utils/ui";
import {CouponData} from "./coupon-data";
import {CouponStatus} from "../../core/enum";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        coupon: Object,
        userCollected: Boolean,
        status:Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        _coupon:Object,
    },

    observers: {
        'coupon, status': function (coupon) {
            if (!coupon) {
                return
            }
            this.setData({
                _coupon: new CouponData(coupon),
                // status
            })
        }
    },

    attached() {
    },

    /**
     * 组件的方法列表
     */
    methods: {
        async onGetCoupon(event) {
            if(this.data.status == CouponStatus.AVAILABLE){
                wx.switchTab({
                    url:`/pages/category/category`
                })
                return
            }
            if (this.properties.status !== CouponStatus.CAN_COLLECT) {
                return
            }
            if (this.properties.userCollected) {
                showToast('您已领取了该优惠券,在"我的优惠券"中可查看');
                return;
            }
            const couponId = event.currentTarget.dataset.id
            let msg;
            try {
                msg = await Coupon.collectCoupon(couponId)
            } catch (e) {
                if (e.errorCode == 40006) {
                    this.setUserCollected()
                    showToast('您已领取了该优惠券,在"我的优惠券"中可查看')
                }
                return
            }
            if (msg.error_code == 0) {
                this.setUserCollected()
                showToast('领取成功，在"我的优惠券"中查看')
            }
        },

        setUserCollected() {
            this.setData({
                userCollected: true
            })
        }
    }

})

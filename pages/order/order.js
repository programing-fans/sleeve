// pages/order/order.js
import {Cart} from "../../models/cart";
import {Sku} from "../../models/sku";
import {OrderItem} from "../../models/order-item";
import {Coupon} from "../../models/coupon";
import {Order} from "../../models/order";
import {CouponBO} from "../../models/coupon-bo";
import {CouponOperate, OrderStatus, ShoppingWay} from "../../core/enum";
import {showToast} from "../../utils/ui";
import {OrderPost} from "../../models/order-post";
import {Payment} from "../../models/payment";

const cart = new Cart()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        couponBOList: [],
        finalTotalPrice: 0,
        totalPrice: 0,
        discountMoney: 0,
        isOk: true,
        containsTest: false,
        priceFloat: false,
        floatErrorMsg: '',
        submitBtnDisable: false,

        order: null,
        address: null,
        currentCouponId: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // let skuIds;
        // let skuIdsCount;
        let orderItems;
        let localItemCount;
        if (options.way == ShoppingWay.BUY) {
            const skuId = options.sku_id
            const count = options.count
            orderItems = await this.getSingleOrderItems(skuId, count);
            localItemCount = 1
        } else {
            const skuIds = cart.getCheckedSkuIds()
            orderItems = await this.getCartOrderItems(skuIds);
            localItemCount = skuIds.length
        }
        const order = new Order(orderItems, localItemCount)
        this.data.order = order
        try {
            order.checkOrderIsOk()
        } catch (e) {
            this.setData({
                isOk: false
            })
            return
        }
        const coupons = await Coupon.getMySelfWithCategory();
        const couponBOList = this.packageCouponBOList(coupons, order)
        this.initData(order, couponBOList)
    },

    async getSingleOrderItems(skuId, count) {
        const skus = await Sku.getSkusByIds(skuId)
        return [new OrderItem(skus[0], count)];
    },

    async getCartOrderItems(skuIds) {
        const idListStr = skuIds.join(',')
        const skus = await Sku.getSkusByIds(idListStr)
        const orderItems = await this.packageOrderItems(skus)
        return orderItems
    },

    initData(order, couponBOList) {
        this.setData({
            orderItems: order.orderItems,
            finalTotalPrice: order.getTotalPrice(),
            totalPrice: order.getTotalPrice(),
            couponBOList
        })
    },

    disableSubmitBtn() {
        this.setData({
            submitBtnDisable: true
        })
    },

    enableSubmitBtn() {
        this.setData({
            submitBtnDisable: false
        })
    },

    async onSubmit(event) {
        if (!this.data.address) {
            showToast('请选择收获地址')
            return
        }
        const contains = this.data.order.checkContainTestSpu()
        if (contains) {
            this.setData({
                containsTest: true
            })
            return
        }

        this.disableSubmitBtn()
        const order = this.data.order
        const orderPost = new OrderPost(
            this.data.totalPrice,
            this.data.finalTotalPrice,
            this.data.currentCouponId,
            order.getOrderSkuInfoList(),
            this.data.address
        )
        const oid = await this.postOrder(orderPost)
        cart.removeCheckedItems()
        if (!oid) {
            this.enableSubmitBtn()
            return
        }
        wx.lin.showLoading({
            type: "flash",
            fullScreen: true,
            color: "#157658"
        })
        const payParams = await Payment.getPayParms(oid)
        if(!payParams){
            return
        }
        let payStatus = OrderStatus.UNPAID
        let res
        try {
            res = await Payment.pay(payParams)
            payStatus = OrderStatus.PAID
            wx.redirectTo({
                url: `/pages/pay-success/pay-success?oid=${oid}`
            })
            console.log(res)
        } catch (e) {
            console.error(e)
            wx.redirectTo({
                url: `/pages/my-order/my-order?key=${payStatus}`
            })
        }
        //必须使用redirectTo防止Order页面被频繁打开
    },

    async postOrder(orderPost) {
        try {
            const serverOrder = await Order.postOrderToServer(orderPost)
            if (serverOrder) {
                return serverOrder.id
            }
            return false
        } catch (e) {
            this.setData({
                priceFloat: true,
                floatErrorMsg: e.message
            })
        }
    },

    onChooseAddress(event) {
        const address = event.detail.address
        this.data.address = address
    },

    onChooseCoupon(event) {
        const couponObj = event.detail.coupon
        const couponOperate = event.detail.operate
        if (couponOperate === CouponOperate.PICK) {
            this.data.currentCouponId = couponObj.id
            const priceObj = CouponBO.getFinalPrice(this.data.order.getTotalPrice(), couponObj)
            this.setData({
                finalTotalPrice: priceObj.finalPrice,
                discountMoney: priceObj.discountMoney
            })
        } else {
            this.data.currentCouponId = null
            this.setData({
                finalTotalPrice: this.data.order.getTotalPrice(),
                discountMoney: 0
            })
        }
    },

    packageOrderSignleItem(sku,) {
    },

    packageOrderItems(skus) {
        return skus.map(sku => {
            const count = cart.getSkuCountBySkuId(sku.id)
            return new OrderItem(sku, count)
        })
    },

    packageCouponBOList(coupons, order) {
        return coupons.map(coupon => {
            const couponBO = new CouponBO(coupon)
            couponBO.meetCondition(order)
            return couponBO
        })
    }

})
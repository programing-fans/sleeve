// pages/detail/detail.js
import Spu from "../../models/spu";
import {Coupon} from "../../models/coupon";
import {CouponCenterType, ShoppingWay} from "../../core/enum";
import {CartItem} from "../../models/cart-item";
import {Cart} from "../../models/cart";
import {SpuSimplify} from "../../models/spu-simplify";
import {SaleExplain} from "../../models/sale-explain";
import {getWindowHeightLeft} from "../../utils/system";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        spu:null,
        tags:[],
        coupons:[],
        showRealm:false,
        orderWay:ShoppingWay.CART,
        cartItemCount:0,
        saleExplain:[],
        specChosen:null,
        noSpec:true
        // isTest:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.lin.showLoading({
            color:'#157658',
            type:'flash',
            fullScreen:true
        })
        const pid = options.pid
        const spu = await Spu.getDetail(pid);
        let coupons =await Coupon.getTop2CouponsByCategory(spu.category_id)
        if(!coupons){
            coupons = []
        }
        const saleExplain = await SaleExplain.getFixed()
        const scrollHeight = await getWindowHeightLeft(100)
        this.setData({
            spu,
            noSpec:Spu.noSpec(spu),
            coupons,
            saleExplain,
            scrollHeight
        })

        this.updateCartItemCount()
        wx.lin.hideLoading()
    },


    updateCartItemCount() {
        const cart = new Cart()
        this.setData({
            cartItemCount:cart.getCartItemCount(),
            showRealm:false
        })
    },

    onGoToCouponCenter(event) {
        const type= CouponCenterType.SPU_CATEGORY
        const cid = this.data.spu.category_id
        wx.navigateTo({
            url:`/pages/coupon/coupon?cid=${cid}&type=${type}`
        })
    },

    onGoToHome(event){
        wx.switchTab({
            url:'/pages/home/home'
        })
    },

    onGoToCart(event){
        wx.switchTab({
            url:'/pages/cart/cart'
        })
    },

    onAddToCart(event) {
        // this.setData()
        this.setData({
            showRealm:true,
            // spu:this.data.spu
            orderWay:ShoppingWay.CART
        })
    },

    onBuy(event) {
        this.setData({
            showRealm:true,
            orderWay:ShoppingWay.BUY
        })
    },

    onCloseRealm(event){
    },

    onSpecChange(event){
        this.setData({
            specChosen:event.detail
        })
    },

    onShopping(event) {
        // const spuId = event.detail.spuId
        const chosenSku = event.detail.sku
        const skuCount = event.detail.skuCount
        if(event.detail.orderWay == ShoppingWay.CART){
            // const skuId = this.
            const cartItem = new CartItem(chosenSku, skuCount)
            const cart  = new Cart()
            try {
                cart.addItem(cartItem)
            }
            catch (e) {
               wx.showToast({
                   title:e.message,
                   icon:"none",
                   duration:2000
               })
            }
            this.updateCartItemCount()
            wx.lin.showToast({
                placement:'right',
                icon:'success',
                iconStyle:'size:40',
                duration: 1500,
                title:'添加成功'
            })
        }
        if(event.detail.orderWay == ShoppingWay.BUY){
            wx.navigateTo({
                url:`/pages/order/order?sku_id=${chosenSku.id}&count=${skuCount}&way=${ShoppingWay.BUY}`
            })
        }
    },

    onLoadImg(event) {
        const {height, width} = event.detail
        console.log(height, width)
        this.setData({
            h: height,
            w: width,
        })
    },

    onShareAppMessage() {

    }
})
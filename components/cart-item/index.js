// components/cart-item/index.js
import {parseSpecValue} from "../../utils/sku";
import {Cart} from "../../models/cart";

const cart = new Cart()
Component({
    properties: {
        // skuId:Number
        // cartItem并非引用对象，更新这里的cartItem不会更新Cart中的item
        cartItem: Object,
    },


    /**
     * 组件的初始数据
     */
    data: {
        specStr: String,
        discount: Boolean,
        soldOut: false,
    },

    observers: {
        'cartItem': function (cartItem) {
            if (!cartItem) {
                return
            }
            console.log(cartItem)
            const specStr = parseSpecValue(cartItem.sku.specs)
            const soldOut = Cart.isSoldOut(cartItem)
            const online = Cart.isOnline(cartItem)
            this.setData({
                specStr,
                discount: cartItem.sku.discount_price ? true : false,
                soldOut,
                online
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        outStock(cartItem) {
            return cartItem.count > cartItem.sku.stock;
        },
        onDelete(event) {
            const skuId = this.properties.cartItem.skuId
            cart.removeItem(skuId)
            // this.differenceCount(this.properties.cartItem, 0)
            this.setData({
                cartItem: null
            })
            this.triggerEvent('itemdelete', {
                skuId
            })
        },

        onSelectCount(event) {
            const cartItem = this.properties.cartItem
            let newCount = event.detail.count
            newCount = parseInt(newCount)
            console.log(event)
            const skuId = this.properties.cartItem.skuId
            // this.differenceCount(cartItem, newCount)
            cart.replaceItemCount(skuId, newCount)
            this.triggerEvent("countfloat")
        },

        checkedItem(event) {
            const checked = event.detail.checked
            cart.checkItem(this.properties.cartItem.skuId)
            // this.setData({
            //     checked
            // })
            this.properties.cartItem.checked = checked
            this.triggerEvent('itemcheck', {
                // checked: event.detail.checked,
                // cartItem: this.properties.cartItem
            })
        },
        
        onOutNumber(event){
            const cartItem = this.properties.cartItem
            console.log(event)
            if(event.detail.type=="overflow_min"){
                cart.replaceItemCount(cartItem.skuId, Cart.SKU_MIN_COUNT)
            }
            if(event.detail.type == "overflow_max"){
                cart.replaceItemCount(cartItem.skuId, cartItem.sku.stock)
            }
            this.triggerEvent('overflow')
        },

        gotoDetail(event) {
            wx.navigateTo({
                url:`/pages/detail/detail?pid=${this.data.cartItem.sku.spu_id}`
            })
        }
    }
})

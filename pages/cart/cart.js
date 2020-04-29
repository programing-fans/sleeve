// components/cart/index.js
import {getWindowHeightRpx, getWindowSize} from "../../utils/system";
import {Cart} from "../../models/cart";
import {Calculator} from "../../components/models/calculator";
import {Theme} from "../../models/theme";

const cart = new Cart()

Page({
    /**
     * 组件的属性列表
     */

    data: {
        // cartItems是引用对象，更新此处会更新Cart中的Items
        // 同样，更新Cart中的Items，此处中的Items也会更新
        cartItems: Array,
        isEmpty: false,
        allChecked: false,
        totalPrice: 0,
        totalSkuCount: Number,
        forYouData: Object
    },

    // lifetimes: {
    async onLoad() {
        this.setDynamicScrollHeight()
        const cart = new Cart()
        const cartData = await cart.getAllSkuFromServer()
        const forYouData = await Theme.getForYou();
        wx.lin.renderWaterFlow(forYouData.spu_list, true)
        if (!cartData) {
            return
        }
        this.setData({
            cartItems: cartData.items,
            forYouData
        })
    },
    // },

    // pageLifetimes: {
    onShow() {
        const cart = new Cart()
        const cartItems = cart.getAllSkuFromLocal().items
        this.setData({
            cartItems
        })
        if (cartItems.length == 0) {
            this.empty()
            return
        }
        this.notEmpty()
        this.refreshCartData(cartItems);
        this.isAllCheck(cartItems)
    },

    notEmpty() {
        this.setData({
            isEmpty: false
        })
        wx.showTabBarRedDot({
            index: 2
        })
    },
    empty() {
        // wx.lin.showEmpty({
        //     text:"购物车空空的，去逛逛吧"
        // })
        this.setData({
            isEmpty: true,
            // cartItems:null
        })
        wx.hideTabBarRedDot({
            index: 2
        })
    },
    clear() {
        this.setData({
            carItems: null
        })
    },
    refreshCartData() {
        const cartItems = this.data.cartItems
        const calculator = new Calculator()
        let checkedItems = []
        cartItems.forEach(item => {
            if (item.checked) {
                checkedItems.push(item)
            }
        })
        calculator.init(checkedItems)
        this.setCalcData(calculator)
    },

    setCalcData(calculator) {
        const totalPrice = calculator.getTotalPrice()
        const totalSkuCount = calculator.getTotalSkuCount()
        this.setData({
            totalPrice: totalPrice,
            totalSkuCount
        })
    },


    isAllCheck(cartItems) {
        // 当item 被check/uncheck时需检查
        // 当item 被delete时，需检查

        // 1. 只有无货的商品 -> false

        let allChecked = true
        for (let item of cartItems) {
            if (!item.checked) {
                allChecked = false
                break
            }
        }
        this.setData({
            allChecked
        })
    },


    async setDynamicScrollHeight() {
        const windowHeightRpx = await getWindowHeightRpx()
        const r = windowHeightRpx - 88;
        this.setData({
            scrollHeight: r
        })
    },

    onCountFloat(event) {
        this.refreshCartData()
    },

    onOverflow(event) {
        this.refreshCartData()
    },

    onSingleCheck(event) {
        this.refreshCartData()
        this.isAllCheck(this.data.cartItems)
    },

    onCheckAll(event) {
        const checked = event.detail.checked
        cart.checkAll(checked)
        this.setData({
            cartItems: this.properties.cartItems
        })
        this.refreshCartData(this.properties.cartItems)
    },


    onGoToHome(event) {
        wx.switchTab({
            url: `/pages/home/home`
        })
    },

    onDeleteItem(event) {
        const skuId = event.detail.skuId
        this.refreshCartData()
        this.isAllCheck(this.data.cartItems)
        if (cart.isEmpty()) {
            this.empty()
            this.clear()
        }
    },

    onSettle(event) {
        if (this.data.totalSkuCount === 0) {
            return
        }
        wx.navigateTo({
            url: '/pages/order/order'
        })
    }

    // }
})

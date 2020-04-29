import {Http} from "../utils/http";
import {promisic} from "../utils/util";

class Cart {
    static storagePrefix = 'cart-'
    static storageSkuIdKeyPrefix = 'cart-item-keys'
    static skuMaxCount = 9999
    _cartData = null
    _proxy = null

    //购物车对象必须是单例模式
    constructor() {
        if (typeof Cart.instance === 'object') {
            return Cart.instance
        }
        Cart.instance = this
        return this
    }

    // static initCartItemKeys() {
    //
    // }
    //
    // _getCartItemKesy() {
    //     wx.getStorageSync()
    // }

    addItem(newItem) {
        this._pushItem(newItem)
        // this._refreshStorage()
    }

    replaceItemCount(skuId, count) {
        this._replaceItemCount(skuId, count);
        // this._refreshStorage()
    }

    removeItem(skuId) {
        const oldItemIndex = this._findEqualItemIndex(skuId)
        console.log(oldItemIndex)
        const cartData = this._getCartData()
        cartData.items.splice(oldItemIndex, 1)
        this._refreshStorage()
    }

    checkItem(skuId) {
        const oldItem = this._findEqualItem(skuId)
        oldItem.checked = !oldItem.checked
        this._refreshStorage()
    }

    async getAllSkuFromServer() {
        const cartData = this._getCartData();
        if (cartData.items.length === 0) {
            return null
        }
        console.log(cartData)
        const skuIds = this._getSkuIds()
        const idStr = skuIds.join(',')
        return await Http.request({
            url: `sku/id?ids=${idStr}`
        });
    }

    getAllSkuFromLocal() {
        return this._getCartData();
    }

    getCartItemCount() {
        return this._getCartData().items.length
    }

    _getSkuIds() {
        const cartData = this._getCartData()
        if (cartData.items.length === 0) {
            return []
        }
        return cartData.items.map(item => item.skuId)
    }

    _findEqualItem(skuId) {
        // let isEqual = false
        let oldItem = null
        const items = this._getCartData().items
        for (let i = 0; i < items.length; i++) {
            if (this._isEqualItem(items[i], skuId)) {
                oldItem = items[i]
                break
            }
        }
        return oldItem
    }

    _findEqualItemIndex(skuId) {
        const cartData = this._getCartData()
        return cartData.items.findIndex(item => {
            return item.skuId == skuId
        })
    }

    async _pushItem(newItem) {
        const oldItem = await this._getCartItem(newItem.skuId)
        // const oldItem = this.findEqualItem(newItem.skuId)
        if (!oldItem) {
            this._updateCartItem(newItem)
        } else {
            this._combineItems(oldItem, newItem)
        }
    }

    _refreshStorage() {
        wx.setStorageSync(Cart.STORAGE_KEY, this._cartData)
    }

    async _getCartItem(skuId) {
        const cartItem = await promisic(wx.getStorage)({
            key:this.getKey(skuId)
        })
        if(!cartItem){
            console.log('没有找到sku对应的缓存')
        }
    }

    getKey(skuId){
        return `${Cart.storagePrefix}skuId`
    }

    _updateCartItem(item) {
        wx.setStorage({
            key:this.getKey(item.skuId),
            data: item
        })
    }

    async _removeCartItem(skuId){
        wx.removeStorage({
            key:this.getKey(skuId)
        })
        // promisic(wx.removeStorage)({
        //     key:this.getKey(skuId)
        // })
    }

    _replaceItemCount(skuId, newCount) {
        // 主要用在购物车中调整数量
        const oldItem = this._getCartItem(skuId)
        if (!oldItem) {
            console.error('异常情况，更新CartItem中的数量不应当找不到相应数据')
            return
        }
        if (newCount < 1) {
            console.error('异常情况，CartItem的Count不可能小于1')
            return
        }
        oldItem.count = newCount
        if (oldItem.count >= Cart.skuMaxCount) {
            oldItem.count = Cart.skuMaxCount
        }
        this._updateCartItem(oldItem)
    }


    _combineItems(oldItem, newItem) {
        oldItem.count += newItem.count
        if(oldItem.count >= Cart.skuMaxCount){
            oldItem.count = Cart.skuMaxCount
        }
        this._updateCartItem(oldItem)
    }


    _plusCount(item, count) {
        //主要用在商品添加（detail）页面
        item.count += count
        if (item.count >= Cart.skuMaxCount) {
            item.count = Cart.skuMaxCount
        }
    }
}

export {
    Cart
}

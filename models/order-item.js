import {Cart} from "./cart";
import {parseSpecValue} from "../utils/sku";
import {accMultiply} from "../utils/number";
import {OrderException} from "../core/order-exception";
import {OrderExceptionType} from "../core/enum";

// 订单通常为实时数据
class OrderItem{
    // sku = null
    count = 0
    singleFinalPrice
    finalPrice
    online
    title
    img
    stock
    categoryId
    rootCategoryId
    specs
    isTest
    skuId
    cart = new Cart()
    constructor(sku, count) {
        this.title = sku.title
        // this.spu = sku.spu
        this.img = sku.img
        this.skuId = sku.id
        this.stock = sku.stock
        this.online = sku.online
        this.categoryId = sku.category_id
        this.rootCategoryId = sku.root_catgory_id
        this.isTest = sku.is_test
        this.count = count
        this.singleFinalPrice = this.ensureSingleFinalPrice(sku)
        this.finalPrice = accMultiply(this.count, this.singleFinalPrice)
        this.specs = sku.specs
    }

    isOk() {
        this._checkStock()
        this._beyondMaxSkuCount()
        // this._checkOnSale()
    }

    _checkStock() {
        if(this.stock === 0){
            throw new OrderException('当前商品已售罄', OrderExceptionType.SOLD_OUT)
        }
        if(this.count > this.stock){
            throw new OrderException('购买商品数量超过最大库存', OrderExceptionType.BEYOND_STOCK)
        }
    }

    _beyondMaxSkuCount(){
        if(this.count > Cart.SKU_MAX_COUNT){
            throw new OrderException('超过商品最大购买数量', OrderExceptionType.BEYOND_SKU_MAX_COUNT)
        }
    }

    // _checkOnSale() {
    //     if(!this.onSale){
    //         throw new OrderException('订单包含已下架商品', OrderExceptionType.NOT_ON_SALE)
    //     }
    // }


    ensureSingleFinalPrice(sku) {
        if(sku.discount_price){
            return sku.discount_price
        }
        return sku.price
    }
}

export {
    OrderItem
}

import {accAdd} from "../utils/number";
import {OrderException} from "../core/order-exception";
import {OrderExceptionType, OrderStatus} from "../core/enum";
import {Http} from "../utils/http";
import {Paging} from "../utils/paging";

class Order {
    orderItems
    itemCount

    constructor(orderItems, itemCount) {
        this.orderItems = orderItems
        this.itemCount = itemCount
    }

    static async postOrderToServer(orderPost) {
        return await Http.request({
            url:'order',
            method:'POST',
            data:orderPost,
            throwError:true
        })
    }

    static async getDetail(oid) {
        return Http.request({
            url: `order/detail/${oid}`
        })
    }

    static getPagingByStatus(status) {
        return new Paging({
            url:`order/by/status/${status}`
        })
        // return Http.request({
        // })
    }

    static getPagingUnpaid() {
        return new Paging({
            url:`order/status/unpaid`
        })
    }

    static async getUnpaidCount() {
        const orderPage = await Http.request({
            url: `order/status/unpaid`,
            data:{
                start:0,
                count:1
            }
        })
        return orderPage.total
    }

    static async getPaidCount() {
        const orderPage = await Http.request({
            url: `order/by/status/${OrderStatus.PAID}`,
            data:{
                start:0,
                count:1
            }
        })
        return orderPage.total
    }

    static async getDeliveredCount() {
        const orderPage = await Http.request({
            url: `order/by/status/${OrderStatus.DELIVERED}`,
            data: {
                start:0,
                count:1
            }
        })
        return orderPage.total
    }

    static getPagingCanceled() {
        return new Paging({
            url:`order/status/canceled`
        })
    }


    getOrderSkuInfoList() {
        return this.orderItems.map(item=>{
            return {
                id:item.skuId,
                count: item.count
            }
        })
    }

    checkOrderIsOk() {
        this._orderIsOk()
        this.orderItems.forEach(item=>{
            item.isOk()
        })
    }

    checkContainTestSpu() {
        console.log(this.orderItems)
        for(let item of this.orderItems){
            if(item.isTest){
                return true
            }
        }
        return false
    }

    getTotalPrice(){
        return this.orderItems.reduce((pre, item)=>{
            const price = accAdd(pre ,item.finalPrice)
            return price
        }, 0)
    }

    _orderIsOk() {
        this._emptyOrder()
        this._containNotOnSaleItem()
    }

    _emptyOrder() {
        if (this.orderItems.length === 0) {
            throw new OrderException('订单中没有任何商品', OrderExceptionType.EMPTY)
        }
    }


    _containNotOnSaleItem() {
        // 如果一个Sku或者Spu已下架，服务端不会返回相关数据
        if(this.orderItems.length !== this.itemCount){
            throw new OrderException('服务器返回订单商品数量与实际不相符，可能是有商品已下架', OrderExceptionType.NOT_ON_SALE)
        }
    }


    getTotalPriceByCategoryIdList(categoryIdList) {
        console.log(categoryIdList)
        if (categoryIdList.length === 0) {
            return 0
        }
        const price = categoryIdList.reduce((pre, cur) => {
            const eachPrice = this.getTotalPriceEachCategory(cur)
            return accAdd(pre , eachPrice)
        }, 0);
        return price
    }

    getTotalPriceEachCategory(categoryId) {
        const price = this.orderItems.reduce((pre, orderItem) => {
            const itemCategoryId = this._isItemInCategories(orderItem, categoryId)
            if (itemCategoryId) {
                return accAdd(pre , orderItem.finalPrice)
            }
            return pre
        }, 0)
        return price
    }

    _isItemInCategories(orderItem, categoryId) {
        if (orderItem.categoryId === categoryId) {
            return true
        }
        if (orderItem.rootCategoryId === categoryId) {
            return true
        }
        return false
    }

}

export {
    Order
}
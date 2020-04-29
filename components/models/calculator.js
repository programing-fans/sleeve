import {accAdd, accMultiply, accSubtract} from "../../utils/number";

class Calculator {
    totalPrice = 0
    totalSkuCount = 0
    hasInitialized = false

    constructor() {
        if (typeof Calculator.instance === 'object') {
            return Calculator.instance
        }
        Calculator.instance = this
        return this
    }

    init(carItems) {
        this._clear()
        if(!this.hasInitialized){
            carItems.forEach(item => {
                this.push(item)
            })
            this.hasInitialized = true
        }
    }

    _clear() {
        this.totalPrice = 0
        this.totalSkuCount = 0
        this.hasInitialized = false
    }

    push(cartItem) {
        console.log(cartItem)
        if (cartItem.sku.discount_price) {
            const partTotalPrice = accMultiply(cartItem.sku.discount_price, cartItem.count)
            this.totalPrice = accAdd(partTotalPrice, this.totalPrice)
        } else {
            const partTotalPrice = accMultiply(cartItem.sku.price, cartItem.count)
            this.totalPrice = accAdd(partTotalPrice, this.totalPrice)
        }
        this.totalSkuCount += cartItem.count
    }

    unshift(cartItem) {
        if (cartItem.sku.discount_price) {
            const partTotalPrice = accMultiply(cartItem.sku.discount_price, cartItem.count)
            this.totalPrice = accSubtract(this.totalPrice, partTotalPrice)

        } else {
            const partTotalPrice = accMultiply(cartItem.sku.price, cartItem.count)
            this.totalPrice = accSubtract(this.totalPrice, partTotalPrice)
        }
        this.totalSkuCount -= cartItem.count
    }

    numFloat(cartItem, differenceCount) {
        if (cartItem.sku.discount_price) {
            const partTotalPrice = accMultiply(cartItem.sku.discount_price, differenceCount)
            console.log(partTotalPrice)
            this.totalPrice = accAdd(this.totalPrice, partTotalPrice)
        } else {
            const partTotalPrice = accMultiply(cartItem.sku.price, differenceCount)
            console.log(partTotalPrice)
            this.totalPrice = accAdd(this.totalPrice, partTotalPrice)
        }
        this.totalSkuCount += differenceCount
    }

    getTotalPrice() {
        return this.totalPrice
    }

    getTotalSkuCount() {
        return this.totalSkuCount
    }

}

export {
    Calculator
}

import {CouponType} from "../core/enum";
import {accAdd, accMultiply, accSubtract} from "../utils/number";

class CouponBO {
    id
    categoryIds = []
    type
    fullMoney
    rate
    minus
    startTime
    endTime
    title
    wholeStore
    satisfaction = null

    constructor(coupon) {
        // Object.assign(this, coupon)
        console.log(coupon)
        this.type = coupon.type
        this.fullMoney = coupon.full_money
        this.rate = coupon.rate
        this.minus = coupon.minus
        this.id = coupon.id
        this.startTime = coupon.start_time
        this.endTime = coupon.end_time
        this.wholeStore = coupon.whole_store
        this.title = coupon.title
        this.categoryIds = coupon.categories.map(category => {
            return category.id
        })
        console.log(this)
    }

    static getFinalPrice(oriPrice, couponObj) {
        console.log(oriPrice, couponObj)
        if (couponObj.satisfaction === null) {
            throw new Error('优惠券没有验证是否满足使用条件')
        }
        if (couponObj.satisfaction === false) {
            throw new Error('优惠券不满足使用条件')
        }
        let finalPrice = null
        switch (couponObj.type) {
            case CouponType.FULL_MINUS:
                console.log(oriPrice, couponObj.minus)
                return {
                    finalPrice: accSubtract(oriPrice, couponObj.minus),
                    discountMoney: couponObj.minus
                }
            case CouponType.FULL_OFF:
                const actualPrice = accMultiply(oriPrice, couponObj.rate)
                console.log(actualPrice)
                finalPrice = CouponBO.roundMoney(actualPrice)
                console.log(finalPrice)
                const discountMoney = accSubtract(oriPrice, finalPrice)
                return {
                    finalPrice:finalPrice,
                    discountMoney
                }
            case CouponType.NO_THRESHOLD_MINUS:
                finalPrice = accSubtract(oriPrice, couponObj.minus)
                finalPrice = finalPrice < 0?0:finalPrice
                return {
                    finalPrice,
                    discountMoney:couponObj.minus
                }
            default:
                throw new Error('没有找到对应优惠券类型的处理函数')
        }
    }

    static roundMoney(money) {
        // 对于小数的约束可能模式有4种：向上/向下取整、四舍五入、银行家模式
        // 前端算法模式必须同服务端保持一致，否则对于浮点数金额的运算将导致订单无法通过验证
        const final = Math.ceil(money * 100)/100
        return final
    }

    meetCondition(order) {
        // const ty
        const type = this.type
        console.log(type)
        let bottomLimitPrice;
        if(this.wholeStore){
            bottomLimitPrice = order.getTotalPrice()
            console.log(bottomLimitPrice)
        }
        else{
            bottomLimitPrice = order.getTotalPriceByCategoryIdList(this.categoryIds)
        }
        let satisfaction = false
        switch (type) {
            case CouponType.FULL_MINUS:
                satisfaction = this._fullMinusTypeIsOk(bottomLimitPrice)
                break
            case CouponType.FULL_OFF:
                satisfaction = this._fullOffTypeIsOk(bottomLimitPrice)
                break
            case CouponType.NO_THRESHOLD_MINUS:
                satisfaction = true
                break
            default:
                break
        }
        this.satisfaction = satisfaction
    }


    _fullMinusTypeIsOk(bottomLimitPrice) {
        if (bottomLimitPrice >= this.fullMoney) {
            return true
        }
        return false
    }

    _fullOffTypeIsOk(bottomLimitPrice) {
        console.log(bottomLimitPrice)
        if (bottomLimitPrice >= this.fullMoney) {
            return true
        }
        return false
    }

    _noThresholdMinusIsOk(categoryTotalPrice) {
        // if(categoryTotalPrice >= this.couponBO.fullMoney)
    }
}

export {
    CouponBO
}

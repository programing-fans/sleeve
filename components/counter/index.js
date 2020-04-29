// components/counter/index.js
import {Cart} from "../../models/cart";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        count: {
            type:Number,
            value:Cart.SKU_MIN_COUNT
        },
        max: Number
    },

    data: {
        _max: Cart.SKU_MAX_COUNT,
        _min: Cart.SKU_MIN_COUNT,
    },

    // attached() {
    //     this.setData({
    //        _max:2,
    //         count:2
    //     })
    //
    //     this.setData({
    //         _max:1,
    //         count:2
    //     })
    // },

    observers: {
        'max': function (max) {
            // if (max == null) {
            //     return
            // }
            if (max === 0) {
                return
            }
            if (max <= Cart.SKU_MAX_COUNT && max > 0) {
                this.setData({
                    _max: max,
                    count:this.properties.count
                });
            }
        }
    },

    methods: {
        onOverStep(event) {
            // const minOrMaxOut = event.detail;
            console.error(event)
            const minOrMaxOut = event.detail.type
            if (minOrMaxOut == 'overflow_max') {
                wx.showToast({
                    icon: "none",
                    duration: 3000,
                    title: `超出最大购买数量`
                })
            }
            if (minOrMaxOut == 'overflow_min') {
                wx.showToast({
                    icon:"none",
                    duration:3000,
                    title:`最少需要购买${Cart.SKU_MIN_COUNT}件噢`
                })
            }
        },
    }
})

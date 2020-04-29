// components/arrival-preview/index.js
import {SpuListType} from "../../core/enum";
import {Theme} from "../../models/theme";

Component({
    /**
     * 组件的属性列表
     */
    externalClasses:['l-class'],
    properties: {
        theme: Object,
        spuList: Array
    },


    /**
     * 组件的初始数据
     */
    data: {},

    observers: {
        'spuList': (spuList) => {
            console.log(spuList)
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onTap(event) {
            console.log(event)
            const spuId = event.currentTarget.dataset.spuId
            wx.navigateTo({
                url:`/pages/detail/detail?pid=${spuId}`
            })
            // this.triggerEvent('sputap',{
            //     spuId
            // },{
            //     bubbles:true
            // })
        },

        onMore(event) {
            console.log(event)
            wx.navigateTo({
                url:`/pages/theme-spu-list/theme-spu-list?tname=${Theme.locationE}`
            })
        }
    }
})

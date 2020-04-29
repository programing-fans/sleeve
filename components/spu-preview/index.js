// components/spu-preview/index.js

import {tagsSplit} from "../../utils/util";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        data: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        _tags: Array,
        h:{
            type:Number,
            value:360
        },
        w:{
            type:Number,
            width:340
        }
    },

    observers: {
        'data': function (data) {
            if (!data) {
                return
            }
            const tags = tagsSplit(data.tags)
            // if(tags)
            this.setData({
                tags
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onItemTap(event) {
            const pid = event.currentTarget.dataset.pid
            this.triggerEvent("itemtap", {
                pid
            }, {
                bubbles: true,
                composed: true
            })
            wx.navigateTo({
                url: `/pages/detail/detail?pid=${pid}`
            })
        },

        onLoadImg(event) {
            const {height, width} = event.detail
            this.setData({
                h: 340 * height / width,
                w: 340
            })
        }
    }
})

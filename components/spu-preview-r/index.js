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
    },

    observers: {
        'data': function (data) {
            console.log(data)
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
    }
})

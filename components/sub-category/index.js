// components/sub-category/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        categories: Array,
        bannerImg: String
    },

    /**
     * 组件初始数据
     */
    data: {},


    observers: {
        'categories': function (categories) {
            console.log(this.properties.bannerImg)
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onTapGridItem(event) {
            const cid = event.currentTarget.dataset.cid
            this.triggerEvent('itemtap', {
                cid
            })
        }
    }
})

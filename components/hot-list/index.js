import {Banner} from "../../models/banner";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        items: Array,
        titleImg: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        left: Object,
        rightTop: Object,
        rightBottom: Object
    },

    observers: {
        'items': function (items) {
            if (items.length == 0) {
                return
            }
            const leftItem = items.find(item => item.name == 'left')
            const rightTopItem = items.find(item => item.name == 'right-top')
            const rightBottomItem = items.find(item => item.name == 'right-bottom')
            this.setData({
                left: leftItem,
                rightTop: rightTopItem,
                rightBottom: rightBottomItem
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onGotToTheme(event) {
            const tName = event.currentTarget.dataset.tname
            console.log(tName)
            wx.navigateTo({
                url: `/pages/theme/theme?tname=${tName}`
            })
        },

        onGotoDetail(event) {
            const keyword = event.currentTarget.dataset.keyword
            const type = event.currentTarget.dataset.type
            Banner.gotoTarget(type, keyword)
        }
    }
})

// components/checkbox/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        checked: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onCheck(event) {
            let checked = this.properties.checked
            this.setData({
                checked: !this.properties.checked
            })
            this.triggerEvent('check',{
                checked:checked?false:true
            },{
                bubbles:true,
                composed:true
            })
        }
    }
})

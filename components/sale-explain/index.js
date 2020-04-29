// components/sale-explain/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        texts: Array,
        isTest: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {
        _isTest: Boolean,
        _texts: Array,
        additionalTestTexts: [
            '演示：本商品为演示数据，不可支付',
            '特点：你可以添加进购物车、下单，但无法支付'
        ],
        additionalTasteTexts: [
            '体验：可支付',
            '特点：本商品无实物，仅作为测试商品'
        ]
    },

    'observers': {
        'texts, isTest': function (texts, isTest) {
            console.log(texts, isTest)
            console.log(this.data.additionalTasteTexts)
            if (isTest) {
                texts = this.data.additionalTestTexts.concat(texts)
            }
            if (!isTest) {
                texts = this.data.additionalTasteTexts.concat(texts)
            }
            console.log(texts)
            this.setData({
                _texts: texts
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {}
})

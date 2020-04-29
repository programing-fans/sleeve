// components/spu-description/index.js
import {tagsSplit} from "../../utils/util";

Component({
    /**
     * 组件的属性列表
     */
    options: {},
    properties: {
        spu: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        _spu: Object,
        _tags: Array
    },

    observers: {
        'spu': function (spu) {
            if (!spu) {
                return
            }
            const tags = tagsSplit(spu.tags);
            this.setData({
                _spu: spu,
                _tags: tags
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {}
})

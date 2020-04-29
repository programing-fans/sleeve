// components/spec/index.js
import {TagStatus} from "../../core/enum";
import {Spec} from "../models/spec";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        fence: Object
    },


    /**
     * 组件的初始数据
     */
    data: {
        _firstChoose: false,
        _fence: null,
    },

    attached() {
        console.log(this.properties.fence)
    },

    observers: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onOneChoose(event) {
            const value = event.detail.name
            const colIndex = event.currentTarget.dataset.colIndex
            const valueId = value.valueId
            const keyId = this.properties.fence.keyId
            const key = this.properties.fence.key
            const status = value.status
            const spec = new Spec(key, value.value, keyId, valueId)
            this._triggerEvent(spec, status, colIndex)
        },

        _triggerEvent(spec, status, colIndex) {
            const eventObj = {
                spec,
                colIndex
            }
            if (status === TagStatus.WAITING) {
                this.triggerChooseWaitingEvent(eventObj)
            }
            if (status === TagStatus.SELECTED) {
                this.triggerChooseSelectedEvent(eventObj)
            }
        },

        triggerChooseWaitingEvent(eventObj) {
            this.triggerEvent('choosewaiting', eventObj, {
                bubbles: true,
                composed: true
            })
        },

        triggerChooseSelectedEvent(eventObj) {
            this.triggerEvent('chooseselected', eventObj)
        },

        _transformToViewFence(fence) {
            const vo = {
                key: fence.key,
                keyId: fence.keyId,
                values: []
            }
            fence.values.forEach(item => {
                const subVo = {
                    valueId: item.valueId,
                    value: item.value,
                    // selected, waiting, disabled
                    status: fence.defaultValueId === item.valueId ? 'selected' : 'waiting'
                }
                vo.values.push(subVo)
            })
            return vo
        },

    }
})

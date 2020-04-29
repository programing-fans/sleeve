// components/sku/index.js
import FenceGroup from "../models/fence-group";
import {Judger} from "../models/judger";
import {TagStatus} from "../../core/enum";
import {Joiner} from "../../utils/joiner";
import Spu from "../../models/spu";
import {Cart} from "../../models/cart";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        spu: Object,
        orderWay: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        judger: Object,
        currentSkuCount: Cart.SKU_MIN_COUNT,
        fenceGroup: null,
        fullSkuKey: [],
        hasChosenSkuKey: [],

        _fences: [],
        _firstSkuImg: '',
        _spuPrice: '',
        _spuSubTitle: '',
        _sku: null,
        _skuValueStr: '',
        _noSpec: false,
        _isEmptyPending: true,
        _isIntactPending: false,
        _outStock: false,
        _waitingSpuKeyStr: ''
    },


    observers: {
        'spu': function (spu) {
            if (!spu) {
                return
            }
            if (this.noSpec(spu)) {
                this.setData({
                    _noSpec: true,
                    _sku:this.getNoSpecSku()
                })
                this.bindingSomeSpuData(spu)
                return;
            }
            let fenceGroup = new FenceGroup(spu)
            fenceGroup.initFences()
            const judger = new Judger(fenceGroup)
            fenceGroup = judger.judgeWhenInit()
            const sku = judger.getDeterminateSku()
            console.log(sku)
            if (!sku) {
                // 如果没找到默认的sku
                this.bindingSomeSpuData(spu)
            } else {
                this._setStockStatus(sku.stock, this.data.currentSkuCount)
            }
            this.data.judger = judger
            this.data.fenceGroup = fenceGroup
            this.initSkuSelectCount()
            this.bindingInitData(sku, this.getSkuCurrentValueStr(), this.getWaitingChosenSpuKeyStr())
            this.triggerSpecEvent()
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        triggerSpecEvent() {
            this.triggerEvent('specchange', {
                intactPending: this.data.judger.isIntactSku(),
                // noSpec: this.noSpec(),
                skuValueStr: this.getSkuCurrentValueStr(),
                waitingSpuKeyStr: this.getWaitingChosenSpuKeyStr()
            })
        },
        initSkuSelectCount() {
            //需要根据当前SPU可选最小值设置初始化Spu购买数量
            let count =
                this.properties.spu.min_purchase_quantity

            if (!count) {
                count = 1
            }
            this.data.currentSkuCount = count
        },
        bindingSomeSpuData(spu) {
            const firstSkuImg = spu.img
            console.log(firstSkuImg)
            const spuPrice = spu.price
            const spuSubTitle = spu.subtitle
            this.setData({
                _firstSkuImg: firstSkuImg,
                _spuPrice: spuPrice,
                _spuSubTitle: spuSubTitle,
            })
        },

        bindingInitData(sku, skuValueStr, waitingSpuKeyStr) {
            this.setData({
                _fences: this.data.fenceGroup.getFences(),
                _sku: sku,
                _skuValueStr: skuValueStr,
                _isEmptyPending: this.data.judger.isEmptyPending(),
                _isIntactPending: this.data.judger.isIntactSku(),
                _waitingSpuKeyStr: waitingSpuKeyStr
            })
        },

        noSpec() {
            const spu = this.properties.spu
            // const a = Spu.noSpec(spu)
            return Spu.noSpec(spu)
            // if (spu.sku_list.length === 1 && !spu.sku_list[0].specs) {
            //     // 无规格的情况是必须有至少一个sku，但sku的specs可以为空
            //     return true
            // } else {
            //     return false
            // }
        },

        getNoSpecSku() {
            if(this.noSpec()){
                return this.properties.spu.sku_list[0]
            }
            throw new Error('当前商品不是无规格商品')
        },

        onChooseWaiting(event) {
            const chosenSpec = event.detail.spec
            const rowIndex = event.target.dataset.rowIndex
            const colIndex = event.detail.colIndex
            const fenceGroup = this.data.judger.judge(chosenSpec, rowIndex, colIndex, TagStatus.WAITING)
            let sku;
            const isIntact = this.data.judger.isIntactSku()
            if (isIntact) {
                sku = this.data.judger.getDeterminateSku();
                this._setStockStatus(sku.stock, this.data.currentSkuCount)
                this.setData({
                    _sku: sku,
                })
            }
            const _skuValueStr = this.getSkuCurrentValueStr()
            this.setData({
                _fences: fenceGroup.getFences(),
                _skuValueStr,
                _isEmptyPending: this.data.judger.isEmptyPending(),
                _isIntactPending: this.data.judger.isIntactSku(),
                _waitingSpuKeyStr: this.getWaitingChosenSpuKeyStr()
            })
            this.triggerSpecEvent()
        },

        onChooseSelected(event) {
            const chosenSpec = event.detail.spec
            const rowIndex = event.target.dataset.rowIndex
            const colIndex = event.detail.colIndex
            const fenceGroup = this.data.judger.judge(chosenSpec, rowIndex, colIndex, TagStatus.SELECTED)
            const _skuValueStr = this.getSkuCurrentValueStr()
            this.setData({
                    _fences: fenceGroup.getFences(),
                    _skuValueStr,
                    _isEmptyPending: this.data.judger.isEmptyPending(),
                    _isIntactPending: this.data.judger.isIntactSku(),
                    _waitingSpuKeyStr: this.getWaitingChosenSpuKeyStr()
                }
            )
            this.triggerSpecEvent()

        },

        _setStockStatus(stock, currentCount) {
            this.setData({
                _outStock: this._isOutOfStock(stock, currentCount)
            })
        },

        _isOutOfStock(stock, currentCount) {
            if (!currentCount) {
                currentCount = 1
            }
            return stock < currentCount;
        },

        getSpuKeyStr() {
            const keys = this.data.fenceGroup.getSpuKeys()
            const joiner = new Joiner(', ', 2)
            keys.forEach(key => {
                joiner.join(key)
            })
            const keyStr = joiner.getStr()
            return keyStr
        },

        getWaitingChosenSpuKeyStr() {
            const keys = this.data.fenceGroup.getSpuKeys()
            const currentSkuValues = this.data.judger.getSkuCurrentValues()
            const joiner = new Joiner(', ', 2)
            for (let i = 0; i < currentSkuValues.length; i++) {
                if (!currentSkuValues[i]) {
                    joiner.join(keys[i])
                }
            }
            const waitingChosenStr = joiner.getStr()
            if (!waitingChosenStr) {
                return null
            }
            return waitingChosenStr
        },

        getSkuCurrentValueStr() {
            const values = this.data.judger.getSkuCurrentValues()
            const joiner = new Joiner('，')
            values.forEach(value => {
                joiner.join(value)
            })
            const skuStr = joiner.getStr()
            if (!skuStr) {
                return null
            }
            return skuStr
        },

        onBuyOrCart(event) {
            if(this.noSpec()){
                this.shoppingNoSpec()
            }
            else{
                this.shoppingVarious()
            }
        },

        shoppingNoSpec() {
            this.triggerShoppingEvent(this.getNoSpecSku())
        },

        triggerShoppingEvent(sku) {
            this.triggerEvent('shopping',{
                orderWay:this.properties.orderWay,
                spuId:this.properties.spu.id,
                sku:sku,
                skuCount:this.data.currentSkuCount
            })
        },

        shoppingVarious(){
            const intact = this.data.judger.isIntactSku()
            if (!intact) {
                const missKeys = this.data.judger.getMissingKeys()
                wx.showToast({
                    icon: "none",
                    title: `请选择：${missKeys.join('，')}`,
                    duration: 3000
                })
                return
            }
            this.triggerShoppingEvent(this.data._sku)
        },

        onSelectCount(event) {
            const currentCount = event.detail.count
            if (currentCount === 0) {
                console.error('不应当输入非法字符')
                return
            }
            this.data.currentSkuCount = currentCount
            if(this.noSpec()){
                this._setStockStatus(this.getNoSpecSku().stock, currentCount)
                return
            }
            if (this.data.judger.isIntactSku()) {
                const sku = this.data.judger.getDeterminateSku()
                this._setStockStatus(sku.stock, currentCount)
            }
        },

        onPreviewSkuImg(event) {
           const url = this.data._sku.img?this.data._sku.img:this.data._firstSkuImg
           wx.previewImage({
               urls:[url]
           })
        }

    }
})

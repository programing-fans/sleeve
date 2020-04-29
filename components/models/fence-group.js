import {Matrix} from "./matrix";
import {TagStatus} from "../../core/enum";
import {Fence} from "./fence";


export default class FenceGroup {
    _defaultSku = null;
    skuList = []
    spu = null
    _fences = []

    // 存储待选择的全部规格名
    _spuKeys = []

    // 存储待选择的全部规格Id
    _spuKeyIds = []
    _skuImgs = []


    constructor(spu) {
        this.skuList = spu.sku_list
        this.spu = spu
    }

    getDefaultSku() {
        if (this._defaultSku) {
            return this._defaultSku
        }
        const defaultSkuId = this.spu.default_sku_id;
        this._defaultSku = this.skuList.find(sku => sku.id == defaultSkuId)
        return this._defaultSku;
    }

    getSkuImgs() {
        if (this._skuImgs.length != 0) {
            return this._skuImgs
        }
        this._skuImgs = this.skuList.map(sku=> {
            return sku.img
        })
        return this._skuImgs
    }

    hasSketchSpec(keyId) {
        // spu是否具有可视规格
        if(!this.spu.sketch_spec_id){
            return false
        }
        if(keyId == this.spu.sketch_spec_id){
            return true
        }
        return false
    }


    getFences() {
        return this._fences
    }


    getSpuKeyIds() {
        return this._spuKeyIds
    }

    getSpuKeys() {
        return this._spuKeys
    }

    /**
     * 生成规格矩阵
     */
    initFences() {
        const matrix = this._createMatrix(this.skuList)
        const fences = []
        let currentColIndex = -1;
        matrix.forEach((element, mRowIndex, mColIndex) => {
            if (currentColIndex !== mColIndex) {
                currentColIndex = mColIndex
                fences[currentColIndex] = this._createFence(element)
            }
            this._addCellToFence(fences[currentColIndex], element)
        })
        if (this.getDefaultSku()) {
            this._setAllFencesDefaultValuedId(fences)
        }
        this._initSpuKeysAndIds(fences)
        this._fences = fences
    }

    _initSpuKeysAndIds(fences) {
        console.log(fences,123131)
        const keys = []
        const keyIds = []
        fences.forEach(fence => {
            keys.push(fence.key)
            keyIds.push(fence.keyId)
        })
        this._spuKeys = keys
        this._spuKeyIds = keyIds
    }

    _createFence(mElement){
        // {"key": "颜色", "value": "黑色", "key_id": 1, "value_id": 12},
        const fence = new Fence()
        fence.key = mElement.key
        fence.keyId = mElement.key_id
        fence.values = []
        // fence.sketchImgs = []
        // 暂存规格值id，防止重复加入
        fence.valuesTemp = []
        fence.defaultValueId = null
        fence.defaultValue = null
        fence.isSketchLine = this.hasSketchSpec(mElement.key_id)
        fence.sketchImgs = this.hasSketchSpec(mElement.key_id)?this.getSkuImgs():[]
        return fence
    }

    changeStatus(rowIndex, colIndex, tagStatus) {
        const fence = this._fences[rowIndex]
        fence.changeStatus(colIndex, tagStatus)
    }

// 核心方法，产生需要判断的路径
    eachToBeCheckedValue(callback) {
        for (let i = 0; i < this._fences.length; i++) {
            for (let j = 0; j < this._fences[i].values.length; j++) {
                const value = this._fences[i].values[j]
                callback(value, i, j)
            }
        }
    }


    _setAllFencesDefaultValuedId(fenceGroup) {
        fenceGroup.forEach(item => {
            this.getDefaultSku().specs.forEach(spec => {
                if (item.keyId === spec.key_id) {
                    item.defaultValueId = spec.value_id
                    item.defaultValue = spec.value
                }
            })
        })
    }

    _addCellToFence(fence, element) {
        if (fence.valuesTemp.includes(element.value_id)) {
            // 如果某种规格名已经加入到Fence中，则不要重复添加
            return
        }
        fence.valuesTemp.push(element.value_id)
        const isDefaultValue = this._isDefaultSpecValue(element.value_id)
        console.log(fence, element)
        const valueObj = {
            value: element.value,
            valueId: element.value_id,
            default: isDefaultValue,
            status: isDefaultValue ? TagStatus.SELECTED : TagStatus.WAITING,
            skuImg: fence.isSketchLine ? this._getCellSkuImg(fence.keyId, element.value_id):null
        }
        fence.values.push(valueObj)
    }

    _getCellSkuImg(keyId, valueId) {
        const specCode = keyId + '-' + valueId
        console.log(specCode)
        // if (this._skuImgs.length != 0) {
        //     return this._skuImgs
        // }
        // this._skuImgs = this.skuList.map(sku=> {
        //     return sku.img
        // })
        // return this._skuImgs
        console.log(this.skuList)
        const sku = this.skuList.find(s=> s.code.indexOf(specCode) != -1)
        console.log(sku)
        return sku.img
    }


    _addSketchSpecImg(fence, element) {

    }

    _isSketchSpec() {

    }

    _isDefaultSpecValue(valueId) {
        // 如果是默认Sku规格值，那么需要标记为选中
        const defaultSku = this.getDefaultSku()
        if (!defaultSku) {
            // 如果当前Spu根本就没有设置默认规格
            return false
        }
        for (let spec of defaultSku.specs) {
            if (valueId === spec.value_id) {
                return true
            }
        }
        return false
    }

    _createMatrix(skuList) {
        const m = []
        skuList.forEach((sku) => {
            m.push(sku.specs)
        })
        return new Matrix(m)
    }
}

import {SkuCode} from "./sku-code";
import {SkuPending} from "./sku-pending";
import {Matrix} from "./matrix";
import {TagStatus} from "../../core/enum";
import {Spec} from "./spec";
import {Joiner} from "../../utils/joiner";

class Judger {
    _potentialPaths = []
    _fenceGroup = []
    _skuPending = null
    _matrix = null

    constructor(fenceGroup) {
        this._fenceGroup = fenceGroup
        this._initSkuPending()
        this._initPotentialPaths()
        this._initValueMatrix()
    }

    getDeterminateSku(){
        const code = this._skuPending.getSkuCode()
        const sku =this._fenceGroup.spu.sku_list.find(sku=>sku.code == code)
        return sku?sku:null
    }

    isIntactSku() {
        return this._skuPending.isIntact()
    }

    isEmptyPending() {
        return this._skuPending.isEmpty()
    }


    getMissingKeys() {
        return this._skuPending.getMissingKeys()
    }

    getSkuCurrentValues(){
        return this._skuPending.getSkuCurrentValues()
    }

    _initSkuPending() {
        const fences = this._fenceGroup.getFences()
        const spuKeyIds = this._fenceGroup.getSpuKeyIds()
        const spuKeys = this._fenceGroup.getSpuKeys()
        const skuPending = new SkuPending(spuKeyIds, spuKeys ,this._fenceGroup.spu.id)
        console.log(spuKeyIds, spuKeys)
        if (this._fenceGroup.getDefaultSku()) {
            // 如果有默认SKU，才在初始化时将Sku规格加入到SkuPending中
            this._initDefaultSpecs(skuPending, fences)
        }
        this._skuPending = skuPending
    }

    _initDefaultSpecs(skuPending, fences) {
        for (let i = 0; i < fences.length; i++) {
            const fence = fences[i]
            const spec = new Spec(fence.key, fence.defaultValue, fence.keyId, fence.defaultValueId)
            skuPending.putSpec(spec, i, fences[i].getDefaultValueIndex())
        }
    }

    _initPotentialPaths() {
        this._fenceGroup.spu.sku_list.forEach(item=>{
            this.pushSkuCode(item.code)
        })
    }

    _initValueMatrix() {
        const array = []
        this._fenceGroup.getFences().map(fence => {
            array.push(fence.getValueIdArray())
        })
        this._matrix = new Matrix(array)
    }

    pushSkuCode(skuCode) {
        const sku = new SkuCode(skuCode)
        this._potentialPaths.push.apply(this._potentialPaths, sku.getSegments())
    }

    /**
     * 所有的标签值都需要产生一个判断路径
     * 并且判断路径是否在全部可选路径中
     * 如果在，那么标记可选状态
     * 如果不在，标记禁用状态
     *
     * 对于一个Fences规格名矩阵，我们首先遍历这个矩阵
     * 第1行、第2行一直到第N行
     * 遍历第1行时，第1行称为当前行
     * 当前行的规格名，如果是选中，则不需要加入判断路径，因为已经可选了
     * 如果未选中，则直接加入判断路径
     *
     * 当遍历第1行时，其他行时非当前行
     * 非当前行，需要将其某一行的已选规格名加入到路径中
     */
    findToBeCheckedPath(value, mRowIndex, mColIndex) {
        const joinerText = new Joiner('-')
        const joiner = new Joiner('-')
        // console.log('---------')
        for (let i = 0; i < this._fenceGroup.getFences().length; i++) {
            const selected = this._skuPending.findSelectedValueInRow(i)
            // console.log(selected)
            if(Judger._isCurrentTagSelected(selected, mRowIndex, mColIndex)){
                return null
            }
            if (mRowIndex == i) {
                // 如果是当前行
                joinerText.join(value.value)
                joiner.join(value.valueId)
            } else {
                if (selected) {
                    joinerText.join(selected.value)
                    joiner.join(selected.valueId)
                }
            }
        }
        // console.log(joiner.getStr())
        // console.log(joinerText.getStr())
        return joiner.getStr()
    }

    static _isCurrentTagSelected(selectedTag, mRowIndex, mColIndex) {
        if (!selectedTag) {
            return false
        }
        return selectedTag.rowIndex == mRowIndex && selectedTag.colIndex == mColIndex;
    }


    judge(chosenSpec, rowIndex, colIndex, tagStatus) {
        if (tagStatus === TagStatus.WAITING) {
            this._fenceGroup.changeStatus(rowIndex, colIndex, TagStatus.SELECTED)
            this._skuPending.putSpec(chosenSpec, rowIndex, colIndex);
        }
        if (tagStatus === TagStatus.SELECTED) {
            this._fenceGroup.changeStatus(rowIndex, colIndex, TagStatus.WAITING)
            this._skuPending.removeSpec(rowIndex, colIndex)
        }
        this._fenceGroup.eachToBeCheckedValue((value, mRowIndex, mColIndex) => {
            const path = this.findToBeCheckedPath(value, mRowIndex, mColIndex)
            if (!path) {
                return
            }
            const isIn = this._isInPotentialPaths(path);
            if (isIn) {
                value.status = TagStatus.WAITING
            } else {
                value.status = TagStatus.FORBIDDEN
            }
        })
        return this._fenceGroup;
    }

    judgeWhenInit() {
        this._fenceGroup.eachToBeCheckedValue((value, mRowIndex, mColIndex) => {
            const path = this.findToBeCheckedPath(value, mRowIndex, mColIndex)
            if(!path){
                return
            }
            const isIn = this._isInPotentialPaths(path);
            if (isIn) {
                value.status = TagStatus.WAITING
            } else {
                value.status = TagStatus.FORBIDDEN
            }
        })
        return this._fenceGroup
    }


    /**
     * 某个路径片段是否在全部可能路径中
     */
    _isInPotentialPaths(path) {
        return this._potentialPaths.includes(path)
    }


}

export {
    Judger
}

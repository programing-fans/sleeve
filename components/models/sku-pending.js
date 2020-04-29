import {TagStatus} from "../../core/enum";

class SkuPending {
    _pending = []
    _size = 0
    _spuId = null
    _spuKeyIds = []
    _spuKeys = []

    constructor(spuKeyIds, spuKeys, spuId) {
        this._size = spuKeyIds.length
        this._initPending(this._size)
        this._spuId = spuId
        this._spuKeyIds = spuKeyIds
        this._spuKeys = spuKeys
    }

    _initPending(size) {
        for (let i = 0; i < size; i++) {
            this._pending.push({})
        }
    }

    putSpec(spec, rowIndex, colIndex) {
        // Spec {key: "颜色", value: "金色", keyId: 1, valueId: 19}
        // 既然可选，那么必然是提前判断出了可选，所以必须
        // 要加入到已选列表中
        const partIndex = this._pending.findIndex(part => part.keyId == spec.keyId)
        const xy = SkuPending._combinationXY(rowIndex, colIndex)
        if (partIndex == -1) {
            const partIndexInOri = this._spuKeyIds.findIndex(id => id == spec.keyId)
            // 不存在则添加
            spec.xy = xy
            spec.colIndex = colIndex
            spec.rowIndex = rowIndex
            // spec.
            this._pending[partIndexInOri] = spec
            // this._pending.push(spec)
        } else {
            // 存在则修改
            const part = this._pending[partIndex]
            part.valueId = spec.valueId
            part.value = spec.value
            part.xy = xy
            part.colIndex = colIndex
            part.rowIndex = rowIndex
        }
        // this._pendingSort()
    }

    isIntact() {
        for (let i = 0; i < this._size; i++) {
            if (this._isEmptyPart(this._pending[i])) {
                return false
            }
        }
        return true
    }

    getMissingKeys() {
        console.log(this._spuKeys)
        const keys = []
        for (let i = 0; i < this._size; i++) {
            if (this._isEmptyPart(this._pending[i])) {
                keys.push(this._spuKeys[i])
            }
        }
        return keys
    }

    isEmpty() {
        for (let i = 0; i < this._size; i++) {
            if(!this._isEmptyPart(this._pending[i])){
                return false
            }
        }
        return true
    }

    getSkuCode() {
        let skuCode = ''
        skuCode += `${this._spuId}$`
        this._pending.forEach(part => {
            if (!this._isEmptyPart(part)) {
                skuCode += `${part.keyId}-${part.valueId}#`
            }
        })
        return skuCode.substring(0, skuCode.length - 1)
    }

    _isEmptyPart(part) {
        console.log('=======', part)
        return part.keyId ? false : true
    }

    getSkuCurrentValues() {
        const values = this._pending.map(part => {
            return part.value
        })
        return values
    }


    removeSpec(rowIndex, colIndex) {
        const xy = SkuPending._combinationXY(rowIndex, colIndex)
        const index = this._pending.findIndex(
            part => part.xy === xy)
        this._pending[index] = {}
        // this._pending.splice(index, 1)
    }

    findSelectedValueInRow(rowIndex) {
        const selectedValue = this._pending.find(part => part.rowIndex == rowIndex)
        if (!selectedValue) {
            return null
        }
        return selectedValue
    }


    _pendingSort() {
        this._pending.sort((a, b) => {
            if (a.rowIndex < b.rowIndex) {
                return -1
            }
            return 1
        })
    }

    // 核心方法，找出每个value值所需要判断的路径
    // 从已选value中找出所有value，但必须排除当前待确定value所在行的已选value

    // 当前行 + 其他行已选属性
    findToBeCheckedPath(mRowIndex, mColIndex, value) {
        console.log(this._isSelectedElement(value))
        if (this._isSelectedElement(value)) {
            // 如果某个tag是已选，则不需要计算是否禁用
            return
        }
        let toBeCheckedPath = ''
        let testToBeCheckedPath = ''
        this._pending.map(part => {
            // console.log(mRowIndex, part.rowIndex)
            if (part.rowIndex == mRowIndex) {
                console.log(part.rowIndex, mRowIndex)
                testToBeCheckedPath += `${value.value}-`;
                toBeCheckedPath += `${value.valueId}-`;
            } else {
                console.log(part.rowIndex, mRowIndex)
                testToBeCheckedPath += `${part.value}-`;
                toBeCheckedPath += `${part.valueId}-`;
            }
        })
        const paths = toBeCheckedPath.substring(0, toBeCheckedPath.length - 1)
        const testPaths = testToBeCheckedPath.substring(0, testToBeCheckedPath.length - 1)
        console.log(paths)
        console.log(testPaths)
        console.log('--------')
        return paths
    }

    _isSelectedElement(value) {
        return value.status == TagStatus.SELECTED;
    }

    static _combinationXY(rowIndex, colIndex) {
        return `${rowIndex}-${colIndex}`
    }

}

export {
    SkuPending
}

import {combination} from "../../utils/util";

class SkuCode {
    _spuId = null
    _totalSegments = []
    _code = null

    constructor(code) {
        this._code = code
        this._totalSegments = this._splitToSegments()
    }

    getSegments() {
        return this._totalSegments
    }

    _splitToSegments() {
        // 拆解一个sku路径
        // 2$1-13#3-11#4-16
        const spuAndSpec = this._code.split('$')
        this._spuId = spuAndSpec[0]
        const valueIds = this._getValueIdArray(spuAndSpec[1])
        const length = valueIds.length
        const totalSegments = []
        for (let i = 1; i <= length; i++) {
            const segmentsArray = combination(valueIds, i)
            const newSegments = segmentsArray.map((segments =>{
                return segments.join('-')
            }))
            totalSegments.push.apply(totalSegments, newSegments);
        }
        return totalSegments
    }


    _getValueIdArray(specId) {
        const specSegments= specId.split('#')
        const valueIds = []
        specSegments.forEach(spec=>{
            valueIds.push(spec.split('-')[1])
        })
        return valueIds
    }


    // 获取数组中任意数量元素的组合
}

export {
    SkuCode
}



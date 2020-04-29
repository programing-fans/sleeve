import {TagStatus} from "../../core/enum";

class Fence{
    key
    keyId
    values = []
    valueTitles = []
    defaultValueId

    constructor(){
    }

    getDefaultValueIndex() {
        return this.values.findIndex(value=> value.valueId == this.defaultValueId)
    }

    changeStatus(valueIndex, tagStatus) {
        this.values[valueIndex].status = tagStatus
    }

    _refreshOtherStatus(valueIndex) {
        const value = this.values[valueIndex]
        if (value.status === TagStatus.SELECTED) {
            value.status = TagStatus.WAITING
        }
    }

    getValueIdArray() {
        return [].push(this.values.map(value=>{
            return value.valueId
        }))
    }
}

export {
    Fence
}

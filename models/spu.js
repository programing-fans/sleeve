import {Http} from "../utils/http";

export default class Spu {

    static noSpec(spu) {
        if (spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0) {
            // 无规格的情况是必须有至少一个sku，但sku的specs可以为空
            return true
        } else {
            return false
        }
    }

    static getDetail(id) {
        return Http.request({
            url: `spu/id/${id}/detail`
        });
    }
}

export {
    Spu
}

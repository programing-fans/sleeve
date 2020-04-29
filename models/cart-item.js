class CartItem {
    // spu = null
    skuId = null
    count = 0
    sku = null
    checked = true

    constructor(sku, count) {
        // this.spu = spuSimplify
        this.skuId = sku.id
        this.sku = sku
        this.count = count
    }

    plus(count) {
        this.count += count
    }
}

export {
    CartItem
}

class SpuSimplify{
    id
    // categoryId
    // rootCategoryId
    constructor(spu){
        if(!spu){
            return
        }
        this.id = spu.id
        // this.categoryId = spu.category_id
        // this.rootCategoryId = spu.root_category_id
    }

    // setData(skuCategory) {
    //     this.categoryId = skuCategory.category_id
    //     this.rootCategoryId = skuCategory.root_category_id
    // }
}

export {
    SpuSimplify
}

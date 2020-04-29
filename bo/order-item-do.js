class OrderItemDO{
    categoryId
    rootCategoryId
    finalPrice

    constructor(sku) {
        this.categoryId = sku.category_id
        this.rootCategoryId = sku.root_category_id
        this.finalPrice = sku.discount_price?sku.discount_price:sku.price
    }
}

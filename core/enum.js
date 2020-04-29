const TagStatus = {
    FORBIDDEN: 'forbidden',
    SELECTED: 'selected',
    WAITING: 'waiting'
}

const CouponCenterType = {
    ACTIVITY: 'activity',
    SPU_CATEGORY: 'spu_category'
}

const ShoppingWay = {
    CART: 'cart',
    BUY: 'buy'
}

const SpuListType = {
    THEME: 'theme',
    ROOT_CATEGORY: 'root_category',
    SUB_CATEGORY: 'sub_category',
    LATEST: 'latest'
}

const CartOperate = {
    PUSH: 'push',
    UNSHIFT: 'unshift'
}

const CartItemOperate = {
    CHECK: 'check',
    UNCHECK: 'uncheck'
}

const AuthAddress = {
    DENY: 'deny',
    NOT_AUTH: 'not_auth',
    AUTHORIZED: 'authorized'
}

const CouponType = {
    FULL_MINUS: 1,
    FULL_OFF: 2,
    NO_THRESHOLD_MINUS: 3
}

const CouponStatus = {
    CAN_COLLECT:0,
    AVAILABLE: 1,
    USED:2,
    EXPIRED:3
}

const CouponOperate = {
    PICK:'pick',
    UNPICK:'unpick'
}


const OrderExceptionType={
    BEYOND_STOCK: 'beyond_stock',
    BEYOND_SKU_MAX_COUNT:'beyond_sku_max_count',
    BEYOND_ITEM_MAX_COUNT: 'beyond_item_max_count',
    SOLD_OUT:'sold_out',
    NOT_ON_SALE:'not_on_sale',
    EMPTY:'empty'
}

const OrderStatus = {
    ALL:0,
    UNPAID:1,
    PAID:2,
    DELIVERED:3,
    FINISHED:4,
    CANCELED:5,
}

const BannerItemType = {
    SPU:1,
    THEME:2,
    SPU_LIST:3
}

export {
    TagStatus,
    CouponCenterType,
    ShoppingWay,
    CartOperate,
    CartItemOperate,
    CouponOperate,
    SpuListType,
    AuthAddress,
    CouponType,
    OrderExceptionType,
    OrderStatus,
    CouponStatus,
    BannerItemType
}



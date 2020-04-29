// pages/category/categories.js
import {Categories} from "../../models/categories";
import {getWindowSize} from "../../utils/system";
import {SpuListType} from "../../core/enum";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentSubs: [],
        currentBannerImg: String,

        categoriesObj: null,
        segHeight: 0,
        containerHeight: 0,
        defaultRootId: 2
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initCategoryData()
        this.setDynamicScrollHeight()
    },

    async setDynamicScrollHeight() {
        const res = await getWindowSize()
        const rate = 750 / res.screenWidth
        const windowHeightRpx = res.windowHeight * rate
        const r = windowHeightRpx - 72
        this.setData({
            segHeight: r
        })
    },

    cal() {
        let query = wx.createSelectorQuery().in(this)
        query.select('.search-container').boundingClientRect(function (res) {
            //在这里做计算，res里有需要的数据
        }).exec()
    },


    async initCategoryData() {
        const categoriesObj = new Categories()
        this.data.categoriesObj = categoriesObj
        await categoriesObj.getAll()
        const roots = categoriesObj.getRoots()
        this.setData({
            roots
        })
        let defaultRoot = roots.find(r => r.id === this.data.defaultRootId)
        if (!defaultRoot) {
            defaultRoot = roots[0]
        }
        const currentSubs = categoriesObj.getSubs(defaultRoot.id);
        this.setData({
            currentSubs,
            currentBannerImg:defaultRoot.img
        })
    },

    onGotoSearch() {
        wx.navigateTo({
            url: `/pages/search/index`
        })
    },

    onJumpToSpuList(event) {
        const cid = event.detail.cid;

        wx.navigateTo({
            url: `/pages/spu-list/spu-list?cid=${cid}&type=${SpuListType.SUB_CATEGORY}`
        })
    },

    onSegChange(event) {
        const rootId = event.detail.activeKey
        const currentSubs = this.data.categoriesObj.getSubs(rootId)
        const currentRoot = this.data.categoriesObj.getRoot(rootId)
        this.setData({
            currentSubs,
            currentBannerImg:currentRoot.img
        })
    },

    onShareAppMessage() {

    }

})
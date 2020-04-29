// pages/home/home.js
import {Banner} from "../../models/banner";
import {Theme} from "../../models/theme";
import {SpuPaging} from "../../models/spu-paging";
import {Categories} from "../../models/categories";
import {Activity} from "../../models/activity";
import {CouponCenterType} from "../../core/enum";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        banner: null,
        loading: false,
        loadingType: 'loading',
        spuPaging: Object,
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.lin.showLoading({
            color: '#157658',
            type: 'flash',
            fullScreen: true
        })
        await this.initAllData()
        wx.lin.hideLoading()
        this.initBottomSpuList()
    },

    goToTheme(event) {
        const tName = event.currentTarget.dataset.tname
        wx.navigateTo({
            url: `/pages/theme/theme?tname=${tName}`
        })
    },

    onGotoBanner(event) {
        const keyword = event.currentTarget.dataset.keyword
        const type = event.currentTarget.dataset.type
        Banner.gotoTarget(type, keyword)
    },


    gotoTopTheme(event) {
        const tName = event.currentTarget.dataset.tname
        wx.navigateTo({
            url: `/pages/spu-list/spu-list?type=theme&tname=${tName}`
        })
    },

    onGoToDetail(event) {
        const spuId = event.detail.spuId
        wx.navigateTo({
            url: `/pages/detail/detail?pid=${spuId}`
        })
    },

    onGoToCoupons(event) {
        const name = event.currentTarget.dataset.aname
        wx.navigateTo({
            url: `/pages/coupon/coupon?name=${name}&type=${CouponCenterType.ACTIVITY}`
        })
    },

    onItemTap(event) {
    },

    async onReachBottom() {
        let data = await this.data.spuPaging.getMoreData()
        if (!data) {
            return
        }
        if (data.data && data.diff) {
            wx.lin.renderWaterFlow(data.data);
        }
        if (!data.moreData) {
            this.setData({
                loadingType: 'end'
            })
        }
    },

    async initBottomSpuList() {
        const paging = await SpuPaging.getLatestPaging()
        const data = await paging.getMoreData()
        if (!data) {
            return
        }
        this.data.spuPaging = paging
        // console.log(paging)
        wx.lin.renderWaterFlow(data.data, true)
    },


    async initAllData() {
        const bannerB = await Banner.getHomeLocationB()

        const gridCategory = await Categories.getGridCategories()

        const theme = new Theme()

        await theme.getThemes()

        const themeA = theme.getHomeLocationA()

        const activityD = await Activity.getHomeLocationD()
        // const activityE = await Activity.getHomeLocationE()

        const themeE = theme.getHomeLocationE()
        let themeESpuList = []
        if (themeE.online) {
            const data = await Theme.getHomeLocationESpuList()
            if (data) {
                themeESpuList = data.spu_list.slice(0, 10);
            }
        }


        const themeF = theme.getHomeLocationF()

        const bannerG = await Banner.getHomeLocationG();

        const themeH = theme.getHomeLocationH();

        this.setData({
            loadingType: 'loading',
            themeA,
            bannerB,
            gridCategory,
            activityD,
            // activityE,
            themeF,
            themeESpuList,
            themeE,
            bannerG,
            themeH
        })

    },

    onPullDownRefresh() {
        this.initAllData()
        this.initBottomSpuList()
        wx.stopPullDownRefresh()
    },

    onLoadImg(event) {
        const {height, width} = event.detail
        console.log(height, width)
        this.setData({
            h: height,
            w: width,
        })
    },

    onShareAppMessage() {

    }

})
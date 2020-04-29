// pages/search/search.js
import {Tag} from "../../models/tag";
import {showToast} from "../../utils/ui";
import {HistoryKeyword} from "../../models/history-keyword";
import {Search} from "../../models/search";

const history = new HistoryKeyword()
Component({

    /**
     * 页面的初始数据
     */
    data: {
        q:'',
        historyTags: Array,
        hotTags: Array,
        search: false,
        items: [],
        loadingType:'loading',
        centerLoading:false,
        bottomLoading:true,
    },

    lifetimes: {
        async attached() {
            const hotTags = await Tag.getSearchTags();
            this.setData({
                hotTags,
                historyTags: history.get()
            })
        },
    },

    methods: {
        async onSearch(event) {
            wx.lin.hideEmpty()
            this.setData({
                search: true,
                items:[]
            })
            const keyword = event.detail.value || event.detail.name
            if (!keyword) {
                showToast('请输入搜索词')
                return
            }
            history.save(keyword)
            this.setData({
                historyTags: history.get(),
                q:keyword
            })
            const paging = Search.search(keyword)
            wx.lin.showLoading({
                color:'#157658',
                type:'flash',
                // fullScreen:true
            })
            const data = await paging.getMoreData()
            wx.lin.hideLoading()
            // wx.lin.renderWaterFlow(data.data)
            this.bindItems(data)
        },

        bindItems(data) {
            if(data.empty){
                wx.lin.showEmpty()
                this.setData({
                    bottomLoading: false
                })
                return
            }
            if (data.accumulator.length !== 0 && data.diff){
                this.setData({
                    items:data.accumulator,
                    bottomLoading:true
                });
            }
            if(!data.moreData){
                this.setData({
                    loadingType:'end',
                    bottomLoading:true
                })
            }
        },


        onCancel(event) {
            wx.lin.hideEmpty()
            this.setData({
                search:false
            })
            // wx.lin.renderWaterFlow([], true)
        },

        onDeleteHistory(event) {
            history.clear()
            this.setData({
                historyTags: []
            })
        },
    }
})
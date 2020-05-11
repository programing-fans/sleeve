Page({

    /**
     * 页面的初始数据
     */
    data: {
        urlCourse: '',
        urlGit: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    onCopyGit() {
        wx.setClipboardData({
            data: this.data.urlGit
        })
    },

    onCopyCourse() {
        wx.setClipboardData({
            data: this.data.urlCourse
        })
    },

    save(event) {
        wx.previewImage({
            urls: ["http://i2.sleeve.7yue.pro/wx.jpg"]
        })
    },

    onShareAppMessage: function () {

    }
})

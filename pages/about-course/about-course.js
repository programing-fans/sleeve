Page({
  data: {
    urlFullStack:'',
    urlOtherCourse:'',
    urlSleeve:''
  },

  onLoad: function (options) {

  },

  onCopyCourse() {
    wx.setClipboardData({
      data: this.data.urlFullStack
    })
  },

  onCopyOtherCourse() {
    wx.setClipboardData({
      data: this.data.urlOtherCourse
    })
  },

  onCopySleeve() {
    wx.setClipboardData({
      data: this.data.urlSleeve
    })
  },

  onShareAppMessage: function () {

  }
})

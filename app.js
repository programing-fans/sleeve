//app.js
import {Token} from "./models/token";
import {Cart} from "./models/cart";

App({
  onLaunch: function () {
    // 展示本地存储能力
    const token = new Token()
    token.verify()
    const cart = new Cart()
    if(!cart.isEmpty()){
      wx.showTabBarRedDot({
        index:2
      })
    }
  },
  globalData: {
    userInfo: null,
    calculator: null
  }
})



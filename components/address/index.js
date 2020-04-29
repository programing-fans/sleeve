// components/address/index.js
import {promisic} from "../../utils/util";
import {AuthAddress} from "../../core/enum";
import {Address} from "../../models/address";

Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        hasChosen: false,
        address: {},
        showDialog:false
    },

    lifetimes:{
      attached() {
          const address = Address.getLocal()
          if (address) {
              this.setData({
                  hasChosen:true,
                  address
              })
              this.triggerEvent('address', {
                  address
              })
          }
      }
    },

    methods: {
        async onChooseAddress(event) {
            const authStatus = await this.hasAuthorizedAddress()
            if(authStatus === AuthAddress.DENY){
                this.setData({
                    showDialog:true
                })
                // wx.openSetting()
                return
            }
            this.getUserAddress()
        },

        onDialogConfirm(event){
            wx.openSetting()
        },

        // 获取地址并非一定要button授权
        async getUserAddress(){
            let res;
            try {
                res = await promisic(wx.chooseAddress)();
            } catch (e) {
                console.log(e)
            }
            console.log(res)
            if (res) {
                this.setData({
                    hasChosen: true,
                    address: res
                })
                Address.setLocal(res)
                this.triggerEvent('address', {
                    address:res
                })
            }
        },

        async hasAuthorizedAddress() {
            const setting = await promisic(wx.getSetting)();
            console.log(setting)
            const addressSetting= setting.authSetting['scope.address']
            if(addressSetting === undefined){
                return AuthAddress.NOT_AUTH
            }
            if(addressSetting === false){
                return AuthAddress.DENY
            }
            if (addressSetting === true) {
                return AuthAddress.AUTHORIZED
            }
        }
    }
})

// components/authorize/authorize.js
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //弹出登录模态窗
    showModal(theme) {
      this.setData({
        theme: theme,
        modalName: "bottomModal"
      })

      //隐藏tabbar
      //this.getTabBar().displayHide();
    },
    //关闭模态窗
    hideModal(e) {
      this.setData({
        modalName: null
      })

      //显示
      //this.getTabBar().displayShow();
    },
    getPhoneNumber: function (e) {
      console.log(e)
    },
    //用户点击微信授权登录
    bindGetUserInfo: function (e) {
      if (e.detail.userInfo) {
        //用户按了允许授权按钮            
        var that = this;
        wx.showLoading({
          title: '登录中...',
        })
        this.hideModal();
        var app = getApp()
        wx.getSetting({
          success: res => {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  let userInfo = res.userInfo;
                  let creation_date = util.formatTime(new Date())
                  userInfo._openid = app.globalData.openid;
                  userInfo.creation_date = creation_date;
                  userInfo.creation_timestamp = Date.parse(creation_date.replace(/-/g, '/')) / 1000;
                  util.request('/users/detail', {
                    openid: userInfo._openid
                  }, "GET").then(res => {
                    console.log(res)
                    if (res.data.length == 0) {
                      util.request('/users/insert', userInfo, 'POST').then(res => {
                        console.log(res)
                      })
                    } else {
                      if (res.data[0].avatarUrl !== userInfo.avatarUrl || res.data[0].nickName !== userInfo.nickName) {
                        util.request('/users/update/info', {
                          nickName: userInfo.nickName,
                          avatarUrl: userInfo.avatarUrl,
                          openid: userInfo._openid
                        }, 'POST').then(res => {
                          console.log(res)
                        })
                      }
                    }
                  })
                  wx.setStorageSync('userInfo', userInfo)
                  wx.hideLoading()
                  wx.showToast({
                    title: '登录成功',
                    icon: "success",
                    duration: 1500
                  })
                }
              })
            } else {
              that.authorize().showModal();
            }
          }
        })
      } else { //用户按了拒绝按钮           

      }
    },
    //隐私政策
    gotoPrivacy: function () {
      wx.navigateTo({
        url: '../../pages/index/privacy/privacy',
      })
    }
  }
})
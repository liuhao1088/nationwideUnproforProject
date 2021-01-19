// app.js
App({
  onLaunch() {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone 11') != -1 || modelmes.search('iPhone 12') != -1) {
          that.globalData.isIphoneX = true
        }

      }
    });
  },
  globalData: {
    userInfo: null,
    isIphoneX: false
  }
})

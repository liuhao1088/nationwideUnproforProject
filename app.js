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

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'warranty-9gxawjnlc654b1c4',
        traceUser: true,
      })
      
      
    }
    switch(wx.getStorageSync('openid')){
      case true:
        break;
      default:
        wx.cloud.callFunction({
          name: 'login'
        }).then(res =>{
          console.log(res)
          that.globalData.openid=res.result.openid;
          wx.setStorageSync('openid', res.result.openid)
        })
    }
    
  },
  preventActive (fn) {
    const self = this
    if (this.globalData.PageActive) {
      this.globalData.PageActive = false
      if (fn) fn()
      setTimeout(() => {
        self.globalData.PageActive = true
      }, 1500); //设置该时间内重复触发只执行第一次，单位ms，按实际设置
    } else {
      console.log('重复点击或触发')
    }
  },
  globalData: {
    server:'https://www.funiaopark.com',
    PageActive: true,
    openid:'',
    userInfo: null,
    isIphoneX: false
  }
})

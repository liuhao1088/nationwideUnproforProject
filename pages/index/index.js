// pages/video/video.js
var app = getApp();
var util= require('../../utils/util');
let code;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: '',
    activation: false,
    avatarUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/164224/33/3176/1736/6005080bE0d9ade5b/c768fb7219e855f9.png',
    nickName: '用户昵称'
  },
  toM:function(){
    wx.navigateTo({
      url: '../manage/manage',
    })
  },
  getScancode(e) {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var result = res.result;
        if(result.length>16){
          result=result.substring(result.length-16)
        }
        setTimeout(() => {
          _this.distinguish(result)
        }, 200)

      }
    })    
  
  },
  getInactivated() {
    let result=this.data.result;
    this.distinguish(result)
  },
  getActivated() {
    var that = this;
    switch (that.data.activation) {
      case true:
        if (!wx.getStorageSync('distinguish')) {
          that.distinguish(code)
        } else {
          let dis = wx.getStorageSync('distinguish')
          wx.navigateTo({
            url: '../inactivated/inactivated?data=' + JSON.stringify(dis),
          })
        }
        break;
      default:
        wx.showToast({
          title: '您还未激活质保卡',
          icon: 'none',
          duration: 2000
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(require('../../utils/util').toDate(1612001603,'Y/M/D h:m:s'))
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if (!wx.getStorageSync('userInfo')) {
            this.selectComponent("#authorize").showModal("#ebae5e");
            this.retrieval()
          }
        } else {
          //打开授权登录页
          this.selectComponent("#authorize").showModal("#ebae5e");
          this.retrieval()
        }
      }
    })
    wx.removeStorageSync('warranty')
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })
    if (wx.getStorageSync('openid')) {
      let openid = wx.getStorageSync('openid')
      that.check(openid)
    } else {
      wx.cloud.callFunction({
        name: 'login'
      }).then(res => {
        let openid = res.result.openid;
        that.check(openid)
      })
    }
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo')
      that.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName
      })
    }
  },
  check: function (openid) {
    var that = this;
    if (!wx.getStorageSync('warranty')) {
      util.request('/activation/detail',{
        data: openid
      },"GET").then(res=>{
        let data=res.data;
          console.log(res)
          if (data.length == 1) {
            wx.setStorageSync('warranty', data[0])
            code = data[0].warranty_code;
            that.setData({
              activation: true
            })
          }
      })
      /*wx.request({
        url: app.globalData.server + '/activation/detail',
        data:{
          data: openid
        },
        success:function(res){
          let data=res.data;
          console.log(res)
          if (data.length == 1) {
            wx.setStorageSync('warranty', data[0])
            code = data[0].warranty_code;
            that.setData({
              activation: true
            })
          }
        }
      })*/
    } else {
      let warranty = wx.getStorageSync('warranty')
      code = warranty.warranty_code;
      that.setData({
        activation: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  inputResult: function (e) {
    this.setData({
      result: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('warranty')) {
      this.setData({
        activation: true
      })
    }
  },
  distinguish: function (result) {
    var isletter = (/[a-z]/i).test(result.substring(0, 1));
    var isnum = /^\d+$/.test(result.substring(5));
    var year = parseInt(result.substring(5,9))
    var month = parseInt(result.substring(9,11))
    if (isletter == false || isnum == false || result.length !== 16 || (year<2021 || year>2024) || (month>12 || month<1)) {
      wx.showModal({
        title: '序列号格式不正确',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '识别中',
      })
      util.request('/model/detail',{
        brand_code: result.substring(0,1),
        category_code:  result.substring(1,3),
        model_code:  result.substring(3,5)
      },"GET").then(res=>{
        console.log(res)
          let list=res.data;
          wx.hideLoading({
            success: (res) => {},
          })
          switch (list.length) {
            case 1:
              if(list[0].brand_code=='B'){
                wx.showModal({
                  title: '暂无该产品信息',
                  showCancel: false
                })
              }else{
                list[0].res_code = result;
                wx.navigateTo({
                  url: '../inactivated/inactivated?data=' + JSON.stringify(list[0]),
                })
              }
              break;
            default:
              wx.showModal({
                title: '暂无该产品信息',
                showCancel: false
              })
          }
      })
      /*wx.request({
        url: app.globalData.server+'/model/detail',
        data:{
          brand_code: result.substring(0,1),
          category_code:  result.substring(1,3),
          model_code:  result.substring(3,5)
        },
        success:function(res){
          
        },
        fail:function(err){
          console.log(err)
          wx.hideLoading({
            success: (res) => {},
          })
          wx.showModal({
            title:'网络繁忙，请稍后重试',
            showCancel:false
          })
        }
      })*/
      
    }
  },
  async retrieval() {
    var that = this;
    let timing = setInterval(async () => {
      if (wx.getStorageSync('userInfo')) {
        let userInfo = wx.getStorageSync('userInfo')
        that.setData({
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        })
        setTimeout(() => {
          clearInterval(timing);
        }, 900);
      }
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/video/video.js
var app = getApp();
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
      wx.cloud.database().collection('warranty_activation').where({
        _openid: openid
      }).get().then(res => {
        let data = res.data;
        console.log(res)
        if (data.length == 1) {
          wx.setStorageSync('warranty', data[0])
          code = data[0].warranty_code;
          that.setData({
            activation: true
          })
        }
      })
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
    /*wx.request({url:'https://www.funiaopark.com/brand?page=1',success:function(res){
      console.log(res)
      wx.showModal({
        title:'请求成功',
      })
    },fail:function(res){console.log(res)}})*/
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
      wx.cloud.callFunction({
        name: 'recordQuery',
        data: {
          collection: 'warranty_model',
          where: {
            brand_code: result.substring(0, 1),
            category_code: result.substring(1, 3),
            model_code: result.substring(3, 5)
          },
          from: 'warranty_brand',
          let: {
            brand_code: '$brand_code',
          },
          match: ['$brand_code', '$$brand_code'],
          matchs: ['',''],
          project: {
            brand_code: 0
          },
          as: 'brand',
          from2: 'warranty_category',
          let2: {
            category_code: '$category_code',
            brand_code: '$brand_code'
          },
          match2: ['$category_code', '$$category_code'],
          matchs2: ['$brand_code', '$$brand_code'],
          project2: {
            category_code: 0
          },
          as2: 'category',
          sort: {
            creation_timestamp: -1
          },
          skip: 0,
          limit: 10
        }
      }).then(res => {
        let list = res.result.list
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
              list[0].brand_name = list[0].brand[0].brand_name
              list[0].category_name = list[0].category[0].category_name
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
      /*wx.showLoading({
        title: '识别中',
        })
        wx.request({
        url: app.globalData.server+'/model/detail',
        data:{
          brand_code: result.substring(0,1),
          category_code:  result.substring(1,3),
          model_code:  result.substring(3,5)
        },
        success:function(res){
          wx.hideLoading({
            success: (res) => {},
          })
          console.log(res)
          res.data[0].res_code=result;
          switch(res.data.length){
            case 1:
              wx.navigateTo({
                url: '../inactivated/inactivated?data='+JSON.stringify(res.data[0]) +'&res_code='+result,
              })
              break;
            default:
              wx.showModal({
                title:'查询错误',
                showCancel:false
              })
          }
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
      })

      wx.navigateToMiniProgram({
        appId: 'wxf63dcaf8f95ea541',
        path: 'pages/index/index',
        extraData: {},
        success(res) {
          // 打开成功
        }
      })
      */
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
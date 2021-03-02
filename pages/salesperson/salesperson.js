// pages/salesperson/salesperson.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    nickName:'',
    avatarUrl:'',
    shop:''
  },
  toSalespersonEntry(E){
    wx.navigateTo({
      url: '../salespersonEntry/salespersonEntry?data='+JSON.stringify(this.data.data),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton();
    if(!wx.getStorageSync('userInfo')){
      let type="regisiter";
      wx.redirectTo({
        url: '../salespersonEntry/salespersonEntry?type='+type,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    if(wx.getStorageSync('userInfo')){
      if(wx.getStorageSync('openid')){
        let openid=wx.getStorageSync('openid')
        that.getInfo(openid)
      }else{
        wx.cloud.callFunction({
          name:'login',
        }).then(res=>{
          let openid=res.result.openid;
          that.getInfo(openid)
        })
      }
    }
  },
  getInfo(openid){
    var that=this;
    wx.cloud.database().collection('warranty_sale').where({_openid:openid}).get().then(res=>{
      let data=res.data[0]
      let userInfo=wx.getStorageSync('userInfo')
      that.setData({
        nickName:userInfo.nickName,
        data:data,
        avatarUrl:userInfo.avatarUrl,
        shop:data.shop,
        phone:data.phone.substring(0,3)+'****'+data.phone.substring(7)
      })
    })
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
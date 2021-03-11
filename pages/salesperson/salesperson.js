// pages/salesperson/salesperson.js
var util=require('../../utils/util')
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
    var that=this;
    if(wx.getStorageSync('openid')){
      let openid=wx.getStorageSync('openid')
      that.seek(openid)
    }else{
      wx.cloud.callFunction({
        name:'login',
      }).then(res=>{
        let openid=res.result.openid;
        that.seek(openid)
      })
    }
    
  },
  
  seek:function(openid){
    var that=this;
    util.request('/sales/detail',{openid:openid},'GET').then(res=>{
      console.log(res)
      let data=res.data;
      if(data.length==0){
        let type="regisiter";
        wx.redirectTo({
          url: '../salespersonEntry/salespersonEntry?type='+type,
        })
      }else{
        let userInfo=wx.getStorageSync('userInfo')
        that.setData({
          nickName:userInfo.nickName,
          data:data[0],
          avatarUrl:userInfo.avatarUrl,
          shop:data[0].shop,
          phone:data[0].phone.substring(0,3)+'****'+data[0].phone.substring(7)
        })
      }
    })
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
    
      
  },
  getInfo(openid){

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
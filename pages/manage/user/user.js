// pages/manage/user/user.js
var util=require('../../../utils/util')
var ind;
var page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    scrollHev: '',
    search: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          widheight: res.windowHeight,
          scrollHev: res.windowHeight - 50
        });
      }
    });
    page = 1;
    this.setData({
      list: []
    })
    this.loadData()
  },
  search(e) {
    var that = this;
    that.setData({
      search: e.detail.value
    })
    page = 1;
    this.setData({
      list: []
    })
    this.loadData()
  },

  toLookup: function (e) {
    var that = this;
    ind = parseInt(e.currentTarget.dataset.index)
    wx.setStorageSync("editData", that.data.list[ind])
    wx.navigateTo({
      url: './lookup',
    })
  },
  changeSwitch: function (e) {
    var that = this;
    let ind = e.currentTarget.dataset.index;
    console.log(e)
    let auth
    if (e.detail.value == true) {
      auth = 'admin'
    } else {
      auth = 'primary'
    }
    util.request('/users/update/auth',{
      openid: that.data.list[ind].openid,
      authority: auth
    },'POST').then(res=>{

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

  },
  loadData: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    util.request('/users',{page:page},'GET').then(res=>{
      let data=res.data;
      if (data.length == 0) {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].authority == "admin") {
          data[i].isChecked = true
        } else {
          data[i].isChecked = false
        }
        if (i + 1 == data.length) {
          console.log(data)
          let alldata = that.data.list.concat(data)
          that.setData({
            list: alldata
          })
          wx.hideLoading()
          wx.hideNavigationBarLoading()
        }
      }
    })

  },
  bindDownLoad: function () {
    console.log('--下拉刷新--')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    page=page+1;
    this.loadData()
  },
  scroll:function(){
    
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
// pages/activated/activated.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'测试',
    phone:'测试',
    area:'测试',
    address:'测试'
  },
  handleInput(even) {
    let type = even.currentTarget.id;
    console.log(type, even.detail.value);
    this.setData({
      [type]: even.detail.value,
    })
  },


  update(e){
    if(!this.data.name){
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(!this.data.phone){
      wx.showToast({
        title: '请填写联系电话',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(!this.data.area){
      wx.showToast({
        title: '请填写所在地区',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(!this.data.address){
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
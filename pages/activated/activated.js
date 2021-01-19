var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '测试',
    phone: '测试',
    area: '测试',
    address: '测试',
    serviceList: [{
        "icon": "iconaixin--xian",
        "selectedIcon": "iconaixin--kuai",
        "title": "尊享体验",
        "price": "9.9",
        "tag": "质保延长1年",
        "flag": true
      },
      {
        "icon": "iconhuiyuanxianxing",
        "selectedIcon": "iconhuiyuan",
        "title": "至臻体验",
        "price": "19.9",
        "tag": "质保延长2年",
        "flag": false
      }
    ],
  },
  //弹窗
  getMeal(e) {
    let that = this;
    let target = e.currentTarget.dataset.target;
    that.setData({
      modalName: target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      checked: false
    })
  },

  select(e) {
    let serviceList = this.data.serviceList;
    let index = e.currentTarget.dataset.index;
    console.log(index);
    for (let i in serviceList) serviceList[i].flag = false
    serviceList[index].flag = true;
    this.setData({
      serviceList
    })

    console.log(this.data.serviceList);
  },

  handleInput(even) {
    let type = even.currentTarget.id;
    console.log(type, even.detail.value);
    this.setData({
      [type]: even.detail.value,
    })
  },


  update(e) {
    if (!this.data.name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '请填写联系电话',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.area) {
      wx.showToast({
        title: '请填写所在地区',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.address) {
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
    let isIphoneX = app.globalData.isIphoneX;
    console.log(isIphoneX)
    this.setData({
      isIphoneX
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
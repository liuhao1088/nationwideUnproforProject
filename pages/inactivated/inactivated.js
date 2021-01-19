// pages/inactivated/inactivated.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:[],
    serviceList: [
      {
        "icon": "iconaixin--xian",
        "selectedIcon":"iconaixin--kuai",
        "title": "尊享体验",
        "price": "9.9",
        "tag":"质保延长1年",
        "flag":true
      },
      {
        "icon": "iconhuiyuanxianxing",
        "selectedIcon":"iconhuiyuan",
        "title": "至臻体验",
        "price": "19.9",
        "tag":"质保延长2年",
        "flag":false
      }
    ],
  },
  toExplainRules(){
    wx.navigateTo({
      url: '/pages/explainRules/explainRules',
    })
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
      checked:false
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          img: res.tempFilePaths
        })
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.img,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    let img = this.data.img;
    wx.showModal({
      content: '确定要删除图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          img.splice(0, 1);
          this.setData({
            img
          })
        }
      }
    })
  },
  select(e){
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
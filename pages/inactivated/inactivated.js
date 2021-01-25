// pages/inactivated/inactivated.js
var app=getApp()
var util=require('../../utils/util.js')
let timer;
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
    data:'',
    shop:'',
    name:'',
    phone:'',
    area:'',
    address:'',
    activation:false,
    avatarUrl:'https://img10.360buyimg.com/ddimg/jfs/t1/164224/33/3176/1736/6005080bE0d9ade5b/c768fb7219e855f9.png',
    nickName:'用户昵称',
    card:'XXX XXX XXXX'
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
    if(wx.getStorageSync('userInfo')){
      let userInfo=wx.getStorageSync('userInfo')
      this.setData({
        avatarUrl:userInfo.avatarUrl,
        nickName:userInfo.nickName
      })
    }
    if(options.data){
      let data=JSON.parse(options.data)
      console.log(data)
      setTimeout(()=>{
        this.setData({data:data})
      },200)
      if(wx.getStorageSync('warranty')){
        let list=wx.getStorageSync('warranty');
        this.setData({
          activation:true,
          shop:list.warranty_shop,
          img:list.warranty_img,
          name:list.warranty_name,
          phone:list.warranty_phone,
          area:list.warranty_area,
          address:list.warranty_address,
          card:list.warranty_card.substring(0,3)+" "+list.warranty_card.substring(3,6)+" "+list.warranty_card.substring(6)
        })
      }
    }
  },
  inputShop:function(e){
    this.setData({
      shop:e.detail.value
    })
  },
  inputName:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  inputPhone:function(e){
    this.setData({
      phone:e.detail.value
    })
  },
  inputArea:function(e){
    this.setData({
      area:e.detail.value
    })
  },
  inputAddress:function(e){
    this.setData({
      address:e.detail.value
    })
  },
  async activation(){
    var that=this;
    wx.showLoading({
      title: '激活中',
    })
    if (timer) clearTimeout(timer);
    timer = setTimeout(async res => {
      let arr=[]
      if (that.data.img !== []) await util.uploadimg(0, that.data.img, 'entrucking', arr).then(res=>{ arr=res })
      that.insert(arr);
    }, 500)      
  },
  insert:function(image){
    var that=this;
    wx.showLoading({
      title: '激活中',
    })
    let code=''
    for (let e = 0; e < 10; e++) {
      code += Math.floor(Math.random() * 10)
    }  
    let info = {
      creation_date: util.formatTime(new Date()),
      creation_timestamp: Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000,
      _openid: app.globalData.openid,
      warranty_name: that.data.name,
      warranty_card: code,
      warranty_code:that.data.data.res_code,
      warranty_product:that.data.data.brand_name+' '+that.data.data.category_name+' '+that.data.data.model_name,
      warranty_shop: that.data.shop,
      warranty_phone: that.data.phone,
      warranty_area: that.data.area,
      warranty_address: that.data.address,
      warranty_img: image,
      extend:false
    };
    wx.cloud.callFunction({
      name: 'recordAdd',
      data: {
        collection: 'warranty_activation',
        addData: info
      }
    }).then(res => {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.setStorageSync('warranty', info)
      wx.setStorageSync('distinguish', that.data.data)
      that.setData({
        activation:true,
        card:code.substring(0,3)+" "+code.substring(3,6)+" "+code.substring(6)
      })
      wx.showToast({
        title: '激活成功',
        icon:'success',
        duration:2000
      })
    })
  },
  modify:function(){
    var that=this;
    wx.showLoading({
      title: '修改中',
    })
    if (timer) clearTimeout(timer);
    timer = setTimeout(async res => {
      wx.cloud.callFunction({
        name:'recordUpdate',
        data:{
          collection:'warranty_activation',
          where:{_openid:app.globalData.openid},
          updateData:{
            warranty_address:that.data.address,
            warranty_area:that.data.area,
            warranty_name:that.data.name,
            warranty_phone:that.data.phone
          }
        }
      }).then(res=>{
        wx.hideLoading({
          success: (res) => {},
        })
        let warranty=wx.getStorageSync('warranty')
        warranty.warranty_address=that.data.address
        warranty.warranty_area=that.data.area
        warranty.warranty_name=that.data.name
        warranty.warranty_phone=that.data.phone
        wx.setStorageSync('warranty', warranty)
        wx.showToast({
          title: '修改成功',
          icon:'success',
          duration:2000
        })
      })  
    }, 500)    
    
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
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderList: [{
      "sex": "男",
      "flag": true
    },
    {
      "sex": "女",
      "flag": false
    }
  ],
    btn:'修改信息',
    z:-1,
    join:false,
    name:'',
    phone:'',
    address_label:'',
    sex:'男',
    shop:'',
    number:'',
    address:'',
    address_name:'',
    detail:'',
    whetherEmpower: 'yes',
  },
  select(e) {
    let genderList = this.data.genderList;
    let index = e.currentTarget.dataset.index;
    console.log(index);
    for (let i in genderList) genderList[i].flag = false
    genderList[index].flag = true;
    this.setData({
      genderList,
      sex:genderList[index].sex
    })
  },
  inputName(e){
    this.setData({
      name:e.detail.value
    })
  },
  inputPhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  inputShop(e){
    this.setData({
      shop:e.detail.value
    })
  },
  inputNumber(e){
    this.setData({
      number:e.detail.value
    })
  },
  inputAddress(e){
    this.setData({
      address:e.detail.value
    })
  },
  inputAddress_name(e){
    this.setData({
      address_name:e.detail.value
    })
  },
  inputDetail(e){
    this.setData({
      detail:e.detail.value
    })
  },
  chooseLocation:function(e){
    var that=this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        let addressJson = res;
        wx.setStorageSync('addressJson', addressJson)
        that.setData({
          address: res.address,
          address_name: res.name,
          modalName: 'address',
          z: 200
        })
      },
    })
  },
  changeInput: function () {
    var _this = this;
    this.hideModal()
    setTimeout(res => {
      _this.setData({
        whetherEmpower: 'no'
      })
    })
  },
  hideModal(e){
    if(this.data.modalName=='address'){
      let string = this.data.address + this.data.detail;
      let label =''
      label = '...' + string.substring(string.length - 7, string.length)
      this.setData({
        address_label: label
      })
    }
    this.setData({
      modalName: null,
      z: -1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton();
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal("#0178C1");
    }
    if(options.type){
      console.log(options.type)
      wx.setNavigationBarTitle({
        title: "注册"
      })
      this.setData({
        btn:'注册',
        join:true
      })
      console.log(this.data.type)
    }else{
      var that=this;
      let data=JSON.parse(options.data)
      let string=data.address+data.detail;
      that.setData({
        name:data.name,phone:data.phone,sex:data.sex,shop:data.shop,number:data.number,
        address_label:'...' + string.substring(string.length - 7, string.length),
        address:data.address,
        detail:data.detail,
        address_name:data.address_name
      })
    }
    let isIphoneX = app.globalData.isIphoneX;
    console.log(isIphoneX)
    this.setData({
      isIphoneX
    })
  },
  
  submit:function(e){
    var that=this;
    if(that.data.name==''||that.data.phone==''||that.data.address==''||that.data.shop==''){
      wx.showToast({
        title:'请填写完整内容',
        icon:'none',
        duration:1000
      })
      return
    }
    if(!wx.getStorageSync('userInfo')){
      this.selectComponent("#authorize").showModal("#0178C1");
    }else{
      wx.showLoading({
        title: '提交中',
      })
      console.log(that.data.detail)
      getApp().preventActive(async (res)=>{
        if(!app.globalData.PageActive){
          switch(that.data.btn){
            case '修改信息':
              wx.cloud.callFunction({
                name:'recordUpdate',
                data:{
                  collection:'warranty_sale',
                  where:{
                    _openid:app.globalData.openid
                  },
                  updateData:{
                    phone:that.data.phone,
                    number:that.data.number,
                    detail:that.data.detail
                  }
                }
              }).then(res=>{
                wx.hideLoading()
                wx.showToast({
                  title: '提交成功',
                  icon:'success',
                  duration:2000
                })
                setTimeout(()=>{
                  wx.navigateBack({
                    delta: 0,
                  })
                },2000)
              })
              break;
            default:
              let addressJson=wx.getStorageSync('addressJson')
              wx.cloud.callFunction({
                name:'recordAdd',
                data:{
                  collection:'warranty_sale',
                  addData:{
                    name:that.data.name,
                    _openid:app.globalData.openid,
                    sex:that.data.sex,
                    phone:that.data.phone,
                    shop:that.data.shop,
                    address:that.data.address,
                    address_name:that.data.address_name,
                    detail:that.data.detail,
                    lon:addressJson.longitude,
                    lat:addressJson.latitude,
                    number:that.data.number
                  }
                }
              }).then(res=>{
                wx.hideLoading()
                wx.showToast({
                  title: '注册成功',
                  icon:'success',
                  duration:2000
                })
                setTimeout(()=>{
                  wx.redirectTo({
                    url: '../salesperson/salesperson',
                  })
                },2000)
              })
          }
        }
      })
    }
    
  },
  lookupAddress:function(){
    this.setData({
      modalName:'address',
      z:200
    })
  },
  phoneModal: function () {
    this.setData({
      modalName: 'phoneModal',
      z: 200
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    //console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.showLoading({
        title: '授权中',
      })
      wx.cloud.callFunction({
        name: 'decode',
        data: {
          weRunData: wx.cloud.CloudID(e.detail.cloudID),
        }
      }).then(res => {
        that.setData({
          phone: res.result,
        })
        wx.hideLoading()
        that.hideModal();
        wx.showToast({
          title: '授权成功',
          icon: 'success'
        })
      }).catch(error => {
        console.log(error);
        wx.hideLoading()
        wx.showToast({
          title: '授权失败',
          icon: 'none'
        })
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
// pages/inactivated/inactivated.js
var app = getApp()
var util = require('../../utils/util.js')
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [],
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
    data: '',
    shop: '',
    name: '',
    phone: '',
    area: '选择所在地区',
    address: '',
    activation: false,
    avatarUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/164224/33/3176/1736/6005080bE0d9ade5b/c768fb7219e855f9.png',
    nickName: '用户昵称',
    card: 'xxx xxx xxxx',
    isOwner: true,
    extend: false,
    year:0,
    payfee: 990,
    z:-1,
    whetherEmpower: 'yes',
    brand:'',
    model:''
  },
  toExplainRules() {
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
      z:-1,
      checked: false
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
  select(e) {
    let serviceList = this.data.serviceList;
    let index = e.currentTarget.dataset.index;
    console.log(index);
    for (let i in serviceList) serviceList[i].flag = false
    serviceList[index].flag = true;
    this.setData({
      serviceList,
      payfee:Math.round(serviceList[index].price*100)
    })

    console.log(this.data.serviceList);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let isIphoneX = app.globalData.isIphoneX;
    console.log(isIphoneX)
    this.setData({
      isIphoneX
    })
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal("#0178C1");
      this.retrieval()
    }
    if (options) {
      let code;
      console.log(options)
      if (options.data) {
        let data = JSON.parse(options.data)
        code = data.res_code;
        setTimeout(() => {
          this.setData({
            data: data
          })
        }, 200)
      } else {
        code = options.q.substring(options.q.length - 16)
        console.log(code)
        wx.cloud.callFunction({
          name: 'multQuery',
          data: {
            collection: 'warranty_model',
            match: {
              brand_code: code.substring(0, 1),
              category_code: code.substring(1, 3),
              model_code: code.substring(3, 5)
            },
            or: [{}],
            and: [{}],
            lookup: {
              from: 'warranty_brand',
              localField: 'brand_code',
              foreignField: 'brand_code',
              as: 'brand',
            },
            lookup2: {
              from: 'warranty_category',
              localField: 'category_code',
              foreignField: 'category_code',
              as: 'category',
            },
            sort: {
              creation_date: -1
            },
            skip: 0,
            limit: 10
          }
        }).then(res => {
          let list = res.result.list
          list[0].res_code = code;
          list[0].brand_name = list[0].brand[0].brand_name
          list[0].category_name = list[0].category[0].category_name
          that.setData({
            data: list[0]
          })
        })
      }
      wx.cloud.database().collection('warranty_activation').where({
        warranty_code: code
      }).get().then(res => {
        let data = res.data;
        console.log(res)
        if (data.length == 1) {
          wx.cloud.callFunction({
            name: 'login'
          }).then(res => {
            let openid = res.result.openid;
            if (data[0]._openid == openid) {
              that.setData({
                isOwner: true
              })
              wx.setNavigationBarTitle({
                title: "我的质保卡"
              })
            } else {
              that.setData({
                isOwner: false
              })
            }
          })
          let year=0;
          if(data[0].extend_year){
            year=data[0].extend_year
          }
          that.setData({
            activation: true,
            card: data[0].warranty_card.substring(0, 3) + " " + data[0].warranty_card.substring(3, 6) + " " + data[0].warranty_card.substring(6),
            shop: data[0].warranty_shop,
            brand: data[0].warranty_car,
            img: data[0].warranty_img,
            name: data[0].warranty_name,
            phone: data[0].warranty_phone,
            area: data[0].warranty_area,
            address: data[0].warranty_address,
            nickName: data[0].nickName,
            avatarUrl: data[0].avatarUrl,
            extend: data[0].extend,
            year: year
          })
        } else {
          that.setData({
            isOwner: true,
          })
          //暂只能激活一卡
          if (wx.getStorageSync('warranty')) {
            that.setData({
              isOwner: false
            })
          }
        }
      })

    }
  },
  inputShop: function (e) {
    this.setData({
      shop: e.detail.value
    })
  },
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputArea: function (e) {
    this.setData({
      area: e.detail.value
    })
  },
  inputAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  inputBrand:function(e){
    this.setData({
      brand: e.detail.value
    })
  },
  inputModel:function(e){
    this.setData({
      model: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    var region = e.detail.value;
    this.setData({
      area: region.join('，')
    })
  },
  async activation() {
    var that = this;
    if (wx.getStorageSync('userInfo')) {
      wx.showLoading({
        title: '激活中',
      })
      wx.cloud.database().collection('activition').where({warranty_code:that.data.res_code}).get().then(res=>{
        if(res.data.length==0){
          if (timer) clearTimeout(timer);
          timer = setTimeout(async res => {
            let arr = []
            if (that.data.img !== []) await util.uploadimg(0, that.data.img, 'entrucking', arr).then(res => {
              arr = res
            })
            that.insert(arr);
          }, 500)
        }else{
          wx.showToast({
            title: '该卡已被激活',
            icon:'none'
          })
        }
      })
    } else {
      this.selectComponent("#authorize").showModal("#0178C1");
      this.retrieval()
    }
  },
  insert: function (image) {
    var that = this;
    wx.showLoading({
      title: '激活中',
    })
    let code = ''
    for (let e = 0; e < 10; e++) {
      code += Math.floor(Math.random() * 10)
    }
    let userInfo = wx.getStorageSync('userInfo')
    let info = {
      creation_date: util.formatTime(new Date()),
      creation_timestamp: Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000,
      _openid: app.globalData.openid,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      warranty_name: that.data.name,
      warranty_card: code,
      warranty_code: that.data.data.res_code,
      warranty_brand: that.data.data.brand_name,
      warranty_category: that.data.data.category_name,
      warranty_model: that.data.data.model_name,
      warranty_shop: that.data.shop,
      warranty_car: that.data.brand+' '+that.data.model,
      warranty_phone: that.data.phone,
      warranty_area: that.data.area,
      warranty_address: that.data.address,
      warranty_img: image,
      extend: false
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
        activation: true,
        card: code.substring(0, 3) + " " + code.substring(3, 6) + " " + code.substring(6),
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      })
      wx.showToast({
        title: '激活成功',
        icon: 'success',
        duration: 2000
      })
    })
  },
  modify: function () {
    var that = this;
    wx.showLoading({
      title: '修改中',
    })
    if (timer) clearTimeout(timer);
    timer = setTimeout(async res => {
      wx.cloud.callFunction({
        name: 'recordUpdate',
        data: {
          collection: 'warranty_activation',
          where: {
            _openid: app.globalData.openid
          },
          updateData: {
            warranty_address: that.data.address,
            warranty_area: that.data.area,
            warranty_name: that.data.name,
            warranty_phone: that.data.phone
          }
        }
      }).then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        let warranty = wx.getStorageSync('warranty')
        warranty.warranty_address = that.data.address
        warranty.warranty_area = that.data.area
        warranty.warranty_name = that.data.name
        warranty.warranty_phone = that.data.phone
        wx.setStorageSync('warranty', warranty)
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
      })
    }, 500)

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
  phoneModal: function () {
    this.setData({
      modalName: 'phoneModal',
      z: 200
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
  changeEmpower: function () {
    this.setData({
      whetherEmpower: 'yes'
    })
  },
  phoneConfirm: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  toChoose:function(){
    if(this.data.activation==false){
      wx.navigateTo({
        url: './chooseBrand/chooseBrand',
      })
    }
  },
  payfee:function(){
    var that=this;
    if(that.data.activation){
      var stamp=Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000;
      var str=util.getRandomCode(12)
      wx.showLoading({
        title: '支付中',
      })
      wx.cloud.callFunction({
        name:'payment',
        data:{
          str : str,
          body:"蜂鸟创客（深圳）技术有限公司-延保支付",
          No : "LB" + stamp +util.getRandomCode(),
          totalFee : that.data.payfee
        },
        success(res){
          console.log(res)
          that.pay(res.result.payment)
          wx.hideLoading()
        },
        fail(error){
          wx.hideLoading()
          console.log(error)
        },
      })
    }else{
      wx.showToast({
        title: '该卡还未激活',
        icon:'none'
      })
    }
  },
  pay(payData) {
    var py=this;
    wx.requestPayment({
      nonceStr: payData.nonceStr,
      package: payData.package,
      paySign: payData.paySign,
      timeStamp: payData.timeStamp,
      signType: 'MD5',
      success(res) {
        console.log(res)
        let year=1
        if(py.data.payfee==1990){
          year=2
        }
        py.setData({
          modalName:null,
          extend:true,
          year:year
        })
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        wx.cloud.callFunction({
          name:'recordUpdate',
          data:{
            collection:'warranty_activation',
            where:{warranty_code:py.data.data.res_code},
            updateData:{
              extend:true,
              extend_year:year
            }
          }
        })
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: '支付未成功',
          duration: 1000,
          image: "none",
        })
      }
    })
  },
  async retrieval() {
    var that = this;
    let timing = setInterval(async () => {
      if (wx.getStorageSync('userInfo')) {
        setTimeout(() => {
          clearInterval(timing);
        }, 900);
      }
    }, 1000);
  },
  isObj: function (object) { // 判断是否是object
    return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
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
    if (wx.getStorageSync('area')) {
      let area = wx.getStorageSync('area')
      this.setData({
        area: area.province + '，' + area.city + '，' + area.area
      })
      wx.removeStorageSync('area')
    }
    if (wx.getStorageSync('chooseBrand')) {
      let brand = wx.getStorageSync('chooseBrand')
      this.setData({
        brand:brand,
        modalName:'brandConfirm',
        z:200
      })
      wx.removeStorageSync('chooseBrand')
    }
    if(!wx.getStorageSync('brandList')){
      var that=this;
      wx.cloud.callFunction({
        name:'getRecord',
        data:{
          collection:'car_name',
          where:{},
          ordername:'id',order:'asc',
          skip:0
        }
      }).then(res=>{
        let data=res.result.data;
        wx.cloud.callFunction({
          name:'getRecord',
          data:{
            collection:'car_name',
            where:{},
            ordername:'id',order:'asc',
            skip:100
          }
        }).then(res=>{
          data=data.concat(res.result.data)
          wx.setStorageSync('brandList', data)
        })
      })
    }
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
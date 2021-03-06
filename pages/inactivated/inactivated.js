// pages/inactivated/inactivated.js
var app = getApp()
var util = require('../../utils/util.js')
let now=Date.parse(util.formatTime(new Date))/1000;
const server = app.globalData.server;
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [],
    serviceList: [{
        "icon": "https://img12.360buyimg.com/ddimg/jfs/t1/165485/3/8501/10734/603cab76Ebbbfa772/d3da027466dbbbbc.png",
        "selectedIcon": " https://img12.360buyimg.com/ddimg/jfs/t1/163943/36/8339/33069/603cab01Ea1ef897b/20732b865c6ab88d.png",
        "title": "尊享体验",
        "price": "9.9",
        "tag": "质保延长1年",
        "flag": true
      },
      {

        "icon": "https://img14.360buyimg.com/ddimg/jfs/t1/151776/7/20001/13466/603cab92E51061157/0c765fcb4c456874.png",
        "selectedIcon": "https://img13.360buyimg.com/ddimg/jfs/t1/161549/23/8632/14061/603cab84E152c4b8f/83d6ec25378fbf07.png",
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
    salesperson: '',
    activation: false,
    avatarUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/164224/33/3176/1736/6005080bE0d9ade5b/c768fb7219e855f9.png',
    nickName: '用户昵称',
    card: 'xxx xxx xxxx',
    isOwner: true,
    extend: 0,
    year: 0,
    payfee: 990,
    z: -1,
    whetherEmpower: 'yes',
    brand: '',
    model: '',
    noticeName: 'notice'
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
      z: -1,
      checked: false
    })
  },

  noticeModal(e) {
    this.setData({
      noticeName: 'notice'
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
      current:this.data.img[e.target.dataset.index]
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
      payfee: Math.round(serviceList[index].price * 100),
      payInd: index
    })

    //console.log(this.data.serviceList);
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
        console.log(data)
        let insurance = that.data.serviceList;
        insurance[0].price = data.extend_one;
        insurance[1].price = data.extend_two;
        setTimeout(() => {
          this.setData({
            data: data,
            serviceList: insurance,
            payfee: data.extend_one * 100
          })
        }, 200)
      } else {
        code = options.q.substring(options.q.length - 16)
        let u = '';
        for (let e = 0; e < 5; e++) {
          u += Math.floor(Math.random() * 10)
        }
        /*if(code=='A010120210300000'){
          code=code.substring(0,11)+u
        }*/
        console.log(code)
        var isnum = /^\d+$/.test(code.substring(5));
        var year = parseInt(code.substring(5, 9))
        var month = parseInt(code.substring(9, 11))
        if (!isnum || (year < 2021 || year > 2024) || (month > 12 || month < 1)) {
          wx.showModal({
            title: '产品信息格式错误',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../index/index',
                })
              }
            }
          })
        }
        util.request('/model/detail',{
          brand_code: code.substring(0,1),
          category_code:  code.substring(1,3),
          model_code:  code.substring(3,5)
        },"GET").then(res=>{
          console.log(res)
            let list=res.data;
            if (list.length == 0 || list[0].brand_code == 'B') {
              wx.showModal({
                title: '暂无该产品信息',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../index/index',
                    })
                  }
                }
              })
            }
            list[0].res_code = code;
            let insurance = that.data.serviceList;
            insurance[0].price = list[0].extend_one;
            insurance[1].price = list[0].extend_two;
            let start_date=util.toDate(now,'Y/M',86400)
            let end_date=util.toDate(now,'Y/M',31536000+86400)
            that.setData({
              data: list[0],
              start_date:start_date,
              end_date:end_date,
              serviceList: insurance,
              payfee: list[0].extend_one * 100
            })
        })
      }
      util.request('/activation/detail',{
        data: code
      },'GET').then(res=>{
        let data = res.data;
          console.log(res)
          if (data.length == 1) {
            wx.cloud.callFunction({
              name: 'login'
            }).then(res => {
              let openid = res.result.openid;
              console.log(openid)
              if (data[0].openid == openid) {
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
            let year = 0;
            if (data[0].extend_year) {
              year = data[0].extend_year
            }
            let img=[];
            img.push(data[0].warranty_img)
            for(let i in img){
              img[i]=app.globalData.fileSource+img[i];
            }
            that.setData({
              activation: true,
              card: data[0].warranty_card.substring(0, 3) + " " + data[0].warranty_card.substring(3, 6) + " " + data[0].warranty_card.substring(6),
              shop: data[0].warranty_shop,
              brand: data[0].warranty_car,
              img: img,
              name: data[0].warranty_name,
              phone: data[0].warranty_phone,
              area: data[0].warranty_area,
              salesperson: data[0].warranty_salesperson,
              nickName: data[0].nickName,
              avatarUrl: data[0].avatarUrl,
              extend: data[0].extend,
              year: year,
              start_date:data[0].start_date,
              end_date:data[0].end_date
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
          if(!that.data.activation){
            that.setData({noticeName:''})
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
  inputPerson: function (e) {
    this.setData({
      salesperson: e.detail.value
    })
  },
  inputBrand: function (e) {
    this.setData({
      brand: e.detail.value
    })
  },
  inputModel: function (e) {
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
      if (that.data.img == '') {
        wx.showToast({
          title: '请上传照片',
          icon: 'none'
        })
        return
      }
      if (that.data.brand == '') {
        wx.showToast({
          title: '请选择车型',
          icon: 'none'
        })
        return
      }
      if (that.data.name == '') {
        wx.showToast({
          title: '姓名不能为空',
          icon: 'none'
        })
        return
      }
      if (that.data.phone == '') {
        wx.showToast({
          title: '电话不能为空',
          icon: 'none'
        })
        return
      }
      if (that.data.area == '选择所在地区') {
        wx.showToast({
          title: '请选择地区',
          icon: 'none'
        })
        return
      }
      if (that.data.shop == '') {
        wx.showToast({
          title: '门店不能为空',
          icon: 'none'
        })
        return
      }
      wx.showLoading({
        title: '激活中',
      })
      util.request('/activation/detail',{
        data: that.data.data.res_code
      },"GET").then(res=>{
        if (res.data.length == 0) {
          getApp().preventActive(async (res) => {
            if (!app.globalData.PageActive) {
              wx.uploadFile({
                url: server+'/upload/image', //仅为示例，非真实的接口地址
                filePath: that.data.img[0],
                name: 'file',
                formData: {
                  'catalog': 'entrucking'
                },
                success (res){
                  console.log(res)
                  that.insert(res.data)
                },
                fail:function(res){
                  console.log(res)
                }
              })
            }
          })
          //if (timer) clearTimeout(timer);
          //timer = setTimeout(async res => {}, 500)
        } else {
          wx.showToast({
            title: '该卡已被激活',
            icon: 'none'
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
    wx.cloud.database().collection('warranty_sale').where({
      phone: that.data.salesperson
    }).get().then(res => {
      let openid='nothing'
      if (res.data.length > 0) {
        openid = res.data[0]._openid;
      }
      let code = ''
        for (let e = 0; e < 10; e++) {
          code += Math.floor(Math.random() * 10)
        }
        let start=util.toDate(now,'Y/M/D',86400)
        let end=util.toDate(now,'Y/M/D',31536000+86400)
        let userInfo = wx.getStorageSync('userInfo')
        let info = {
          creation_date: util.formatTime(new Date()),
          creation_timestamp: Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000,
          openid: app.globalData.openid,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          warranty_name: that.data.name,
          warranty_card: code,
          warranty_code: that.data.data.res_code,
          warranty_brand: that.data.data.brand_name,
          warranty_brand_code: that.data.data.res_code.substring(0, 1),
          warranty_category: that.data.data.category_name,
          warranty_category_code: that.data.data.res_code.substring(1, 3),
          warranty_model: that.data.data.model_name,
          warranty_model_code: that.data.data.res_code.substring(3, 5),
          warranty_shop: that.data.shop,
          warranty_car: that.data.brand + ' ' + that.data.model,
          warranty_phone: that.data.phone,
          warranty_area: that.data.area,
          warranty_salesperson: that.data.salesperson,
          sale_openid: openid,
          warranty_img: image,
          start_date:start,
          end_date:end,
          extend: 0
        };
        util.request('/activation/insert',info,"POST").then(res=>{
          console.log(res)
            wx.hideLoading({
              success: (res) => {},
            })
            wx.setStorageSync('warranty', info)
            wx.setStorageSync('distinguish', that.data.data)
            that.setData({
              activation: true,
              start_date:start,
              end_date:end,
              card: code.substring(0, 3) + " " + code.substring(3, 6) + " " + code.substring(6),
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl
            })
            wx.showToast({
              title: '激活成功',
              icon: 'success',
              duration: 2000
            })
            if (wx.pageScrollTo) {
              wx.pageScrollTo({
                scrollTop: 0
              })
            }
            setTimeout(() => {
              that.setData({
                modalName: 'meal'
              })
            }, 1000)
        })
        
    })

  },
  modify: function () {
    var that = this;
    if (wx.getStorageSync('userInfo')) {
      getApp().preventActive(async (res) => {
        if (!app.globalData.PageActive) {
          wx.showLoading({
            title: '修改中',
          })
          let userInfo = wx.getStorageSync('userInfo')
          util.request('/activation/update/info',{
            warranty_area: that.data.area,
            warranty_name: that.data.name,
            warranty_phone: that.data.phone,
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            warranty_code: that.data.data.res_code
          },"POST").then(res=>{
            wx.hideLoading({
              success: (res) => {},
            })
            let warranty = wx.getStorageSync('warranty')
            warranty.warranty_salesperson = that.data.salesperson
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
          /*if (timer) clearTimeout(timer);
          timer = setTimeout(async res => {
          }, 500)*/
        }
      })
    } else {
      this.selectComponent("#authorize").showModal("#0178C1");
      this.retrieval()
    }
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
  toChoose: function () {
    if (this.data.activation == false) {
      wx.navigateTo({
        url: './chooseBrand/chooseBrand',
      })
    }
  },
  payfee: function () {
    var that = this;
    if (that.data.activation) {
      var stamp = Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000;
      var str = util.getRandomCode(12)
      let No = "LB" + stamp + util.getRandomCode()
      wx.showLoading({
        title: '支付中',
      })
      wx.cloud.callFunction({
        name: 'payment',
        data: {
          str: str,
          body: "蜂鸟创客（深圳）技术有限公司-延保支付",
          No: No,
          totalFee: 1,//that.data.payfee
        },
        success(res) {
          console.log(res)
          that.pay(res.result.payment, No, that.data.payfee / 100)
          wx.hideLoading()
        },
        fail(error) {
          wx.hideLoading()
          console.log(error)
        },
      })
    } else {
      wx.showToast({
        title: '该卡还未激活',
        icon: 'none'
      })
    }
  },
  pay(payData, number, payfee) {
    var py = this;
    wx.requestPayment({
      nonceStr: payData.nonceStr,
      package: payData.package,
      paySign: payData.paySign,
      timeStamp: payData.timeStamp,
      signType: 'MD5',
      success(res) {
        console.log(res)
        let year = 1
        if (py.data.payInd == 1) {
          year = 2
        }
        wx.cloud.database().collection('warranty_sale').where({
          phone: py.data.salesperson
        }).get().then(res => {
          let openid='nothing'
          if (res.data.length > 0) {
            openid = res.data[0]._openid;
          }
          const info={
            creation_date: util.formatTime(new Date()),
            creation_timestamp: Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000,
            order_no: number,
            salesperson: py.data.salesperson,
            openid: wx.getStorageSync('openid'),
            payfee: payfee,
            shop: py.data.shop,
            warranty_code: py.data.data.res_code,
            sale_openid: openid,
            brand_code: py.data.data.res_code.substring(0, 1),
            category_code: py.data.data.res_code.substring(1, 3),
            model_code: py.data.data.res_code.substring(3, 5),
          };
          util.request('/order/insert',info,"POST").then(res=>{
            console.log(res)
          })
        })
        let endstamp=Date.parse(py.data.end_date)/1000;
        let end=util.toDate(endstamp,'Y/M/D',31536000*year)
        py.setData({
          modalName: null,
          extend: 1,
          year: year,
          end_date:end,
        })
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(()=>{
          wx.showModal({
            title:'您已经成功延保'+year+'年',
            showCancel:false,
          })
        },1000)
        util.request('/activation/update',{
          extend: 1,
          extend_year: year,
          extend_fee: payfee,
          end_date:end,
          warranty_code: py.data.data.res_code
        },"POST").then(res=>{

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
        brand: brand,
        modalName: 'brandConfirm',
        z: 200
      })
      wx.removeStorageSync('chooseBrand')
    }

    if (!wx.getStorageSync('brandList')) {
      var that = this;
      util.request('/car/name',{},"GET").then(res=>{
        let data=res.data;
        wx.setStorageSync('brandList', data)
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
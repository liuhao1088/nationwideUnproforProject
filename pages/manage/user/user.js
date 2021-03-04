// pages/manage/user/user.js
var ind;
var skip;
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
    skip = 0;
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
    skip = 0;
    this.setData({
      list: []
    })
    this.loadData()
  },
  delete: function (e) {
    var that = this;
    that.setData({
      search: ''
    })
    skip = 0;
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
    wx.cloud.callFunction({
      name: 'recordUpdate',
      data: {
        collection: 'user',
        where: {
          _openid: that.data.list[ind]._openid
        },
        updateData: {
          authority: auth
        }
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

  },
  loadData: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    const db = wx.cloud.database();
    const _ = db.command;
    wx.cloud.callFunction({
      name: 'multQuery',
      data: {
        collection: 'user',
        match: {},
        or: [{
          nickName: {
            $regex: '.*' + that.data.search,
            $options: 'i'
          }
        }, {
          creation_date: {
            $regex: '.*' + that.data.search,
            $options: 'i'
          }
        }, {
          province: {
            $regex: '.*' + that.data.search,
            $options: 'i'
          }
        }, {
          city: {
            $regex: '.*' + that.data.search,
            $options: 'i'
          }
        }, {
          sex: {
            $regex: '.*' + that.data.search,
            $options: 'i'
          }
        }, {
          type: {
            $regex: '.*' + that.data.search,
            $options: 'i'
          }
        },{
          phone: {
            $regex: '.*' + that.data.search,
            $options: 'i'
          }
        },{
          authority: {
            $regex: '.*' + that.data.search,
            $options: 'i'
          }
        }],
        and: [{}],
        lookup: {
          from: 'shop',
          localField: '_openid',
          foreignField: '_openid',
          as: 'shop',
        },
        lookup2: {
          from: 'coupon',
          localField: '_openid',
          foreignField: '_openid',
          as: 'coupon',
        },
        sort: {
          creation_date: -1
        },
        skip: skip,
        limit: 20
      }
    }).then(res => {
      console.log(res)
      let data=res.result.list;
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
    }).catch(error => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '服务器繁忙，请稍后重试',
      })
    })

  },
  bindDownLoad: function () {
    console.log('--下拉刷新--')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    skip = skip + 20;
    this.loadData()
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
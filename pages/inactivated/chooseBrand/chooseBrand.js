// miniprogram/pages/toFormWarranty/chooseCar/chooseCar.js
var brandList;
var ifmove=false;
var endindex;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], toView: "", 
    letterWeight:['800','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400','400'],
    hot: [],
    toTop:"",search:'',searchList:[],scrolly:true,scrollHev:'800',widheight:'',winwidth:'',inH:'',inTop:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    brandList=wx.getStorageSync('brandList')
    wx.setNavigationBarTitle({
      title: "选取汽车品牌"
    })
    let arr=[];
    for(let i=0;i<2;i++){
      let data=brandList.filter(item => item.bfirstletter.indexOf(that.data.letter[i])!==-1)
      console.log(data)
      arr=arr.concat(data)
      that.setData({list:arr})
      if(i==1){
        that.setData({list:brandList})
      }
    }
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          widheight: res.windowHeight,
          winwidth:res.windowWidth,
          scrollHev:res.windowHeight-50,
          inH:res.windowHeight-120,
          inTop:(res.windowHeight+50-(res.windowHeight-120))/2
        });
      }
    });
    wx.removeStorageSync('lastIndex')
  },
  //选取品牌
  chooseBrand:function(e){
    var ind = parseInt(e.currentTarget.dataset.index);
    this.getModelList(brandList,ind)
  },
  //选取搜索的品牌
  chooseSearchbrand:function(e){
    var ind = parseInt(e.currentTarget.dataset.index);
    this.getModelList(this.data.searchList,ind)
  },
  //获取品牌对应的型号
  getModelList:function(arr,ind){
    var that=this;
    wx.showLoading({
      title: '选择中',
    })
    wx.setStorageSync('chooseBrand', arr[ind].car_name)
    wx.hideLoading({
      success: (res) => {},
    })
    wx.navigateBack({
      delta:1
    })
    
  },
  //清空
  delete:function(){
    this.setData({
      search:"",searchList:[]
    })
  },
  //搜索
  search:function(e){
    this.setData({search:e.detail.value})
    console.log(e.detail.value,brandList)
    let arr = brandList.filter(item => item.car_name.indexOf(e.detail.value)!==-1)
    console.log(arr)
    this.setData({searchList:arr,toTop:0})
    if(this.data.search==""){
      this.setData({searchList:[]})
    }
  },
  touchLetter:function(e){
    var ind = parseInt(e.currentTarget.dataset.index);
    var that=this;
    console.log(that.data.letter[ind],e)
    wx.showToast({
      title: that.data.letter[ind],
      icon:'none',
    })
    let letterweight=that.data.letterWeight;
    let lastIndex;
    if(wx.getStorageSync('lastIndex')){
      lastIndex=wx.getStorageSync('lastIndex')
    }else{
      lastIndex=0
    }
    letterweight[ind]=800;
    letterweight[lastIndex]=400;
    that.setData({letterWeight:letterweight})
    this.setData({
      toView: that.data.letter[ind]
    })
    wx.setStorageSync('lastIndex', ind)
  },
  touchmoveLetter:function(e){
    var ind = parseInt(e.currentTarget.dataset.index);
    var that=this;
    var pageY=e.touches[0].pageY;
    //let index=parseInt(((pageY-50)/(520*((that.data.winwidth*2)/750)))*26-1);
    let index=parseInt((pageY-that.data.inTop)/(that.data.inH/26))
    console.log(e,pageY,index)
    endindex=index;
    ifmove=true;
    /*let letterweight=that.data.letterWeight;
    for(let i=0;i<letterweight.length;i++){
      if(i==index){
        letterweight[i]=700
      }else{
        letterweight[i]=500
      }
      if(i+1==letterweight.length){
        that.setData({
          letterWeight:letterweight
        })
      }
    }*/
    let last=wx.getStorageSync('lastInd')
    if(last==index){}else{
      wx.showToast({
        title: that.data.letter[index],
        icon:'none',
      })
      this.setData({
        toView:that.data.letter[index]
      })
    }
    wx.setStorageSync('lastInd', index)
  },
  touchstart:function(e){
    
  },
  touchend:function(e){
    var ind = parseInt(e.currentTarget.dataset.index);
    var that=this;
    if(ifmove==true){
      ind=endindex;
      ifmove=false;
    }
    console.log(that.data.letter[ind],e)
    wx.showToast({
      title: that.data.letter[ind],
      icon:'none',
    })
    let letterweight=that.data.letterWeight;
    let lastIndex;
    if(wx.getStorageSync('lastIndex')){
      lastIndex=wx.getStorageSync('lastIndex')
    }else{
      lastIndex=0
    }
    letterweight[ind]=800;
    letterweight[lastIndex]=400;
    that.setData({letterWeight:letterweight})
    this.setData({
      toView: that.data.letter[ind]
    })
    wx.setStorageSync('lastIndex', ind)
  },
  scrollview:function(e){
  },
  toTop:function(){
    this.setData({
      toTop:0
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
var app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${[year, month, day].map(formatNumber).join('-')}`
}

function toDate(number, format, next) {
  //31536000,86400
  number = number + next; //转化日期
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  format = format.replace(/\//g, '-')
  return format;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function uploadimg(i, parse, content, arr) {
  if (parse.length == 0) return;
  return new Promise((resolve, reject) => {
    let code = getRandomCode();
    let numberCode = "";
    for (let e = 0; e < 6; e++) {
      numberCode += Math.floor(Math.random() * 10)
    }
    let path = parse[i]
    let indx = path.lastIndexOf('.')
    let postfix = path.substring(indx)
    wx.cloud.uploadFile({
      cloudPath: content + '/' + content + '-' + code + "-" + numberCode + postfix,
      filePath: parse[i],
      success(res) {
        arr.push(res.fileID)
        resolve(arr);
        //that.uploadimg(i+1,parse,content,arr)
      }
    })
  })
}

function getRandomCode(num) {
  if (num == '' || num == undefined) num = 6
  let code = "";
  const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e',
    'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  for (let i = 0; i < num; i++) {
    let id = Math.round(Math.random() * 61);
    code += array[id];
  }
  return code;
}

const request = (api, data, method) => {
  let header={
    'content-type': 'application/json' // 默认值
  };
  if(method=="POST"){
    header={
      "content-type":"application/x-www-form-urlencoded"
    };
  }
  let pro = new Promise(function (resolve, reject) {
    wx.request({
      url: app.globalData.server + api,
      data: data,
      method: method,
      header: header,
      success: function (res) { 
        if (res.statusCode == 200) {
          resolve(res); //任务成功就执行resolve(),其他情况下都执行reject()
        } else {
          console.log(res)
          wx.showModal({
            title: '服务器繁忙，请稍后重试',
            showCancel: false
          })
          reject(res); //响应失败就执行reject()
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '服务器繁忙，请稍后重试',
          showCancel: false
        })
        reject(res); //API执行失败也执行reject()
      },
      complete: function (res) {}
    })

  });
  return pro;
}


module.exports = {
  formatTime,
  formatDate,
  toDate,
  getRandomCode,
  uploadimg,
  request
}
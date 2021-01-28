const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
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
  if(num==''||num==undefined) num=6
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

module.exports = {
  formatTime,
  getRandomCode,
  uploadimg
}

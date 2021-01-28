// 云函数入口文件
const cloud = require('wx-server-sdk')
 
cloud.init()
 
// 云函数入口函数
exports.main = async function(event, context) {
  const res = await cloud.cloudPay.unifiedOrder({
    "nonceStr" : event.str,
    "body" : event.body,
    "outTradeNo" : event.No,
    "spbillCreateIp" : "127.0.0.1",
    "subMchId" : "1605687354",
    "totalFee" : event.totalFee,
    "envId": "warranty-9gxawjnlc654b1c4",
    "functionName": "payment",
  })
  return res
}
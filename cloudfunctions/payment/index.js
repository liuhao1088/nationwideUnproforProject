// 云函数入口文件
const cloud = require('wx-server-sdk')
 
cloud.init()
 
// 云函数入口函数
exports.main = async function(event, context) {
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : event.body,//支付内容描述
    "outTradeNo" : event.outTradeNo,//支付订单号
    "spbillCreateIp" : event.spbillCreateIp,//这里填这个就可以
    "subMchId" : event.subMchId,
    "totalFee" : event.totalFee,//订单总金额
    "envId": "data-haima",//云开发环境ID
    "functionName": "pay_cb",//回调函数名
  })
  return res
}
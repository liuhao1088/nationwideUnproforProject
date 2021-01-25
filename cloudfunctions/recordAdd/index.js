const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  console.log(event)
  const _ = db.command
  
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection(event.collection).add({
      // data 字段表示需新增的 JSON 数据
      data: event.addData
    })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)
  } catch (e) {
    console.log(e)
  }
}
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  console.log(event)
  const _ = db.command
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection(event.collection)
    .where(event.where).orderBy(event.ordername,event.order).skip(event.skip).get()
    .then(res => {
      console.log(res)
      return res
    })
    .catch(err => console.error(err))
  } catch (e) {
    console.log(e)
  }
}
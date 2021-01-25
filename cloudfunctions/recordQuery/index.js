// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const $ = db.command.aggregate;
const _=db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //这里的update依据是event._id
    return await db.collection(event.collection).aggregate().match(event.where)
		  .lookup({
		    from: event.from,
        let:event.let,
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(event.match),$.eq(event.matchs)
          ])))
          .project(event.project).sort({creation_date:-1})
          .done(),
          as: event.as,
		  }).lookup({
		    from: event.from2,
        let:event.let2,
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(event.match2),$.eq(event.matchs2)
          ])))
          .project(event.project2).sort({creation_date:-1})
          .done(),
          as: event.as2,
		  }).sort(event.sort).skip(event.skip).limit(event.limit).end()
		  .then(res => {
        console.log(res)
        return res
      })
      .catch(err => console.error(err))
  } catch (e) {
    console.error(e)
  }
}
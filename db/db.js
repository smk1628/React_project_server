/**
 * 该模块用于连接数据库，检测其连接状态
 */

 const mongoose = require('mongoose')
 const DB_NAME = 'project_db'
 const PORT = '27017'
 const IP = 'localhost'

 mongoose.set('useCreateIndex',true) //使用一个新的索引创建器

function connectMongo(success = () => { }, error = () => { }) {
    mongoose.connect(`mongodb://${IP}:${PORT}/${DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true //使用一个统一的新的拓扑结构
    })

    //绑定数据库连接的监听
    mongoose.connection.on('open', (err) => {
        if (err) {
            console.log('数据库连接失败！', err)
            error()
        } else {
            console.log('数据库连接成功！')
            success()
        }
    })
}

module.exports = connectMongo

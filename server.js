const express = require('express')
const db = require('./db/db')
const app = express()
const loginRouter = require('./router/loginRouter')
const goodsRouter = require('./router/goodsRouter')
//const imgUploadRouter = require('./router/imgFilesRouter')
const imgUploadRouter  = require('./router/filesRouter')
const cors = require('cors')
//连接数据库
db(()=>{
    //加载静态资源
    app.use(express.static('public'))
    //允许跨域
    app.use(cors());
    app.get('/',(request,response)=>{
        response.send('server')
    })
    //使用内置中间件，用于解析post请求的urlencoded
    app.use(express.urlencoded({extended:true}))
    //app.use(express.json()) // 请求体参数是json结构: {name: tom, pwd: 123}
    //使用loginRouter中间件
    app.use(loginRouter())
    app.use(goodsRouter())
    app.use(imgUploadRouter())
    app.listen(5000,(err)=>{
        if(!err) console.log('server success')
        else console.log(err)
    }) 
})
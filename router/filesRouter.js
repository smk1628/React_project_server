/*
处理文件上传的路由
 */
const multer = require('multer')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const { Router } = require('express')
const router = new Router()
const dirPath = path.join(__dirname, '..', 'public/upload')
let jsonParser = bodyParser.json()
/* 定义储存方式 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) { //函数需手动创建文件夹
    // console.log('destination()', file)
    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, function (err) {
        if (err) {
          console.log(err)
        } else {
          cb(null, dirPath)
        }
      })
    } else {
      cb(null, dirPath)
    }
  }, //string时,服务启动将会自动创建文件夹
  filename: function (req, file, cb) {
    // 获取后缀扩展
      let extName = path.extname(file.originalname)  //.jpg
   // 获取名称
      let fileName = Date.now() 
      console.log(fileName + extName) //12423543465.jpg
      cb(null, fileName + extName)
    }
})
/* 过滤接收文件类型 */
const fileFilter = function (req, file, cb) {
  var acceptableMime = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  // 限制类型
  // null是固定写法
  if (acceptableMime.indexOf(file.mimetype) !== -1) {
    cb(null, true); // 通过上传
  } else {
    cb(null, false); // 禁止上传
  }
}
const imageUploader = multer({
  fileFilter,
  storage
}).single("file"); //文件上传预定 name 或者 字段
// 上传图片
router.post('/manage/img/upload',imageUploader, (req, res) => {
    const { file } = req
    if(file){
      res.send({
        status: 0,
        data: {
          name: file.filename,
          url: 'http://localhost:5000/upload/' + file.filename
        }
      })
    } else res.send({status:1,msg:'上传失败,请上传图片'})

  })


// 删除图片
router.post('/manage/img/delete',jsonParser, (req, res) => {
  const {name} = req.body
  fs.unlink(path.join(dirPath, name), (err) => {
    if (err) {
      console.log(err)
      res.send({
        status: 1,
        msg: '删除文件失败'
      })
    } else {
      res.send({
        status: 0
      })
    }
  })
})

module.exports = function (){
    return router    //为了迎合中间件理念，中间件应该是一个函数
}
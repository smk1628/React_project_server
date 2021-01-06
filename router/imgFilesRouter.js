const {Router} = require('express')
const path = require('path')
const multer = require('multer')
const router = new Router()
var fileFilter = function (req, file, cb) {
    var acceptableMime = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    // 限制类型
    // null是固定写法
    if (acceptableMime.indexOf(file.mimetype) !== -1) {
      cb(null, true); // 通过上传
    } else {
      cb(null, false); // 禁止上传
    }
  }


var storage = multer.diskStorage({
  //设置 上传图片服务器位置
  destination: path.resolve(__dirname, "./upload"),
  //设置 上传文件保存的文件名
  filename: function (req, file, cb) {
  // 获取后缀扩展
    let extName = file.originalname.slice(file.originalname.lastIndexOf("."))  //.jpg
 // 获取名称
    let fileName = Date.now() 
    console.log(fileName + extName) //12423543465.jpg
    cb(null, fileName + extName)
  }
})

var limits = {
    fieldSize: "12MB", //设置限制（可选）
  }

  //单张上传
const imageUploader = multer({
  fileFilter,
  storage,
  limits
}).single("file"); //文件上传预定 name 或者 字段
// --------------------------------------------------二选一
//多张上传
/* var multer = require("multer");
const imageUploader = multer({
  fileFilter,
  storage,
  limits
}).array("file");  */

router.post('/upload',imageUploader,(req,res)=>{
    console.log(req)
    res.send({'data':req.file.size,'msg':'成功'})
})

module.exports = function (){
    return router    //为了迎合中间件理念，中间件应该是一个函数
}
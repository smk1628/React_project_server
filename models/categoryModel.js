const mongoose = require('mongoose')

//操作数据库
const Schema = mongoose.Schema //引入模式对象
//创建约束对象
const categoryRule = new Schema({
    name:{
        type:String, //限制商品名必须为：字符串
        required:true, //限制商品名为必填项
        unique:true //限制用户名是唯一的
    },
    __v:{
        type:Number,
        default:0
    }
})
const categoryModel = mongoose.model('category',categoryRule)


//创建模型对象
module.exports = categoryModel  //用于生成某个集合所对应的模型对象
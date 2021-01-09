const md5 = require('md5')
const mongoose = require('mongoose')

//操作数据库
const Schema = mongoose.Schema //引入模式对象
//创建约束对象
const usersRule = new Schema({
    username:{
        type:String, //限制姓名必须为：字符串
        required:true, //限制姓名为必填项
        unique:true //限制用户名是唯一的
    },
    phone: String,
    email: String,
    password: {
        type:String, //限制密码必须为：数字
        required:true //限制密码为必填项
    },
    create_time: {
        type:Number, //设置类型必须为时间
        default:Date.now //设置默认值为当前时间
    },
    role: String,
    __v:{
        type:Number,
        default:0
    },
    admin:{
        type:Boolean,
        default:false
    }
})
const userModel = mongoose.model('users',usersRule)

//初始化默认超级管理用户
userModel.findOne({username:'admin'}).then(user=>{
    if(!user){
        userModel.create({username:'admin',password:md5('admin'),admin:true}).then(user=>{
            console.log('初始化用户: 用户名: admin 密码为: admin')
        })
    }
})

//创建模型对象
module.exports = userModel  //用于生成某个集合所对应的模型对象
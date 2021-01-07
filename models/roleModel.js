const md5 = require('md5')
const mongoose = require('mongoose')

//操作数据库
const Schema = mongoose.Schema //引入模式对象
//创建约束对象
const rolesRule = new Schema({
    rolename:{
        type:String, //限制姓名必须为：字符串
        required:true, //限制角色名为必填项
        unique:true //限制角色名是唯一的
    },
    create_time: {
        type:Number, //设置类型必须为时间
        default:Date.now //设置默认值为当前时间
    },
    auth_time:{
        type:Number
    },
    auth:{
        type:Array,
        default:new Array()
    },
    auth_master:{
        type:String,
    },
    __v:{
        type:Number,
        default:0
    }
})
const roleModel = mongoose.model('roles',rolesRule)


//创建模型对象
module.exports = roleModel  //用于生成某个集合所对应的模型对象
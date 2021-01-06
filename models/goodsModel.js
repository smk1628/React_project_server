const mongoose = require('mongoose')

//操作数据库
const Schema = mongoose.Schema //引入模式对象
//创建约束对象
const goodsRule = new Schema({
    name:{
        type:String, //限制商品名必须为：字符串
        required:true //限制商品名为必填项
    },
    desc:{  //商品描述
        type:String, 
        required:true 
    },
    pric:{  //价格
        type:Number,
        required:true 
    },
    status:{  //商品状态
        type:Number,
        required:true,
        default:1
    },
    category:{  //所属分类
        type:String, 
        required:true 
    },
    info:{  //详情
        type:String,
        required:true
    },
    imgs:{
        type:Array,
        required:true,
    },
    create_time: {  //创建时间
        type:Number, 
        default:Date.now
    },
    update_time: {  //更新时间
        type:Number, 
        default:Date.now
    },
    __v:{
        type:Number,
        default:0
    }
})
const goodsModel = mongoose.model('goods',goodsRule)
goodsModel.findOne({name:'admin'}).then(user=>{
    if(!user){
        goodsModel.create({name:'admin',desc:'111',pric:4999,status:1,category:'王者荣耀',info:'admin',imgs:['1609482256493.jpg']}).then(user=>{
            console.log('初始化商品')
        })
    }
})



//创建模型对象
module.exports = goodsModel  //用于生成某个集合所对应的模型对象
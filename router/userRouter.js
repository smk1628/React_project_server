/* 专门用来管理用户及角色的路由 */

const {Router, request} = require('express')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const jwt = require('jsonwebtoken')
const md5 = require('md5')
//创建Router实例
const router = new Router()
//引入角色模型对象
const roleModel = require('../models/roleModel')
const userModel = require('../models/userModel')
//定义验证token的中间件
const verifyToken = (req,res,next)=>{
    const token = req.get("Authorization")
    const privateKey = 'jwt' //这是私匙
    try {
        jwt.verify(token,privateKey,(err)=>{
            if(err) res.send({'status':10001,msg:'身份令牌失效，请重新登录'}) //无效token || 失效token
            else{
                next()
            }
        })
    } catch (error) {
        console.log(error)
        res.send({'status':500,msg:'服务器出现故障'})
    }
}

router.post('/role/add',jsonParser,verifyToken,(req,res)=>{
    const { rolename,creat_time } = req.body
    roleModel.create({rolename,creat_time}).then(data=>{
        res.send({status:0,data,msg:'添加角色成功'})
    }).catch(err=>{
        res.send({status:1,data:err,msg:'添加角色失败'})
    })
})
router.get('/role/list',jsonParser,verifyToken,(req,res)=>{
    roleModel.find({}).then(data=>{
        res.send({status:0,data})
    }).catch(err=>{
        res.send({status:1,data:err,msg:'获取角色失败'})
    })
})
router.post('/role/auth',jsonParser,verifyToken,(req,res)=>{
    const { _id,auth,auth_time,auth_master } = req.body
    roleModel.updateOne({_id},{auth,auth_time,auth_master}).then(()=>{
        res.send({status:0})
    }).catch(()=>{
        res.send({status:0,msg:'授权失败' })
    })
})
/* 根据角色ID获取角色权限信息 */
router.post('/role/getAuthByID',jsonParser,verifyToken,(req,res)=>{
    const {_id} = req.body
    roleModel.findOne({_id}).then(data=>{
        res.send({status:0,data})
    }).catch(()=>{
        res.send({status:1})
    })
})
/* 获取用户列表 */
router.get('/user/list',jsonParser,verifyToken,(req,res)=>{
    userModel.find({admin:false}).then((data)=>{
        res.send({status:0,data})
    }).catch(()=>{
        res.send({status:1,msg:'获取用户列表失败'})
    })
})
/* 添加用户 */
router.post('/user/add',jsonParser,verifyToken,(req,res)=>{
    const {username,password,phone,email,role} = req.body
    userModel.create({username,password:md5(password),phone,email,role}).then(()=>{
        res.send({status:0})
    }).catch(()=>{
        res.send({status:1,msg:'已存在此用户'})
    })
})
/* 修改用户 */
router.post('/user/update',jsonParser,verifyToken,(req,res)=>{
    const {_id,username,password,phone,email,role} = req.body
    userModel.updateOne({_id},{username,password,phone,email,role}).then(()=>{
        res.send({status:0})
    }).catch(()=>{
        res.send({status:1,msg:'已存在此用户'})
    })
})
/* 删除用户 */
router.post('/user/dele',jsonParser,verifyToken,(req,res)=>{
    const {_id} = req.body
    userModel.deleteOne({_id}).then(()=>{
        res.send({status:0})
    }).catch(()=>{
        res.send({status:1,msg:'删除失败请稍后再试'})
    })
})
module.exports =()=>{
    return router    //为了迎合中间件理念，中间件应该是一个函数
}
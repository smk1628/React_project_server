/**
 * 专门管理登录的业务路由
 * */

 //Router 是一个完整的中间件和路由系统，也可以看成是一个小型的app对象
//引入Router构造函数
const {Router} = require('express')
const md5 = require('md5')
const jwt = require('jsonwebtoken');  //用来生成toke
const bodyParser = require('body-parser')
let jsonParser = bodyParser.json();
//创建一个Router实例
const router = new Router()
//引入模型对象
const userModel = require('../models/userModel')
router.post('/login',jsonParser,(request,response)=>{
    //获取用户输入
    const { username,password } =request.body
    //查找用户
   userModel.findOne({username,password:md5(password)}).then(user=>{
        if(user){ //登陆成功
            let content = {name:'admin'} // 要生成token的主题信息
            let secretOrPrivateKey="jwt";// 这是加密的key（密钥）
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 60*60*24  // 24小时过期
            });
            response.send({status:0,data:user,token})
        }else{ //登录失败
            response.send({status:1,msg:'用户名或密码错误'})
        }
   }).catch(error=>{
        console.error('登陆异常')
        response.send({status:1,msg:'登陆异常, 请重新尝试'})
   })

})
//每次切换都去调用此接口 用来判断token是否失效 或者过期
/* router.post('/checkUser',jsonParser,(request,response)=>{
    let token = request.get("Authorization"); // 从Authorization中获取token
    //console.log(token)
    let secretOrPrivateKey="jwt"; // 这是加密的key（密钥）
    try {
        jwt.verify(token, secretOrPrivateKey, (err, decode)=> {
            if (err) {  //  时间失效的时候 || 伪造的token
                response.send({'status':10010,err});
            } else {
                response.send({'status':10000,decode});
            }
        })
    } catch (error) {
        console.log(error)
        response.send({'status':500,msg:'服务器出现故障'});
    }
   
    
   
}); */

module.exports = function (){
    return router    //为了迎合中间件理念，中间件应该是一个函数
}
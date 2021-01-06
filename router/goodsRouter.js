/**
 * 专门管理商品的业务路由
 * */

 //Router 是一个完整的中间件和路由系统，也可以看成是一个小型的app对象
//引入Router构造函数
const { Router, request, response } = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken'); 
let jsonParser = bodyParser.json();
//创建一个Router实例
const router = new Router()
//引入模型对象
const categoryModel = require('../models/categoryModel')
const goodsModel = require('../models/goodsModel')
/* 定义加工密匙的中间件 */
const key = (request,response,next)=>{
    const token = request.get("Authorization")
    const secretOrPrivateKey="jwt"; // 这是加密的key（密钥）
    try{
        jwt.verify(token,secretOrPrivateKey,(err)=>{
            if(err) response.send({'status':10001,msg:'身份令牌失效，请重新登录'}) //无效token || 失效token
            else{
                next()
            }
        })
    }catch(error){
        console.log(error)
        response.send({'status':500,msg:'服务器出现故障'});
    }
    
}
/* 获取分类列表 */
router.post('/category/list',jsonParser,key,(request,response)=>{
    categoryModel.find({},{__v:0}).then(data=>{
        if(data){
            response.send({'status':0,'data':data.reverse()})
        }
    }).catch(err=>{
            response.send({'status':1,'msg':'商品分类获取失败'})
    })
})
/* 添加分类列表 */
router.post('/category/add',jsonParser,key,(request,response)=>{
    const { name } = request.body
    ategoryModel.findOne({name}).then(data=>{
        if(data == null){
            categoryModel.create({name}).then(data=>{
                if(data){
                   setTimeout(()=>{
                    response.send({'status':0,msg:'商品分类添加成功',data})
                   },1000)
                }
            }).catch(err=>{
                    response.send({'status':1,msg:'商品分类添加失败'})
            })
        }else{
            response.send({'status':1,'msg':'该分类已存在'})
        }
    }).catch((err)=>{
       response.send({'status':1,'msg':'商品分类添加失败'})
    })
})
/* 修改商品分类 */
router.post('/category/update',jsonParser,key,(request,response)=>{
    const {_id,name} = request.body
    categoryModel.findOne({name}).then(data=>{
        if(data === null){
             categoryModel.updateOne({_id},{name}).then(data=>{
                 if(data != null){
                     setTimeout(()=>{
                         response.send({'status':0,msg:'商品分类修改成功',data})
                     },1000)
                 }
             }).catch(err=>{
                 response.send({'status':1,msg:'商品分类修改失败'})
             })
        }else{
             response.send({'status':1,'msg':'该分类已存在'})
        }
    })
})
/* 按页获取商品信息 */
router.get('/goods/list',jsonParser,key,(request,response)=>{
    const { CurrentPage, pageSize} = request.query  //{当前页，每页信息条数}
    goodsModel.find({}).limit(parseInt(pageSize)).skip((parseInt(CurrentPage)-1)*parseInt(pageSize))
    .then(data=>{
        goodsModel.countDocuments({})
        .then(count=>{
            response.send({'status':0,'data':data,'count':count})
        })
    })
})
/* 修改商品状态 */
router.post('/goods/update_status',jsonParser,key,(request,response)=>{
    const { _id,status} = request.body //{当前页，每页信息条数}
    goodsModel.updateOne({_id},{status}).then(data=>{
        response.send({'status':0,'data':data,msg:'修改商品状态成功'})
    }).catch(err=>{
        response.send({'status':1,'data':err,msg:'修改数据失败'})
    })
})
/* 获取搜索商品信息 */
router.get('/goods/search',jsonParser,key,(request,response)=>{
    const { CurrentPage, pageSize,productName,productDesc} = request.query
    let $name
    let $key
    if(productName){
        $name = 'name'
        $key = productName
    }else{
        $name = 'desc'
        $key = productDesc
    }
    goodsModel.find({[$name]:{ $regex:$key }}).limit(parseInt(pageSize)).skip((parseInt(CurrentPage)-1)*parseInt(pageSize))
    .then(data=>{
        goodsModel.countDocuments({[$name]:{ $regex:$key }})
        .then(count=>{
            response.send({'status':0,data,count,'msg':'ok'})
        }).catch(err=>{
            response.send({'status':1,'data':err,'msg':'error'})
        })
    }).catch(err=>{
        response.send({'status':1,'data':err,'msg':'error'})
    })
})
/* 根据id获取商品信息 */
router.get('/goods/get_by_id',jsonParser,key,(request,response)=>{
    const { _id } = request.query
    goodsModel.findOne({_id}).then(data=>{
        response.send({status:0,'data':data,msg:'ok'})
    }).catch(err=>{
        response.send({status:1,data:err,msg:'err'})
    })
})
/* 根据id获取商品分类 */
router.get('/category/get_by_id',jsonParser,key,(request,response)=>{
    const { _id } = request.query
    categoryModel.findOne({_id},{__v:0,_id:0}).then(data=>{
        if(data){
            response.send({'status':0,'data':data})
        }
    }).catch(err=>{
            response.send({'status':1,'msg':'商品分类获取失败'})
    })
})
/* 添加商品 */
router.post('/goods/add',jsonParser,key,(request,response)=>{
    const { name,desc,pric,category,info,imgs } = request.body
    console.log(request.body)
    goodsModel.create( { name,desc,pric:parseFloat(pric),category,info,imgs }).then(data=>{
        if(data){
            response.send({'status':0,'data':data})
        }
    }).catch(err=>{
            response.send({'status':1,'msg':'商品添加失败'})
    })
})
module.exports = function (){
    return router    //为了迎合中间件理念，中间件应该是一个函数
}
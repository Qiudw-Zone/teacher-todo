var dbConf = require("../dbmodule/mgdbConf");
var mogos = require("../dbmodule/operateDB");

// 查询用户
var queryModel = {
    table:'users',
    data:{
        name:''
    },
    call:function(res){
        console.log('queryModel....')
    }
}
exports.queryUser = function(name,call){
    var results = {
        code:-1,
        msg:'暂无数据！'
    };
    if(name){
        queryModel.data.name = name;
    }
    if(call && typeof call === "function"){
        queryModel.call = function(res){
            if(res){
                results.code = 1;
                results.msg = "查询成功！";
                results.result = {
                    name:res.name
                }
            }
            call(results);
        }
    }
    mogos.findOneDB(queryModel);
}

// 用户创建模块
var insertModel = {
    table:'users',
    data:null,
    call:function(res){
        console.log(res)
    }
};
exports.createUser = function(data,call){
    var results = {
        code:-1,
        msg:'创建失败！',
    }
    this.queryUser(data.name,function(res){
        if(res.code === 1){
            results.code = -1;
            results.msg = "用户名已被占用！";
            call(results);
            return;
        }else if(res.code === -1){
            insertModel.data = data;
            if(call && typeof call === "function"){
                insertModel.call = function(res){
                    if(res){
                        results.code = 1;
                        results.msg = "创建成功！";
                        results.result = {
                            name:res.name
                        }
                    }
                    call(results);
                }
            }
            mogos.insertDB(insertModel);
            
        }
    });
    
}

// 登录模块
exports.doLogin = function(data,call){
    var results = {
        code:-1,
        msg:'暂无数据！'
    };
    if(data.name){
        queryModel.data.name = data.name;
    }
    if(call && typeof call === "function"){
        queryModel.call = function(res){
            if(res && data.password === res.password){
                results.code = 1;
                results.msg = "登录成功！";
                results.result = {
                    name:res.name
                }
            }else if(res && data.password !== res.password){
                results.code = -1;
                results.msg = "密码错误！";
            }
            call(results);
        }
    }
    mogos.findOneDB(queryModel);
}

// 获取用户信息模块
exports.getUser = function(name,call){
    var results = {
        code:-1,
        msg:'暂无数据！'
    };
    if(name){
        queryModel.data.name = name;
    }
    if(call && typeof call === "function"){
        queryModel.call = function(res){
            if(res){
                results.code = 1;
                results.msg = "查询成功！";
                results.result = res;
            }
            call(results);
        }
    }
    mogos.findOneDB(queryModel);
}

// 用户信息编辑模块
var updateModel = {
    table:'users',
    data:{
        condit:null,
        update:null,
        options:{
            multi:false
        }
    },
    call:function(res){
        console.log(res)
    }
}
exports.editUser = function(updateInfo,call){
    var results = {
        code:-1,
        msg:"信息不完整！"
    }
    if(updateInfo.name && updateInfo.password){
        updateModel.data.condit = {
            name:updateInfo.name
        };
        updateModel.data.update = {
            password:updateInfo.password
        };
        if(call && typeof call === "function"){
            updateModel.call = function(res){
                if(res.n === 1){
                    results.code = 1;
                    results.msg = "信息更改成功！";
                }else{
                    results.msg = "信息更改失败！";
                }
                call(results);
            }
        }
        mogos.updateDB(updateModel);
    }else{
        call(results);
    }
}

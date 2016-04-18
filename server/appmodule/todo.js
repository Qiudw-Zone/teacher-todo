var dbConf = require("../dbmodule/mgdbConf");
var mogos = require("../dbmodule/operateDB");

// todo查询
var queryTodos = function(model,call){
    var results = {
        code:-1,
        msg:'暂无数据！'
    };
    if(call && typeof call === "function"){
        model.call = function(res){
            if(res.length){
                results.code = 1;
                results.msg = "查询成功！";
                results.result = res;
            }
            call(results);
        }
    }
    
    mogos.findDB(model);
}

// 按todo名字查询
var queryByNameModel ={
    table:'todos',
    data:{
        name:''
    },
    call:function(res){
        console.log(res);
    }
}
exports.queryByName = function(name,call){
    if(name){
        queryByNameModel.data.name = name;
    }
    queryTodos(queryByNameModel,call);

}

// 按todo的用户名查询
var queryByUnameModel ={
    table:'todos',
    data:{
        uname:''
    },
    call:function(res){
        console.log(res);
    }
}
exports.queryByUname = function(name,call){
    if(name){
        queryByUnameModel.data.uname = name;
    }
    queryTodos(queryByUnameModel,call);

}

// 按todo的状态查询
var queryByStatusModel ={
    table:'todos',
    data:{
        status:0
    },
    call:function(res){
        console.log(res);
    }
}
exports.queryByStatus = function(status,call){
    if(status){
        queryByStatusModel.data.status = status;
    }
    queryTodos(queryByStatusModel,call);

}

// 按todo名模糊查询
var searchTodoModel ={
    table:'todos',
    data:{
        name:null
    },
    call:function(res){
        console.log(res);
    }
}
exports.searchTodo = function(name,call){
    var regx = new RegExp(name);
    searchTodoModel.data.name = regx;
    queryTodos(searchTodoModel,call);

}

var insertToDoModel = {
    table:'todos',
    data:null,
    call:function(res){
        console.log(res)
    }
};
exports.createTodo = function(data,call){
    var results = {
        code:-1,
        msg:'创建失败！',
    }
    this.queryByName(data.name,function(res){
        if(res.code === 1){
            results.code = -1;
            results.msg = "该TODO已经存在！";
            call(results);
            return;
        }else if(res.code === -1){
            insertToDoModel.data = data;
            if(call && typeof call === "function"){
                insertToDoModel.call = function(res){
                    if(res){
                        results.code = 1;
                        results.msg = "创建成功！";
                        results.result = res;
                    }
                    call(results);
                }
            }
            mogos.insertDB(insertToDoModel);
            
        }
    });
    
}

var updateToDoModel ={
    table:'todos',
    data:{
        condit:null,
        update:null,
    },
    call:function(res){
        console.log(res);
    }   
}

exports.editTodo = function(updateInfo,call){
    var results = {
        code:-1,
        msg:"信息不完整！"
    }
    if(updateInfo.name && updateInfo.content){
        updateToDoModel.data.condit = {
            name:updateInfo.name
        };
        updateToDoModel.data.update = updateInfo.content;
        if(call && typeof call === "function"){
            updateToDoModel.call = function(res){
                if(res.n === 1){
                    results.code = 1;
                    results.msg = "信息更改成功！";
                }else{
                    results.msg = "信息更改失败！";
                }
                call(results);
            }
        }
        if(updateInfo.content.name && updateInfo.name !== updateInfo.content.name){ // 编辑前后的todo名不一致时作唯一性检测
            this.queryByName(updateInfo.content.name,function(res){
                if(res.code === 1){
                    results.msg = "TODO名已存在！";
                    call(results);
                    return;
                }
                mogos.updateDB(updateToDoModel);
            });
        }else{
            mogos.updateDB(updateToDoModel);
        }        
        
    }else{
        call(results);
    }
}


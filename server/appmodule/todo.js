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
                results.amount = res.length;
                if(model.condit && model.condit.page && model.condit.size){
                    results.page = model.condit.page;

                    var skip = model.condit.size*(model.condit.page-1);
                    res = res.slice(skip);
                    results.pageSize = Math.ceil(results.amount / model.condit.size);
                }
                if(model.condit && model.condit.size){
                    res = res.slice(0,model.condit.size);
                }
                results.result = res;
            }
            call(results);
        }
    }
    
    mogos.findDB(model);
}

var queryTodoById = function(model,call){
    var results = {
        code:-1,
        msg:'暂无数据！'
    };
    if(call && typeof call === "function"){
        model.call = function(res){
            results.code = 1;
            results.msg = "查询成功！";
            results.result = res;
            call(results);
        }
    }
    mogos.findById(model);
}

// 获取一条todo
var getTodoByIdModel ={
    table:'todos',
    data:{
        id:null
    },
    call:function(res){
        console.log(res);
    }
}

exports.getTodoById = function(id,call){
    if(id){
        getTodoByIdModel.data.id = id;
        queryTodoById(getTodoByIdModel,call);
    }
}

// get todo查询模型
var getTodosModel ={
    table:'todos',
    data:null,
    condit:null,
    call:function(res){
        console.log(res);
    }
}

exports.getTodos = function(data,call){
    if(data.status && data.page && data.size){
        getTodosModel.data = {
            uname: data.uname,
            status:data.status            
        }
        if(data.cname){
            getTodosModel.data.cname = data.cname;
        }
        getTodosModel.condit = {
            size:data.size,
            page:data.page
        }
        queryTodos(getTodosModel,call);
    }
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
    condit:null,
    call:function(res){
        console.log(res);
    }
}
exports.searchTodo = function(data,call){
    var regx = new RegExp(data.keyword);
    searchTodoModel.data.name = regx;
    searchTodoModel.data.uname = data.uname;
    searchTodoModel.condit = {
        size:data.size,
        page:data.page
    }
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
        id:null,
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

    if(updateInfo.id && updateInfo.content){
        updateToDoModel.data.id = updateInfo.id;
        if(parseInt(updateInfo.content.status) === -1){ // 状态更改
            updateInfo.content.ftime = Date.now();
        }
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
        mogos.updateDBById(updateToDoModel);        
    }else{
        call(results);
    }
}

var delTodoByIdModel ={
    table:'todos',
    data:{
        id:null
    },
    call:function(res){
        console.log(res);
    }
}
exports.delTodo = function(id,call){
    var results = {
        code:-1,
        msg:"删除失败！"
    }
    if(id){
        delTodoByIdModel.data.id = id;
        if(call && typeof call === "function"){
            delTodoByIdModel.call = function(res){
                if(res.n === 1){
                    results.code = 1;
                    results.msg = "删除成功！";
                }
                call(results);
            }
        }
        mogos.removeDBById(delTodoByIdModel);
    }else{
        call(results);
    }
}
var dbConf = require("../dbmodule/mgdbConf");
var mogos = require("../dbmodule/operateDB");

// 查询课程
var queryModel = {
    table:'courses',
    data:{
        name:'',
    },
    call:function(res){
        console.log(res);
    }
}
exports.queryCourse = function(name,call){
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

// 查詢用户课程
var queryAllModel = {
    table:'courses',
    data:{
        uname:'',
    },
    call:function(res){
        console.log(res);
    }
}
exports.queryAllCourse = function(name,call){
    var results = {
        code:-1,
        msg:'暂无数据！'
    };
    if(name){
        queryAllModel.data.uname = name;
    }
    
    if(call && typeof call === "function"){
        queryAllModel.call = function(res){
            if(res){
                results.code = 1;
                results.msg = "查询成功！";
                results.result = res;
            }
            call(results);
        }
    }
    mogos.findDB(queryAllModel);
}

var insertModel = {
    table:'courses',
    data:null,
    call:function(res){
        console.log(res)
    }
};

exports.createCourse = function(data,call){
    var results = {
        code:-1,
        msg:'创建失败！',
    }
    this.queryCourse(data.name,function(res){
        if(res.code === 1){
            results.code = -1;
            results.msg = "課程名已存在！";
            call(results);
            return;
        }else if(res.code === -1){
            insertModel.data = data;
            if(call && typeof call === "function"){
                insertModel.call = function(res){
                    if(res){
                        results.code = 1;
                        results.msg = "创建成功！";
                        results.result = res;
                    }
                    call(results);
                }
            }
            mogos.insertDB(insertModel);
            
        }
    });   
}

// 編輯課程信息
var updateCourseModel ={
    table:'courses',
    data:{
        condit:null,
        update:null,
    },
    call:function(res){
        console.log(res);
    }   
}

exports.editCourse = function(updateInfo,call){
    var results = {
        code:-1,
        msg:"信息不完整！"
    }
    if(updateInfo.name && updateInfo.content){
        updateCourseModel.data.condit = {
            name:updateInfo.name,
            uname:updateInfo.uname
        };
        updateCourseModel.data.update = updateInfo.content;
        if(call && typeof call === "function"){
            updateCourseModel.call = function(res){
                if(res.n === 1){
                    results.code = 1;
                    results.msg = "信息更改成功！";
                }else{
                    results.msg = "信息更改失败！";
                }
                call(results);
            }
        }
        if(updateInfo.content.name && updateInfo.name !== updateInfo.content.name){ // 编辑前后的课程名不一致时作唯一性检测
            this.queryCourse(updateInfo.content.name,function(res){
                if(res.code === 1){
                    results.msg = "課程名已存在！";
                    call(results);
                    return;
                }
                mogos.updateDB(updateCourseModel);
            });
        }else{
            mogos.updateDB(updateCourseModel);
        }             
    }else{
        call(results);
    }
}

// 刪除課程
var delCourseModel ={
    table:'courses',
    data:{},
    call:function(res){
        console.log(res)
    }
}
exports.delCourse = function(id,call){
    var results = {
        code:-1,
        msg:"删除失败！"
    }
    if(id){
        delCourseModel.data.id = id;
        if(call && typeof call === "function"){
            delCourseModel.call = function(res){
                if(res.n === 1){
                    results.code = 1;
                    results.msg = "删除成功！";
                }
                call(results);
            }
        }
        mogos.removeDBById(delCourseModel);
    }else{
        call(results);
    }
}

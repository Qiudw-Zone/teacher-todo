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
            name:updateInfo.name
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
        if(updateInfo.content.name && updateInfo.name !== updateInfo.content.name){ // 编辑前后的todo名不一致时作唯一性检测
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
var removeCourseModel ={
    table:'courses',
    data:{
        condit:null,
        options:{multi:1}
    },
    call:function(res){
        console.log(res)
    }
}
exports.removeCourse = function(name,call){
    var results = {
        code:0,
        msg:'參數錯誤！'
    };
    if(name){
        this.queryCourse(name,function(res){
            if(res.code === 1){
                removeCourseModel.data.condit = {
                    name:name
                }
                if(call && typeof call === "function"){
                    removeCourseModel.call = function(res){
                        if(res.n){
                            results.code = 1;
                            results.msg = "刪除成功！";
                        }else{
                            results.code = -1;
                            results.msg = "刪除失敗！";
                        }
                        call(results);
                    }
                }
                mogos.removeDB(removeCourseModel);
                return;
            }else{
                results.code = -1;
                results.msg = "課程不存在！";
                call(results);
                return;
            }
        });
    }else{
        call(results);
    }
}

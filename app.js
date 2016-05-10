var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var ObjectID = require('mongoose').ObjectID;
var path = require("path");
var user = require("./server/appmodule/user");
var todo = require("./server/appmodule/todo");
var course = require("./server/appmodule/course");

var app = express();
// 设置访问端口port变量
app.set('port', process.env.PORT || 3000);
// 设置视图存放 views变量
app.set('views', path.join(__dirname, 'views'));
// 设置网页模板引擎 view engine变量:指定模板文件名的后缀名为html
app.set('view engine', 'html');
// 运行hbs模块
app.engine('html', hbs.__express);
// use方法用于执行中间件  设置静态文件目录为src
app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser());

app.get('/', function(req, res) {
    res.sendfile('./index.html');
});
var username = null;
app.get('/home', function(req, res) {
    if(!username) res.send("请先登录！");
    res.render('home',{username:username});
});

// 使用hbs模板引擎渲染,get()中第一个参数为路由

// user模块
app.post('/create-user', function(req, res) {
    user.createUser(req.body,function(response){
        if(response.code === 1){
            username = response.result.name;
        }
        res.send(response);
    });
});

app.post('/login', function(req, res) {
    user.doLogin(req.body,function(response){
        if(response.code === 1){
            username = response.result.name;
        }
        res.send(response);
    });
});

// 查詢用户信息
app.get('/get-user', function(req, res) {
    user.getUser(req.query.name,function(response){
        res.send(response);
    });
});

app.post('/edit-user', function(req, res) {
    user.editUser(req.body,function(response){
        res.send(response);
    });
});

/**
 * todo模块
 * @param  {[type]} req  [description]
 * @param  {Object} res) {               var todoInfo [description]
 * @return {[type]}      [description]
 */

// todo创建页面
app.get('/create',function(req,res){
    if(!username) res.send("请先登录！");
    res.render('create',{username:username});
});

// todo详情页面
app.get('/detail/:id',function(req,res){
    if(!username) res.send("请先登录！");
    todo.getTodoById(req.params.id,function(response){
        var result = {
            username:username,
            result:response.result
        }
        res.render('detail',{
            username:username,
            result:response.result
        });
    });
});

app.get('/edit/:id',function(req,res){
    if(!username) res.send("请先登录！");
    todo.getTodoById(req.params.id,function(response){
        var result = {
            username:username,
            result:response.result
        }
        res.render('create',{
            username:username,
            result:response.result
        });
    });
});

app.post('/create-todo', function(req, res) {
    todo.createTodo(req.body,function(response){
        res.send(response);
    });
});

// 获取todo
app.get('/get-todos', function(req, res) {
    var data = {
        uname:req.query.uname,
        status:req.query.status,
        cname:req.query.cname,
        size:parseInt(req.query.size),
        page:parseInt(req.query.page)
    }
    todo.getTodos(data,function(response){
        res.send(response);
    });
});

app.get('/query-todo-name', function(req, res) {
    todo.queryByName('todo1',function(response){
        res.send(response);
    });
});

app.get('/query-todo-uname', function(req, res) {
    todo.queryByUname(req.query.uname,function(response){
        res.send(response);
    });
});

app.get('/query-todo-status', function(req, res) {
    todo.queryByStatus('0',function(response){
        console.log(response);
    });
});

app.get('/search-todo', function(req, res) {
    todo.searchTodo('todo',function(response){
        console.log(response);
    });
});


app.post('/edit-todo', function(req, res) {
    var updateIfo = {
        id:req.body.id,
        content:req.body.update
    }
    todo.editTodo(updateIfo,function(response){
        res.send(response);
    });
});

// 删除todo
app.get('/del-todo', function(req, res) {
    todo.delTodo(req.query.id,function(response){
        res.send(response);
    });
});

// course模快
app.post('/create-course', function(req, res) {
    course.createCourse(req.body,function(response){
        res.send(response);
    });
});

app.post('/edit-course', function(req, res) {
    course.editCourse(req.body,function(response){
        res.send(response)
    });
});

app.get('/query-course', function(req, res) {
    course.queryAllCourse(req.query.uname,function(response){
        res.send(response);
    });
});

app.get('/del-course', function(req, res) {
    course.delCourse(req.query.id,function(response){
        res.send(response)
    });
});

/**
 * 统计模块
 */
app.get('/statistic',function(req,res){
    if(!username) res.send("请先登录！");
    res.render('statistic',{username:username});
})

app.get('/doStatistic',function(req,res){
    todo.queryByUname(username,function(response){
        if(response.result){ // 查询到数据
            var result = response.result;
            var courseItem = {},statusItem = {};
            var abilityItem = {
                ontime:0,
                late:0,
                advance:0
            }
            var timer = null;
            for(var i = 0,l = result.length; i<l; i++){
                courseItem[result[i].cname] = courseItem[result[i].cname] ? ++courseItem[result[i].cname] : 1;
                statusItem[result[i].status] = statusItem[result[i].status] ? ++statusItem[result[i].status] : 1;
                var eTime = new Date(result[i].etime);
                if(result[i].ftime){
                    timer = new Date(result[i].ftime);
                }else{
                    timer = new Date();
                }
                if(timer.getFullYear() > eTime.getFullYear() || (timer.getFullYear() === eTime.getFullYear() && timer.getMonth() > eTime.getMonth()) || (timer.getFullYear() === eTime.getFullYear() && timer.getMonth() === eTime.getMonth() && timer.getDate() > eTime.getDate())){ // 超时
                    abilityItem.late++;
                }else if(timer.getFullYear() === eTime.getFullYear() && timer.getMonth() === eTime.getMonth() && timer.getDate() === eTime.getDate()){ // 准时
                    abilityItem.ontime++;
                }else{ // 提前
                    abilityItem.advance++;
                }
            }
            var courseArr = [],statusArr=[],abilityArr=[];
            var flag = true;
            for(var item in courseItem){
                if(flag){
                    var arrItem = {};
                    arrItem.name = item;
                    arrItem.y = courseItem[item];
                    arrItem.sliced = true;
                    arrItem.selected = true;
                    flag = false;
                }else{
                    var arrItem = [];
                    arrItem.push(item);
                    arrItem.push(courseItem[item]);    
                }
                courseArr.push(arrItem);
            }
            flag = true;
            for(var item in statusItem){
                var name = '';
                switch(parseInt(item)){
                    case 0:{
                        name = '进行中';
                        break;
                    }
                    case -1:{
                        name = '已终止';
                        break;
                    }
                    case 1:{
                        name = '未开始';
                        break;
                    }
                }
                if(flag){
                    var arrItem = {};
                    arrItem.name = name;
                    arrItem.y = statusItem[item];
                    arrItem.sliced = true;
                    arrItem.selected = true;
                    flag = false;
                }else{
                    var arrItem = [];
                    arrItem.push(name);
                    arrItem.push(statusItem[item]);    
                }
                statusArr.push(arrItem);
            }
            flag = true;
            for(var item in abilityItem){
                var name = '';
                switch(item){
                    case 'ontime':{
                        name = '准时完成';
                        break;
                    }
                    case 'late':{
                        name = '超时完成';
                        break;
                    }
                    case 'advance':{
                        name = '提前完成';
                        break;
                    }
                }
                if(flag){
                    var arrItem = {};
                    arrItem.name = name;
                    arrItem.y = abilityItem[item];
                    arrItem.sliced = true;
                    arrItem.selected = true;
                    flag = false;
                }else{
                    var arrItem = [];
                    arrItem.push(name);
                    arrItem.push(abilityItem[item]);    
                }
                abilityArr.push(arrItem);
            }
            response.result = {
                course:{
                    title:'课程占比视图',
                    result:courseArr
                },
                status:{
                    title:'状态占比视图',
                    result:statusArr
                },
                ability:{
                    title:'执行力占比视图',
                    result:abilityArr
                }
            }
        }
        res.send(response);
    });
})

var server = app.listen(app.get('port'), function() {
    console.log('listening in ' + server.address().port);
});


    



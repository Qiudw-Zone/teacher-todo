var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
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
    res.render('home',{username:username});
});

// 使用hbs模板引擎渲染,get()中第一个参数为路由
// user模块
app.post('/create-user', function(req, res) {
    user.createUser(req.body,function(response){
        username = response.result.name;
        res.send(response);
    });
});

app.post('/login', function(req, res) {
    user.doLogin(req.body,function(response){
        username = response.result.name;
        res.send(response);
    });
});

app.get('/edit-user', function(req, res) {
    var userInfo = {
        name:'qdw05',
        password:'111113',
    }
    user.editUser(userInfo,function(response){
        console.log(response);
    });
});

// todo模块
app.get('/create-todo', function(req, res) {
    var todoInfo = {
        name:'todo2',
        uname:'qdw01',
        status:0
    }
    todo.createTodo(todoInfo,function(response){
        console.log(response)
    });
});

app.get('/query-todo-name', function(req, res) {
    todo.queryByName('todo1',function(response){
        console.log(response);
    });
});

app.get('/query-todo-uname', function(req, res) {
    todo.queryByUname('qdw01',function(response){
        console.log(response);
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


app.get('/edit-todo', function(req, res) {
    var updateIfo = {
        name:'todo4',
        content:{
            name:'todo3',
            status:-1
        }
    }
    todo.editTodo(updateIfo,function(response){
        console.log(response);
    });
});


// course模快
app.get('/create-course', function(req, res) {
    var courseInfo = {
        name:'gaoshu',
        addr:'addr1',
    }
    course.createCourse(courseInfo,function(response){
        console.log(response)
    });
});

app.get('/edit-course', function(req, res) {
    var updateIfo = {
        name:'gaoshu',
        content:{
            name:'java',
            addr:'addr3'
        }
    }
    course.editCourse(updateIfo,function(response){
        console.log(response)
    });
});

app.get('/query-course', function(req, res) {
    /*course.removeCourse('java',function(response){
        console.log(response)
    });*/
});

app.get('/del-course', function(req, res) {
    course.removeCourse('java',function(response){
        console.log(response)
    });
});

var server = app.listen(app.get('port'), function() {
    console.log('listening in ' + server.address().port);
});


    



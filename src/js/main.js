require(['jquery', 'highcharts', 'bootstrap-validator', 'bootstrap','nicescroll','datetimepicker','ckeditor'], function($) {
    $(function() {
        var page = window.location.href;
        var title = decodeURI(page.split('title=').reverse()[0]); // 存储todo标题
        var todoConf = {
            container:'',
            status:1,
            pageSize:6,
            pages:0
        }
        // if(page)
        var indexContainer = $('.index-container');
        var loginElem = {
            init:function(){
                // 表单切换
                this.toogleForm();
                // 表单验证
                this.verifyForm();
            },
            toogleForm:function(){
                indexContainer.on('click', '#form-nav-text', function(event) {
                    event.preventDefault();
                    var type = $(this).data("type");
                    if (type === "#reg") {
                        $("#login").addClass('off');
                        $(this).text("登陆").data("type", "#login");
                    } else {
                        $("#reg").addClass('off');
                        $(this).text("注册").data("type", "#reg");
                    }
                    $('#submit').data("type",$(this).data("type"));
                    $(type).removeClass('off');
                });
            },
            verifyForm:function(){
                var self = this;
                var submitForm = {
                    login:self.login,
                    reg:self.register
                }
                $('#login,#reg').bootstrapValidator({
                    message: 'This value is not valid',
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        username: {
                            validators: {
                                notEmpty: {
                                    message: '用户名不能为空'
                                }
                            }
                        },
                        password: {
                            validators: {
                                notEmpty: {
                                    message: '密码不能为空'
                                },
                                stringLength: {
                                    min: 6,
                                    max: 9,
                                    message: '密码长度为6~9'
                                }/*,
                                callback: {
                                    callback: function(value, validator) {
                                        var number_reg = /d/;
                                        var letter_reg = /[a-zA-Z]/;
                                        return number_reg.test(value) && letter_reg.test(value);
                                    },
                                    message: '密码必须为数字跟字母的组合'
                                }*/
                            }
                        },
                        comfirm_password: {
                            validators: {
                                notEmpty: {
                                    message: '密码确认不能为空'
                                },
                                identical: {
                                    field: 'password',
                                    message: '密码不一致'
                                }
                            }
                        }
                    }
                }).on("success.form.bv", function(e) {
                    e.preventDefault();

                    var type = $(this).data("type");
                    submitForm[type]();
                });
            },
            login:function(){
                $.ajax({
                    url: '/login',
                    type: 'POST',
                    data: {
                        name:$('#login-username').val(),
                        password:$('#login-password').val(),
                    },
                    success:function(response){
                        console.log(response)
                        if(response.code === 1){
                            window.location.href = "/home";
                        }else{
                            alert(response.msg)
                        }
                    },
                    error:function(xhr){
                        console.log(xhr);
                    }
                })
                .done(function() {
                    console.log("success");
                })
                .fail(function() {
                    console.log("error");
                });
                
            },
            register:function(){
                $.ajax({
                    url: '/create-user',
                    type: 'POST',
                    data: {
                        name:$('#reg-username').val(),
                        password:$('#reg-password').val(),
                    },
                    success:function(response){
                        console.log(response);
                        if(response.code === 1){
                            window.location.href = "home";
                        }else{
                            alert(response.msg)
                        }
                    },
                    error:function(xhr){
                        console.log(xhr);
                    }
                })
                .done(function() {
                    console.log("success");
                })
                .fail(function() {
                    console.log("error");
                });
            }
        };

        var homeElem = {
            dom:$(".home-page"),
            oldCourseName:'',
            init:function(){
                // 初始化滚动条
                this.initScroll();

                this.initUserInfo();

                this.initTodos();

                // 初始化页面中的模块切换功能
                this.initPage();

                // 初始化课程列表
                this.initCourse(this.setCourses);

                // 创建课程
                this.createCourse();

                // 初始化course操作
                this.initCourseOperate();

                // 初始化todo操作：删除等
                this.initToDoOprate();

                // 查看当前用户的所有todo
                this.viewMyTodos();

                // 查看当前课程下的todo
                this.viewTodosInCourse();

                this.initPaginate();

                this.search();
            },
            initPage:function(){
                var courseWrap = $(".course-wrap");
                // 展开课程管理
                this.dom.on('click', '.create-task,#create-course', function(event) {
                    event.preventDefault();
                    /* Act on the event */
                    courseWrap.removeClass('off');
                    courseWrap.fadeIn('600');
                    
                });
                // 关闭课程管理
                this.dom.on('click', '.close-course', function(event) {
                    event.preventDefault();
                    courseWrap.fadeOut('600');
                });

                // 展开新增课程面板
                var table = $('.table');
                var creCouWrap = $('.create-crouse-wrap');
                this.dom.on('click', '#add-course', function(event) {
                    event.preventDefault();
                    var type = $(this).data('type');
                    if(type === "add"){
                        $(this).text("取消").data("type","cancel");
                        table.addClass('off');
                        creCouWrap.removeClass('off');
                    }else{
                        $(this).text("新增").data("type","add");
                        table.removeClass('off');
                        creCouWrap.addClass('off');
                        $('#btn-course').data('type','add');
                    }
                });

                // 展开课程导航
                this.dom.on('click', '#nav-course', function(event) {
                    event.preventDefault();
                    var status = $(this).data('status');
                    if(status === "off"){
                        $(this).data('status', 'on').addClass('nav-course-open');
                        $('.courses').slideDown('600');
                    }else{
                        $(this).data('status', 'off').removeClass('nav-course-open');
                        $('.courses').slideUp('600');
                    }
                });

                // 展开todo
                var todoWrap = $('.main-wrap');
                var index = -1;
                this.dom.on('click', '.list-nav-item', function(event) {
                    event.preventDefault();
                    var step = 1;
                    step += $(this).index();
                    $('.list-nav-item').eq(index).removeClass('list-nav-on');
                    $(this).addClass('list-nav-on');
                    index = step-1;
                    todoWrap.animate({
                        marginLeft:"-"+step*100+"%"
                    }, 600);
                });
                this.dom.on('click', '#create-todo', function(event) {
                    event.preventDefault();
                    window.location.href = '/create?title=Your title';
                });

                // enter跳转功能
                this.dom.on('keyup', '.add-todo-input', function(event) {
                    event.preventDefault();
                    title = $(this).val();
                    if(title && event.keyCode === 13){
                        window.location.href = "/create?title="+encodeURI(title);
                    }else if(event.keyCode === 13){
                        alert("请先输入TODO标题！");
                    }
                });
            },
            initScroll:function(){
                $('.home-nav,.main').niceScroll({ 
                    cursorcolor: "#ccc",//#CC0071 光标颜色 
                    cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
                    touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
                    cursorwidth: "5px", //像素光标的宽度 
                    cursorborder: "0", //     游标边框css定义 
                    cursorborderradius: "5px",//以像素为光标边界半径 
                    autohidemode: false //是否隐藏滚动条 
                });
            },
            initUserInfo:function(){
                var userWrap = $('.user-info-wrap');
                var userShow = $('.show-info');
                var userEdit = $('.edit-info');
                var flag = true;
                var tag = true;
                this.dom.on('click', '.user', function(event) {
                    event.preventDefault();
                    if(flag){
                        $.ajax({
                            url: '/get-user',
                            type: 'GET',
                            data: {name: username},
                            success:function(response){
                                console.log(response)
                                if(response.code != 1){
                                    alert(response.msg);
                                    return;
                                }
                                $('#info-password').text(response.result.password);
                                flag = false;
                            }
                        })
                        .done(function() {
                            console.log("success");
                        })
                        .fail(function() {
                            console.log("error");
                        });
                    }
                    if(tag){
                        userWrap.removeClass('off');
                        tag = false;
                    }else{
                        tag = true;
                        userWrap.addClass('off');
                    }
                    
                });
                this.dom.on('click', '.info-close', function(event) {
                    event.preventDefault();
                    userWrap.addClass('off');
                });
                this.dom.on('click', '#edit-user', function(event) {
                    event.preventDefault();
                    userShow.addClass('off');
                    userEdit.removeClass('off');
                });
                this.dom.on('click', '#edit-cancle', function(event) {
                    event.preventDefault();
                    userEdit.addClass('off');
                    userShow.removeClass('off');
                });
                $('#user-form').bootstrapValidator({
                    message: 'This value is not valid',
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        username: {
                            validators: {
                                notEmpty: {
                                    message: '用户名不能为空'
                                }
                            }
                        },
                        password: {
                            validators: {
                                notEmpty: {
                                    message: '密码不能为空'
                                },
                                stringLength: {
                                    min: 6,
                                    max: 9,
                                    message: '密码长度为6~9'
                                }
                            }
                        }
                    }
                }).on("success.form.bv", function(e) {
                    e.preventDefault();
                    var name = $("#username").val();
                    var pas = $("#password").val();
                    $.ajax({
                        url: '/edit-user',
                        type: 'post',
                        data: {
                            name: name,
                            password:pas
                        },
                        success:function(response){
                            console.log(response)
                            if(response.code !== 1){
                                alert(response.msg);
                                return;
                            }
                            $('#info-name').text(name);
                            $('#info-password').text(pas);
                            userShow.removeClass('off');
                            userEdit.addClass('off');
                        },
                        error:function(xhr){
                            console.log(xhr)
                        }
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
                    
                });
            },
            initCourse:function(callback){
                var self = this;
                if(!username) return;
                $.ajax({
                    url: '/query-course',
                    type: 'get',
                    data: {
                        uname:username
                    },
                    success:function(response){
                        console.log(response)
                        var results = [];
                        if(response.code === 1){
                            results = response.result;
                        }
                        callback(results);
                    },
                    error:function(xhr){
                        console.log(xhr);
                    }
                })
                .done(function() {
                    console.log("success");
                })
                .fail(function() {
                    console.log("error");
                });
            },
            initTodos:function(){
                var self = this;
                this.dom.on('click', '.list-nav-item', function(event) {
                    event.preventDefault();
                    var type = $(this).data('type');
                    todoConf.container = $(this).data('id');
                    todoConf.status = type;
                    $.ajax({
                        url: '/get-todos',
                        type: 'get',
                        data: {
                            uname:username,
                            status:type,
                            page:1,
                            size:todoConf.pageSize
                        },
                        success:function(response){
                            console.log(response)
                            self.setTodos(todoConf.container,response);
                        },
                        error:function(xhr){
                            console.log(xhr);
                        }
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
                });                
            },
            initPaginate:function(){
                var self = this;
                this.dom.on('click', '.page', function(event) {
                    event.preventDefault();
                    var page = $(this).data('page');
                    if(page<=0 || page>todoConf.pages) return;
                    if($(this).data('type') === 's'){ // search
                        self.doSearch(page);
                        return;
                    }
                    $.ajax({
                        url: 'get-todos',
                        type: 'get',
                        data: {
                            uname:username,
                            status:todoConf.status,
                            page:page,
                            size:todoConf.pageSize
                        },
                        success:function(response){
                            console.log(response)
                            self.setTodos(todoConf.container,response);
                        },
                        error:function(xhr){
                            console.log(xhr);
                        }
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
                    
                });
            },
            initCourseOperate:function(){
                var self = this;
                this.dom.on('click', '.remove-course', function(event) {
                    event.preventDefault();
                    var id = $(this).data('id');
                    var parent = $(this).parents('tr');
                    $.ajax({
                        url: '/del-course',
                        type: 'get',
                        data: {id: id},
                        success:function(response){
                            if(response.code === 1){
                                alert(response.msg);
                                parent.remove();
                            }
                        },
                        error:function(xhr){
                            console.log(xhr);
                        }
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
                });

                this.dom.on('click', '.edit-course', function(event) {
                    event.preventDefault();
                    $('#add-course').click();
                    $('#btn-course').data('type','edit');
                    self.oldCourseName = $(this).data('name')
                    $('#coursename').val(self.oldCourseName);
                    $('#courseaddr').val($(this).data('addr'));
                });
            },
            initToDoOprate:function(){
                // 删除todo
                this.dom.on('click', '.remove-todo', function(event) {
                    event.preventDefault();
                    var id = $(this).data('id');
                    var parent = $(this).parents('.todo');
                    $.ajax({
                        url: '/del-todo',
                        type: 'get',
                        data: {id: id},
                        success:function(response){
                            if(response.code === 1){
                                alert(response.msg);
                            }
                            parent.remove();
                        }
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
                    
                });

                // 标记完成
                this.dom.on('click', '.glyphicon-ok', function(event) {
                    event.preventDefault();
                    var id = $(this).data('id');
                    var status = -1;
                    var parent = $(this).parents('.todo');
                    $.ajax({
                        url: '/edit-todo',
                        type: 'post',
                        data: {
                            id:id,
                            update:{
                                status:status
                            }
                        },
                        success:function(response){
                            console.log(response);
                            if(response.code === 1){
                                alert(response.msg);
                                parent.remove();
                            }
                        },
                        error:function(xhr){
                            console.log(xhr);
                        }
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
                });
            },
            viewMyTodos:function(){
                var self = this;
                this.dom.on('click', '#my-tasks', function(event) {
                    event.preventDefault();
                    var step = 0;
                    switch(parseInt(todoConf.status)){
                        case 0:{
                            todoConf.container = 'doing';
                            step = 1;
                            $('.list-nav-item').eq(0).addClass('list-nav-on');
                            break;
                        }
                        case -1:{
                            todoConf.container = 'finished';
                            step = 2;
                            $('.list-nav-item').eq(1).addClass('list-nav-on');
                            break;
                        }
                        case 1:{
                            todoConf.container = 'coming';
                            step = 3;
                            $('.list-nav-item').eq(2).addClass('list-nav-on');
                            break;
                        }
                    }
                    var cname = $(this).data('name')
                    $.ajax({
                        url: '/get-todos',
                        type: 'get',
                        data: {
                            uname:username,
                            status:todoConf.status,
                            page:1,
                            size:todoConf.pageSize
                        },
                        success:function(response){
                            console.log(response)
                            self.setTodos(todoConf.container,response);
                            $('.main-wrap').animate({
                                marginLeft:"-"+step*100+"%"
                            }, 600);
                        },
                        error:function(xhr){
                            console.log(xhr);
                        }
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
                });
            },
            viewTodosInCourse:function(){
                var self = this;
                this.dom.on('click', '.course-item', function(event) {
                    event.preventDefault();
                    var step = 0;
                    switch(parseInt(todoConf.status)){
                        case 0:{
                            todoConf.container = 'doing';
                            step = 1;
                            $('.list-nav-item').eq(0).addClass('list-nav-on');
                            break;
                        }
                        case -1:{
                            todoConf.container = 'finished';
                            step = 2;
                            $('.list-nav-item').eq(1).addClass('list-nav-on');
                            break;
                        }
                        case 1:{
                            todoConf.container = 'coming';
                            step = 3;
                            $('.list-nav-item').eq(2).addClass('list-nav-on');
                            break;
                        }
                    }
                    var cname = $(this).data('name')
                    $.ajax({
                        url: '/get-todos',
                        type: 'get',
                        data: {
                            uname:username,
                            status:todoConf.status,
                            cname:cname,
                            page:1,
                            size:todoConf.pageSize
                        },
                        success:function(response){
                            console.log(response)
                            self.setTodos(todoConf.container,response);
                            $('.main-wrap').animate({
                                marginLeft:"-"+step*100+"%"
                            }, 600);
                        },
                        error:function(xhr){
                            console.log(xhr);
                        }
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
                    
                });
            },
            setCourses:function(data){
                var tabHtml = "";
                var navHtml = "";
                var l=data.length;
                if(l>0){
                    for(var i=0; i<l; i++){
                        tabHtml += "<tr><td><h4>"+ data[i].name +"<small class=\"ml-15\">"+ data[i].addr +"</small></h4></td><td><button data-id=\""+ data[i]._id +"\" data-name=\""+data[i].name+"\" data-addr=\""+data[i].addr+"\" class=\"btn btn-primary glyphicon glyphicon-edit edit-course\"></button><button data-id=\""+ data[i]._id +"\" class=\"remove-course ml-10 btn btn-primary glyphicon glyphicon-remove\"></button></td></tr>";
                        navHtml += "<li class=\"course-item\" data-id=\""+data[i]._id+"\" data-name=\""+data[i].name+"\">"+data[i].name+"</li>";
                    }
                }else{
                    tabHtml = "<tr><td class=\"text-center\">还没有课程，赶快添加吧！</td></tr>"
                    navHtml = "<li class=\"course-item\">暂未有课程</li>"
                }
                $("#table-courses").html(tabHtml);
                $(".courses").html(navHtml);
            },
            setTodos:function(id,res,type){
                var data  =res.result;
                var l = data? data.length:0;
                var html = "";
                var page = ""
                if(l > 0){
                    for(var i = 0; i < l; i++){
                        html += "<li class=\"todo\"><p class=\"todo-info\">";
                        if(data[i].view){
                            html += "<i class=\"todo-new icon-new\"></i>";
                        }
                        html += "<a class=\"todo-name\" href=\"/detail/"+data[i]._id+"\">";
                        html += "["+data[i].cname+"]  "+data[i].name+"</a>";
                        html += "<span class=\"todo-times\">"+data[i].btime+" - "+data[i].etime+"</span>";
                        html += "<span class=\"todo-time\">"+data[i].createTime.slice(0,10)+"</span></p>";
                        if(data[i].status === 0){
                            html += "<p class=\"todo-operate\"><button title=\"标记完成\" class=\"btn btn-success glyphicon glyphicon-ok\" data-id=\""+data[i]._id+"\"></button><button title=\"删除\" class=\"ml-10 btn btn-warning glyphicon glyphicon-remove remove-todo\" data-id=\""+data[i]._id+"\"></button></p></li>"
                        }else if(data[i].status === 1){
                            html += "<p class=\"todo-operate\"><button title=\"删除\" class=\"btn btn-warning glyphicon glyphicon-remove remove-todo\" data-id=\""+data[i]._id+"\"></button></p></li>"
                        }
                        
                    }
                    page = "<span data-page=\""+(parseInt(res.page)-1)+"\" class=\"prev page\">上一页</span>";
                    for(var i=1; i <= res.pageSize; i++){
                        if(i === parseInt(res.page)){
                            page += "<span data-type=\""+type+"\" data-page=\""+i+"\" class=\"page cur\">"+i+"</span>";
                        }else{
                            page += "<span data-type=\""+type+"\" data-page=\""+i+"\" class=\"page\">"+i+"</span>";
                        }
                    }
                    page += "<span data-page=\""+(parseInt(res.page)+1)+"\" class=\"next page\">下一页</span>";
                }else{
                    html = "<li class=\"todo\"><p class=\"todo-info\">暂无数据</p></li>"
                    page = "<span class=\"prev page\">上一页</span><span class=\"next page\">下一页</span>";
                }
                $("#"+id).html(html);
                $("#page-"+id).html(page);
                todoConf.pages = res.pageSize;
            },
            createCourse:function(){
                var self = this;
                this.dom.on('click', '#btn-course', function(event) {
                    event.preventDefault();
                    var name = $("#coursename").val();
                    if(!username) return;
                    if(!name){
                        alert("课程名不能爲空！");
                        return;
                    }
                    var addr = $("#courseaddr").val();
                    if(!addr){
                        alert("上课地点不能爲空！");
                        return;
                    }
                    if($(this).data('type') === 'edit'){
                        $.ajax({
                            url: '/edit-course',
                            type: 'post',
                            data: {
                                name:self.oldCourseName,
                                uname:username,
                                content:{
                                    name:name,
                                    addr:addr
                                }
                            },
                            success:function(response){
                                if(response.code === 1){
                                    window.location.href = "/home";
                                }else{
                                    alert(response.msg);
                                }
                            }
                        })
                        .done(function() {
                            console.log("success");
                        })
                        .fail(function() {
                            console.log("error");
                        });
                    }else{
                        $.ajax({
                            url: '/create-course',
                            type: 'POST',
                            data: {
                                name:name,
                                uname:username,
                                addr:addr
                            },
                            success:function(response){
                                if(response.code === 1){
                                    $('#table-courses').prepend("<tr><td><h4>"+ response.result.name +"<small class=\"ml-15\">"+ response.result.addr +"</small></h4></td><td><button data-id=\""+ response.result._id +"\" class=\"btn btn-primary  glyphicon glyphicon-edit\"></button><button data-id=\""+ response.result._id +"\" class=\"ml-10 btn btn-primary glyphicon glyphicon-remove\"></button></td></tr>");
                                    $("#add-course").click();
                                }else{
                                    alert(response.msg);
                                }
                            }
                        })
                        .done(function() {
                            console.log("success");
                        })
                        .fail(function() {
                            console.log("error");
                        });
                    }
                });
            },
            search:function(){
                var self = this;
                this.dom.on('click', '.search-label', function(event) {
                    event.preventDefault();
                    self.doSearch(1);
                });
            },
            doSearch:function(page){
                $.ajax({
                    url: '/search-todo',
                    type: 'post',
                    data: {
                        uname:username,
                        keyword: $('#search').val(),
                        page:page,
                        size:todoConf.pageSize
                    },
                    success:function(response){
                        console.log(response)
                        if(response.code === 1){
                            homeElem.setTodos('doing',response,'s');
                            $('.main-wrap').animate({marginLeft: '-100%'},600);
                        }else{
                            alert(response.msg);
                        }
                    }
                })
                .done(function() {
                    console.log("success");
                })
                .fail(function() {
                    console.log("error");
                });
            }
        };

        var createElem = {
            dom:$('.create-container'),
            action:'add',
            init:function(){
                this.initPage();
                
                homeElem.initCourse(this.setCourses); // 初始化课程列表

                this.createToDo(); // 创建todo

                this.prevToDo(); // 预览todo
            },
            initPage:function(){
                $('#todo-title').val(title); // 初始化标题

                if(data && data.name){
                    this.action = 'edit';
                    $('#todo-title').val(data.name);
                    $('#course-name').val(data.cname);
                    $('#btime').val(data.btime);
                    $('#etime').val(data.etime);
                    $('.ckeditor').val(decodeURIComponent(data.content));
                    $('#create-todo').text('修改');
                }

                $('.datetimepicker').datetimepicker(); // 初始化时间控件

                this.dom.on('click', '.course-item', function(event) {
                    event.preventDefault();
                    var name = $(this).data('name');
                    if(!name){
                        if(confirm("暂无课程!是否去创建？")){
                            window.location.href = "/home";
                        }
                        return;
                    }else{
                        $('#course-name').val(name);
                    }
                });
            },
            setCourses:function(data){
                var html = "";
                var courses = $('#create-courses');
                if(data.length > 0){
                    for(var i=0,l=data.length; i<l; i++){
                        html += "<li class=\"course-item\" data-id=\""+data[i]._id+"\" data-name=\""+data[i].name+"\"><a href=\"javascript:void(0);\">"+data[i].name+"</a></li>";
                    }
                }else{
                    html = "<li class=\"course-item\" data-name=\"null\"><a href=\"javascript:void(0);\">暂无课程</a></li>";
                }
                courses.html(html);
            },
            getCreateInfo:function(){
                var todoJson = {
                    uname:username,
                    status:1
                };
                var tdTitle = $('#todo-title').val();
                if(!tdTitle){
                    alert('ToDo标题不能为空！');
                    return;
                }
                todoJson.name = tdTitle;
                var tdCourse = $('#course-name').val();
                if(!tdCourse){
                    alert('ToDo所属课程不能为空！');
                    return;
                }
                todoJson.cname = tdCourse;
                var bTime = $('#btime').val();
                var eTime = $('#etime').val();
                if(!bTime || !eTime){
                    alert('相关时间不能为空！');
                    return;
                }
                if(eTime < bTime){
                    alert('结束时间不能小于开始时间！');
                    return;
                }
                var tdText = CKEDITOR.instances.editor.getData();
                if(!tdText){
                    alert('ToDo正文不能为空！');
                    return;
                }
                console.log(tdText)
                todoJson.btime = bTime;
                todoJson.etime = eTime;
                todoJson.content = encodeURIComponent(tdText);
                return todoJson;
            },
            createToDo:function(){
                var self = this;
                this.dom.on('click', '#create-todo', function(event) {
                    event.preventDefault();
                    /* Act on the event */
                    var todo = self.getCreateInfo();
                    if(self.action === 'edit'){ // 修改
                        $.ajax({
                            url: '/edit-todo',
                            type: 'post',
                            data: {
                                id:data.id,
                                update:todo
                            },
                            success:function(response){
                                if(response.code === 1){
                                    window.location.href = "/detail/"+data.id;
                                }
                            },
                            error:function(xhr){
                                console.log(xhr);
                            }
                        })
                        .done(function() {
                            console.log("success");
                        })
                        .fail(function() {
                            console.log("error");
                        });
                    }else{ // 创建
                        $.ajax({
                            url: '/create-todo',
                            type: 'post',
                            data: todo,
                            success:function(response){
                                console.log(response)
                                if(response.code === 1){
                                    window.location.href = "/detail/"+response.result._id;
                                }else{
                                    alert(response.msg)
                                }
                            },
                            error:function(xhr){
                                console.log(xhr);
                            }
                        })
                        .done(function() {
                            console.log("success");
                        })
                        .fail(function() {
                            console.log("error");
                        });
                    }
                    
                    // window.localStorage.todo = JSON.stringify(todo);
                });
            },
            prevToDo:function(){
                var self = this;
                var mask = $('.mask');
                this.dom.on('click', '#prev-todo', function(event) {
                    event.preventDefault();
                    var todo = self.getCreateInfo();
                    var time = new Date();
                    var ctime = time.getFullYear() + '-' + time.getMonth()+1 + '-' + time.getDate();
                    $('.prev-title').html(todo.name + "<small class=\"ml-15\">"+ ctime +"</small>");
                    $('.prev-course').text(todo.cname);
                    $('.prev-btime').text(todo.btime);
                    $('.prev-etime').text(todo.etime);
                    $('.prev-text').html(decodeURIComponent(todo.content));
                    mask.removeClass('off');
                });

                this.dom.on('click', '.prev-close', function(event) {
                    event.preventDefault();
                    mask.addClass('off');
                });
            }
        }

        loginElem.init();

        var detailElem = {
            dom:$('.main'),
            init:function(){
                var content = $('#todo-content-off').html();
                $('#todo-content').html(decodeURIComponent(content));
                this.initPage();

                this.initToDoOprate();
            },
            initPage:function(){
                // 初始化页面中操作按钮的可用状态
                if(parseInt(todoStatus) === -1){ // todo已终止
                    $('.btn-detail').addClass('disabled');
                    $('.todo-status').text('已终止');
                }else if(parseInt(todoStatus) === 0){ // todo正在进行
                    $('#btn-doit').addClass('disabled');
                    $('.todo-status').text('进行中');
                }else{
                    $('.todo-status').text('未开始');
                }
            },
            initToDoOprate:function(){
                var self = this;
                this.dom.on('click', '.btn-detail', function(event) {
                    event.preventDefault();
                    if($(this).hasClass('disabled')) return;
                    var id = $(this).data('id');
                    var status = $(this).data('status');
                    if(parseInt(status) === -2){
                        window.location.href = "/edit/"+id;
                        return;
                    }
                    $.ajax({
                        url: '/edit-todo',
                        type: 'post',
                        data: {
                            id:id,
                            update:{
                                status:status
                            }
                        },
                        success:function(response){
                            console.log(response);
                            if(response.code === 1){
                                todoStatus = status;
                                alert(response.msg);
                                self.initPage();
                            }
                        },
                        error:function(xhr){
                            console.log(xhr);
                        }
                    })
                    .done(function() {
                        console.log("success");
                    })
                    .fail(function() {
                        console.log("error");
                    });
                    
                });
            }
        }

        var statisElem = {
            dom:$('.main'),
            init:function(){
                this.initStatis();
                this.initPage();
            },
            initPage:function(){
                // 视图面板切换
                var oldIndex = 0;
                var container = $('.container-wrap');
                this.dom.on('click', '.static-item', function(event) {
                    event.preventDefault();
                    var index = $(this).index();
                    if(index === oldIndex) return;
                    $('.static-item').eq(oldIndex).removeClass('static-item-on');
                    $(this).addClass('static-item-on');
                    oldIndex = index;
                    container.animate({
                        'marginLeft':'-'+(index*100)+'%'
                    },800);
                });
            },
            initStatis:function(){
                var self = this;
                $.ajax({
                    url: '/doStatistic',
                    type: 'get',
                    success:function(response){
                        console.log(response);
                        if(response.code === 1){
                            self.drawChart($('#statis-ability'),response.result.ability);
                            self.drawChart($('#statis-status'),response.result.status);
                            self.drawChart($('#statis-course'),response.result.course);
                        }
                    },
                    error:function(xhr){
                        console.log(xhr)
                    }
                })
                .done(function() {
                    console.log("success");
                })
                .fail(function() {
                    console.log("error");
                });
                
            },
            drawChart:function(node,data){
                node.highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: data.title
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: '所占比重',
                        data: data.result
                    }]
                });
            }
        }

        if(page.indexOf('home') != -1){
            homeElem.init();
        }
        
        if(page.indexOf('create') != -1 || page.indexOf('edit') != -1){
            createElem.init();
        }

        if(page.indexOf('detail') != -1){
            detailElem.init();
        }

        if(page.indexOf('statistic') != -1){
            statisElem.init();
        }
    });
});
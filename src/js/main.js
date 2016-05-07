require(['jquery', 'bootstrap-validator', 'bootstrap','nicescroll'], function($) {
    $(function() {
        var page = window.location.href.split("/").reverse()[0];
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
            init:function(){
                // 初始化滚动条
                this.initScroll();

                this.initUserInfo();

                // 初始化页面中的模块切换功能
                this.initPage();

                // 初始化课程列表
                this.initCourse();

                // 创建课程
                this.createCourse();
            },
            initPage:function(){
                var courseWrap = $(".course-wrap");
                // 展开课程管理
                this.dom.on('click', '.create-task', function(event) {
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
                    var name = $("#username");
                    var pas = $("#password");
                    $.ajax({
                        url: '/edit-user',
                        type: 'POST',
                        data: {
                            name: name,
                            password:pas
                        },
                        success:function(response){
                            if(response.code !== 1){
                                alert(response.msg);
                                return;
                            }
                            $('#info-name').text(response.result.name);
                            $('#info-password').text(response.result.password);
                            userShow.removeClass('off');
                            userEdit.addClass('off');
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
            initCourse:function(){
                var self = this;
                console.log(username)
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
                        self.setCourses(results);
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
                $.ajax({
                    url: '/query-todo-uname',
                    type: 'get',
                    data: {
                        uname:username
                    },
                    success:function(response){
                        console.log(response)
                        if(response.code === 1){
                            self.setTodos(response.result);
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
            setCourses:function(data){
                var tabHtml = "";
                var navHtml = "";
                var l=data.length;
                if(l>0){
                    for(var i=0; i<l; i++){
                        tabHtml += "<tr><td><h4>"+ data[i].name +"<small class=\"ml-15\">"+ data[i].addr +"</small></h4></td><td><button data-id=\""+ data[i]._id +"\" class=\"btn btn-primary  glyphicon glyphicon-edit\"></button><button data-id=\""+ data[i]._id +"\" class=\"ml-10 btn btn-primary glyphicon glyphicon-remove\"></button></td></tr>";
                        navHtml += "<li class=\"course-item\" data-id=\""+data[i]._id+"\">"+data[i].name+"</li>";
                    }
                }else{
                    tabHtml = "<tr><td class=\"text-center\">还没有课程，赶快添加吧！</td></tr>"
                    navHtml = "<li class=\"course-item\">暂未有课程</li>"
                }
                $("#table-courses").html(tabHtml);
                $(".courses").html(navHtml);
            },
            setTodos:function(data){
                console.log(data);
            },
            createCourse:function(){
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
                    
                });
            }
        };

        loginElem.init();
        homeElem.init();

    });
});
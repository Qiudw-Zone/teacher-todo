require(["jquery","bootstrap-validator"],function(e){e(function(){e("#login,#reg").bootstrapValidator({message:"This value is not valid",feedbackIcons:{valid:"glyphicon glyphicon-ok",invalid:"glyphicon glyphicon-remove",validating:"glyphicon glyphicon-refresh"},fields:{username:{validators:{notEmpty:{message:"用户名不能为空"}}},password:{validators:{notEmpty:{message:"密码不能为空"},stringLength:{min:6,max:9,message:"密码长度为6~9"},callback:{callback:function(e,a){var t=/d/,s=/[a-zA-Z]/;return t.test(e)&&s.test(e)},message:"密码必须为数字跟字母的组合"}}},comfirm_password:{validators:{notEmpty:{message:"密码确认不能为空"},identical:{field:"password",message:"密码不一致"}}}}}).on("success.form.bv",function(e){e.preventDefault(),console.log(111)}),e(".index-container").on("click","#form-nav-text",function(a){a.preventDefault();var t=e(this).data("type");"#reg"===t?(e("#login").addClass("off"),e(this).text("登陆").data("type","#login")):(e("#reg").addClass("off"),e(this).text("注册").data("type","#reg")),e(t).removeClass("off")})})});
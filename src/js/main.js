require(['jquery', 'bootstrap-validator'], function($) {
    $(function() {
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
                        },
                        callback: {
                            callback: function(value, validator) {
                                var number_reg = /d/;
                                var letter_reg = /[a-zA-Z]/;
                                return number_reg.test(value) && letter_reg.test(value);
                            },
                            message: '密码必须为数字跟字母的组合'
                        }
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
            console.log(111);
        });

        $(".index-container").on('click', '#form-nav-text', function(event) {
            event.preventDefault();
            var type = $(this).data("type");
            if (type === "#reg") {
                $("#login").addClass('off');
                $(this).text("登陆").data("type", "#login");
            } else {
                $("#reg").addClass('off');
                $(this).text("注册").data("type", "#reg");
            }
            $(type).removeClass('off');
        });

    });
});
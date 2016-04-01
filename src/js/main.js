require(['jquery', 'bootstrap-validator'], function($) {
    $(function() {
        var SCREEN_H = $(window).height();

        var expandDom = $('#id-expand-zone');
        var expandWrapDom = $('#id-expand-wrap');

        expandDom.height(SCREEN_H);

        if (window.requestAnimationFrame) {
            var carousel = {
                dur: 2000,
                start: function() {
                    var p = 0;
                    var startTime = Date.now();
                    var self = this;

                    requestAnimationFrame(function f() {
                        p = parseInt((Date.now() - startTime) / self.dur);

                        if (p >= 5) {
                            self.onFinished();
                        } else {
                            self.onProgress(p);
                        }
                        requestAnimationFrame(f);
                    });
                },
                onProgress: function(p) {
                    console.log(p)
                },
                onFinished: function() {
                    this.start();
                }
            }

            // carousel.start();
        }

        $('#login-form').bootstrapValidator({
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
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: '邮箱不能为空'
                        },
                        regexp: {
                            message: '邮箱格式不合法',
                            regexp: /^\w+@\w+\.[a-z]+$/
                        }
                    }
                }
            }
        });

        /*setTimeout(function() {
            expandDom.addClass('ml-one');
        }, 1000);*/

        var expandclass = {
            0: 'ml-zero',
            1: 'ml-one',
            2: 'ml-two',
            3: 'ml-three',
            4: 'ml-fouth',
        };
        var expandml = {
            0: 0,
            1: '-100%',
            2: '-200%',
            3: '-300%',
            4: '-400%'
        }
        var count = 1;
        setInterval(function() {
            if (count === 5) {
                count = 0;
            }

            expandWrapDom.addClass(expandclass[count]);
            setTimeout(function() {
                expandWrapDom.css('margin-left', expandml[count]);
                expandWrapDom.removeClass(expandclass[count]);
                count++;
            }, 1000);

        }, 1300);

        // $('#id-submit').click(function(event) {});
    });
});
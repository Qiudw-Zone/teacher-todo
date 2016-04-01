var gulp = require('gulp');
var gutil = require('gulp-util'); // 设置控制台输出颜色
var uglify = require('gulp-uglify'); // 监控和压缩js文件
var watchPath = require('gulp-watch-path'); // 捕获编译和输出路径
var combiner = require('stream-combiner2'); // 用于捕获错误信息
var compass = require('gulp-compass');
var minifycss = require('gulp-minify-css'); // 用于压缩css
var imagemin = require('gulp-imagemin'); // 压缩图片
var plumber = require('gulp-plumber');

// 编译所有的js：gulp uglifyjs
gulp.task('uglifyjs', function() {
    var combined = combiner.obj([
        gulp.src('src/js/**/*.js'),
        uglify(),
        gulp.dest('dist/js/'),
    ]);
    combined.on('error', handleError);
});


// 编译所有css文件并压缩：gulp minifycss
gulp.task('minifycss', function() {
    gulp.src('src/css/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css/'));
});

// 压缩所有图片：gulp image
gulp.task('image', function() {
    gulp.src('src/img/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'));
});

// 定义捕获函数
var handleError = function(err) {
    var colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
};
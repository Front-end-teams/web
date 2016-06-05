// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    imagemin = require('gulp-imagemin'),       //图片压缩
    //sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    changed=require('gulp-changed');            //只操作有过修改的文件



// 样式处理
gulp.task('css', function () {
var cssSrc = 'public/stylesheets/*.css',
    cssDst = 'dist/css';

gulp.src(cssSrc)

    .pipe(gulp.dest(cssDst))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', function(){
    var imgSrc = 'public/images/**/*',
        imgDst = 'dist/images';
    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
})

// js处理
gulp.task('js', function () {
var jsSrc = 'public/javascripts/*.js',
    jsDst ='dist/js';

gulp.src(jsSrc)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(jsDst))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(jsDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
gulp.src(['dist/css', 'dist/js', 'dist/images'], {read: false})
    .pipe(clean());
});

 // 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('css','images','js');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){

    server.listen(port, function(err){
        if (err) {
         return console.log(err);
     }

    // 监听js
    gulp.watch('public/javascripts/*.js', function(){
        gulp.run('js');
    });

    // 监听css
    gulp.watch('public/stylesheets/*.css', function(){
        gulp.run('css');
    });

    // 监听images
    gulp.watch('public/images/*', function(){
        gulp.run('images');
    });
    });

});

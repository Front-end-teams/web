// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    fs = require('fs'),
    path = require('path'),
    merge = require('merge-stream'),
    imagemin = require('gulp-imagemin'),       //图片压缩
    //sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    changed=require('gulp-changed'),            //只操作有过修改的文件
    pngquant = require('imagemin-pngquant');
var scriptsPath = 'public/javascripts'

// 样式处理
gulp.task('css', function () {
var cssSrc = 'public/stylesheets/*.css',
    cssDst = 'public/dist/css';

gulp.src(cssSrc)

    .pipe(gulp.dest(cssDst))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', function(){
    var imgSrc = 'public/images/**/*',
        imgDst = 'public/dist/images';
    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件))
        }))
            
        .pipe(gulp.dest(imgDst));
})

// js处理
function getFolders(dir){
    return fs.readdirSync(dir)
        .filter(function(file){
            return fs.statSync(path.join(dir,file)).isDirectory();
        })
}
gulp.task('js', function () {
var jsSrc = 'public/javascripts/*.js',
    jsDst ='public/dist/js';
var folders = getFolders(scriptsPath);

var tasks = folders.map(function(folder){
    //拼接成foldername.js
    //写入输出
    //压缩
    //重命名
    //再一次写入输出
    return gulp.src(path.join(scriptsPath,folder,'/*.js'))
        .pipe(concat(folder + '.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(uglify())
        .pipe(rename(folder + '.min.js'))
        .pipe(gulp.dest(jsDst));
})
return merge(tasks);

/*gulp.src(jsSrc)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(jsDst))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(jsDst));*/
});

// 清空图片、样式、js
gulp.task('clean', function() {
gulp.src(['public/dist/css', 'public/dist/js', 'public/dist/images'], {read: false})
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

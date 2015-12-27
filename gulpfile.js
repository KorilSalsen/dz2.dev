var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    pl = require('gulp-load-plugins')({
        lazy: false
    });

var paths = {
    'css': 'app/css/*.css',
    'scss': 'app/scss/*.scss',
    'html': 'app/*.html',
    'jade': 'app/markups/_pages/*.jade',
    'sprite': 'app/img/sprites/*.png',
    'js': 'app/js/*.js'
};

//Sprites
gulp.task('sprite', function () {
    var spriteData = gulp.src(paths.sprite)
        .pipe(pl.plumber())
        .pipe(pl.spritesmith({
            imgName: '../img/sprite.png',
            cssName: '_sprite.css',
            cssFormat: 'scss',
            algorithm: 'top-down',
            cssOpts: {
                cssSelector: function (item) {
                    var index = item.name.indexOf('_');

                    if (index !== -1) {
                        var pseudo = item.name.slice(index + 1);

                        return '.' + item.name.slice(0, index) + ':' + pseudo;
                    } else {
                        return '.' + item.name;
                    }
                }
            },
            padding: 70
        }));
    spriteData.img
        .pipe(pl.rename('sprite.png'))
        .pipe(gulp.dest('app/img/'));
    spriteData.css.pipe(gulp.dest('app/scss/_common'));
});

//Compass
gulp.task('compass', function() {
    gulp.src('app/scss/main.scss')
        .pipe(pl.plumber())
        .pipe(pl.compass({
            config_file: 'config.rb',
            css: 'app/css',
            sass: 'app/scss'
        }));
        //.pipe(pl.csso())
        //.pipe(gulp.dest('app/css'));
});

//Concat
gulp.task('concat', function(){
    return gulp.src(paths.css)
        .pipe(pl.plumber())
        .pipe(pl.concatCss('main.css'))
        .pipe(gulp.dest('app/css'));
});

//Prefix
gulp.task('prefix', function(){
    return gulp.src(paths.css)
        .pipe(pl.plumber())
        .pipe(pl.autoPrefix({
            browsers: ['> 1%', 'IE 8'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'));
});

//Jade
gulp.task('jade', function(){
    return gulp.src(paths.jade)
        .pipe(pl.plumber())
        .pipe(pl.jade({
            pretty: true
        }))
        .pipe(gulp.dest('app/'));
});

//SASS
gulp.task('sass', function(){
    gulp.src(paths.scss)
        .pipe(pl.plumber())
        .pipe(pl.sass().on('error', pl.sass.logError))
        .pipe(gulp.dest('app/css'));
});

//Server
gulp.task('server', function(){
    browserSync({
        port: 9000,
        server: {
            baseDir: 'app'
        }
    });
});

//Watch
gulp.task('watch', function(){
    gulp.watch('app/markups/_common/*.jade', ['jade']);
    gulp.watch([
        paths.html,
        paths.js,
        paths.css
    ]).on('change', browserSync.reload);
});

//Default
gulp.task('default', ['server', 'watch']);
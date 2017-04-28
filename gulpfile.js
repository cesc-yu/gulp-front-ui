// 参考：http://www.gulpjs.com.cn
var gulp = require('gulp')
var concat = require('gulp-concat') // 合并文件
var minifyCss = require('gulp-minify-css') // 压缩CSS
var rev = require('gulp-rev') // 文件名加MD5后缀
var revCollector = require('gulp-rev-collector') // 路径替换
var cheerio = require('gulp-cheerio') // 对HTML和XML文件进行DOM操作

// 参考：http://www.browsersync.cn/
var browserSync = require('browser-sync').create()

var config = require('./config') // 加载配置文件
var outputCss = 'app.min.css' // 输出css路径

// 定义任务
gulp.task('auto-refresh', function() { // 浏览器自动刷新

	// 定义监听
	browserSync.watch(config.watch.js, browserSync.reload)
	browserSync.watch(config.watch.css, browserSync.reload)
	browserSync.watch(config.watch.images, browserSync.reload)
	browserSync.watch(config.watch.html, browserSync.reload)
	browserSync.watch(config.watch.index, function(event, fileName, fileMsg) {
		if (event === 'change') {
			browserSync.reload(fileName)
			console.log(fileMsg)
		}
	})

	// 启动Browser-sync服务
	browserSync.init({
		ui: false,
		server: {
			basedir: config.src,
			directory: true
		},
		// port: 8080, // 默认自动分配
		browser: ['chrome'], // 选择打开的浏览器 ['chrome', 'firefox', 'iexplore', 'baidubrowser', 'UCBrowser', '360chrome']
		startPath: config.src + config.entry.index, // 指定打开的路径
		ghostMode: { // 点击，表单和滚动在任何设备上输入将被镜像到所有设备里
			clicks: false,
			forms: false,
			scroll: false
		},
		open: 'external' // external:以IP形式打开 local:以localhost形式打开
	}, function(err, bs) {
		if (!err) {
			console.log('已启动服务器')
		}
	})
})

gulp.task('concat', function() { // 合并css文件，并映射css文件（包括MD5后缀）
	gulp.src(config.entry.css) // 需处理文件
		.pipe(concat(outputCss)) // 输出文件
		.pipe(minifyCss()) // 压缩css
		.pipe(rev()) // 文件名加MD5后缀
		.pipe(gulp.dest(config.output.css)) // 输出目录
		.pipe(rev.manifest()) // 生成rev-manifest.json
		.pipe(gulp.dest(config.dist + '/rev')) // 将rev-manifest.json 保存到rev目录内
})

gulp.task('href', function() { // 替换css引用路径
	return gulp.src(config.src + '/*.html')
		.pipe(cheerio(function ($) {
			$('link').remove()
			$('head').append('<link rel="stylesheet" href="' + outputCss + '">')
		}))
		.pipe(gulp.dest(config.dist))
})

gulp.task('rev', function() {
	gulp.src([config.dist + '/rev/*.json', config.dist + '/*.html']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
		.pipe(revCollector()) // 执行文件内css名的替换
		.pipe(gulp.dest(config.dist)) // 文件输出的目录
})

gulp.task('default', ['auto-refresh', 'concat', 'href', 'rev'])

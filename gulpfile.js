// 参考：http://www.gulpjs.com.cn
const gulp = require('gulp')
const changed = require('gulp-changed')
const concat = require('gulp-concat') // 合并文件
const cleanCSS = require('gulp-clean-css') // 压缩CSS
const babel = require('gulp-babel') // 编译es6语法
const rev = require('gulp-rev') // 文件名加MD5后缀
const revCollector = require('gulp-rev-collector') // 路径替换
const cheerio = require('gulp-cheerio') // 对HTML和XML文件进行DOM操作
const sequence = require('gulp-sequence') // 执行多个任务
const eslint = require('gulp-eslint') // js代码风格检测 参考：http://eslint.org/
const stylelint = require('gulp-stylelint') // css代码风格检测 参考：https://github.com/olegskl/gulp-stylelint

// 参考：http://www.browsersync.cn/
const browserSync = require('browser-sync').create()

const config = require('./config') // 加载配置文件
const outputCss = 'app.min.css' // 输出css路径

// 定义任务
gulp.task('run', () => { // 浏览器自动刷新

	// 定义监听
	gulp.watch(config.watch.js, ['lint-js'])
	gulp.watch(config.watch.css, ['lint-css'])
	gulp.watch(config.watch.images, browserSync.reload)
	gulp.watch(config.watch.html, browserSync.reload)
	gulp.watch(config.watch.index, (event, fileName, fileMsg) => {
		if (event === 'change') {
			browserSync.reload(fileName)
		}
	})

	browserSync.init({ // 启动Browser-sync服务
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
	}, (err, bs) => {
		if (!err) {
			console.log('已启动服务器')
		}
	})
})

gulp.task('concat-css', () => { // 合并css文件，并映射css文件（包括MD5后缀）
	return gulp
		.src(config.entry.css) // 需处理文件
		.pipe(concat(outputCss)) // 输出文件
		.pipe(cleanCSS()) // 压缩css
		.pipe(rev()) // 文件名加MD5后缀
		.pipe(gulp.dest(config.output.css)) // 输出目录
		.pipe(rev.manifest()) // 生成rev-manifest.json
		.pipe(gulp.dest(config.dist + '/rev')) // 将rev-manifest.json 保存到rev目录内
})

gulp.task('href', () => { // 替换css引用路径
	return gulp
		.src(config.src + '/*.html')
		.pipe(cheerio( ($) => {
			$('link').remove()
			$('head').append('<link rel="stylesheet" href=".' + config.output.css + '/' + outputCss + '">')
		}))
		.pipe(gulp.dest(config.dist))
})

gulp.task('rev', () => { // 生成html文件，并替换为md5的css文件名
	gulp.src([config.dist + '/rev/*.json', config.dist + '/*.html']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
		.pipe(revCollector()) // 执行文件内css名的替换
		.pipe(gulp.dest(config.dist)) // 文件输出的目录
})

gulp.task('lint-js', () => { // js代码风格检测
	return gulp
		.src(config.entry.js)
		.pipe(eslint())
		.pipe(eslint.format())
    .pipe(eslint.failAfterError())
		.pipe(browserSync.reload({
			stream: true
		}))
})

gulp.task('lint-css', () => { // css代码风格检测
	return gulp
		.src(config.entry.css)
		.pipe(stylelint({
			reporters: [
				{
					formatter: 'string',
					console: true
				}
			]
		}))
		.pipe(browserSync.reload({
			stream: true
		}))
})

gulp.task('babel-js', () => { // 编译es6代码
	return gulp
		.src(config.entry.js)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(changed(config.entry.js))
		.pipe(babel())
		.pipe(gulp.dest(config.output.js))
		.pipe(browserSync.reload({
			stream: true
		}))
})

gulp.task('default', ['run', 'concat-css']) // 浏览器自动刷新

gulp.task('concat-all', sequence('concat-css', 'href', 'rev')) // 合并css并自动生成html引用

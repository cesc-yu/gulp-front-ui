var src = './src'
var dist = './dist'

module.exports = {
	src: src,
	dist: dist,
	watch: {
		index: './index.html',
		html: src + '/components/*.html',
		css: src + '/assets/css/*.css',
		images: src + '/assets/images/*',
		js: src + '/assets/js/*.js'
	},
	entry: {
		index: '/index.html',
		html: src + '/components/*.html',
		css: src + '/assets/css/*.css',
		js: src + '/assets/js/*.js'
	},
	output: {
		entry: dist + '/index.html',
		html: dist + '/components',
		css: dist + '/assets/css',
		js: dist + '/assets/js'
	}
}
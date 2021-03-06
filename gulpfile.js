/**
 * Import all required node modules
 */
const babel = require('gulp-babel')
var babelify = require('babelify')
var browserify = require('browserify')
var fs = require('fs')
var gulp = require('gulp')
var concat = require('gulp-concat')
var cssMinify = require('gulp-css')
var sass = require('gulp-sass')
const shell = require('gulp-shell')
var uglify = require('gulp-uglify')
sass.compiler = require('node-sass')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')

/**
 * Compile Sass/Scss to Css
 * app/sass/* -> app/css/index.css
 */
gulp.task('compile-sass', () => {
	return gulp.src([
		'app/sass/index.scss',
	])
	.pipe(sass())
	.pipe(gulp.dest('app/css/'))
})

/**
 * Concatenate, minify and copy Css
 * app/css/* -> build/css/style.min.css
 */
gulp.task('copy-css', () => {
	return gulp.src('app/css/*')
	.pipe(concat('style.min.css'))
	.pipe(cssMinify())
	.pipe(gulp.dest('build/css/'))
})

/**
 * Compile and bundle Jsx/Js/ES6 (React entrypoint) to Js
 * app/js/index.js -> build/js/bundle.min.js
 */
gulp.task('compile-jsx', () => {
	var options = {
		entries: [
			'app/js/index.js'
		],
		extensions: [
			'.js',
			'.jsx'
		],
		debug: true
	}

	return browserify(options)
	.transform("babelify", {presets: ["@babel/preset-env", "@babel/preset-react"]})
	.bundle()
	.pipe(source("bundle.min.js"))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest("build/js/"))
})

/**
 * Copy Electron Js-Files
 * app/*.js -> build/*
 */
gulp.task('copy-electron-js', () => {
	return gulp.src('app/*.js')
	.pipe(gulp.dest('build/'))
})

/**
 * Copy Html
 * app/*.html -> build/*.html
 */
gulp.task('copy-html', () => {
	return gulp.src('app/*.html')
	.pipe(gulp.dest('build/'))
})

/**
 * Copy Assets
 * app/assets/** -> build/assets/**
 */
gulp.task('copy-assets', () => {
	return gulp.src('app/assets/**/*')
	.pipe(gulp.dest('build/assets/'))
})

/**
 * Ecex compile tasks
 */
gulp.task('compile', gulp.parallel('compile-sass', 'compile-jsx'))

/**
 * Ecex copy tasks
 */
gulp.task('copy', gulp.parallel('copy-css', 'copy-electron-js', 'copy-html', 'copy-assets'))

/**
 * Compile App to /build
 */
gulp.task('build', gulp.series('compile', 'copy'))

/**
 * Set Electron to development mode
 */
gulp.task('set-env:development', done => {
	process.env.NODE_ENV = 'development'
	done()
})

/**
 * Set Electron to production mode
 */
gulp.task('set-env:production', done => {
	process.env.NODE_ENV = 'production'
	done()
})

/**
 * Start Electron
 */
gulp.task('start-electron', shell.task('electron .'))

/**
 * Package App to /release
 */
if (process.platform === 'win32') {
	var packageInfo = JSON.parse(fs.readFileSync('./package.json'))
	gulp.task('package-mac', shell.task('electron-packager . --overwrite --platform=darwin --arch=x64 --icon=' + packageInfo.build.icon.mac + ' --prune=true --out=release'))
	gulp.task('package-windows', shell.task('electron-packager . ' + packageInfo.name + ' --overwrite --asar=true --platform=win32 --arch=ia32 --icon=' + packageInfo.build.icon.windows + ' --prune=true --out=release --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=' + packageInfo.productName))
	gulp.task('package-linux', shell.task('electron-packager . ' + packageInfo.name + ' --overwrite --asar=true --platform=linux --arch=x64 --icon=' + packageInfo.build.icon.linux + ' --prune=true --out=release'))
} else {
	gulp.task('package-mac', shell.task('electron-packager . --overwrite --platform=darwin --arch=x64 --icon=$npm_package_build_icon_mac --prune=true --out=release'))
	gulp.task('package-windows', shell.task('electron-packager . $npm_package_name --overwrite --asar=true --platform=win32 --arch=ia32 --icon=$npm_package_build_icon_windows --prune=true --out=release --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=$npm_package_productName'))
	gulp.task('package-linux', shell.task('electron-packager . $npm_package_name --overwrite --asar=true --platform=linux --arch=x64 --icon=$npm_package_build_icon_linux --prune=true --out=release'))
}

gulp.task('release', gulp.series('build', 'set-env:production', gulp.parallel('package-mac', 'package-windows', 'package-linux'), 'set-env:development'))

/**
 * Add watch task for Sass/Scss, Jsx and Js Files
 */
gulp.task('watch', done => {
    gulp.watch('app/assets/**/*', gulp.series('copy-assets'))
	gulp.watch('app/sass/*.scss', gulp.series('compile-sass'))
	gulp.watch('app/css/*.css', gulp.series('copy-css'))
	gulp.watch('app/js/**/*', gulp.series('compile-jsx'))
	gulp.watch('app/*.html', gulp.series('copy-html'))
	gulp.watch('app/*.js', gulp.series('copy-electron-js'))
	done()
})

/**
 * Serve App for development
 */
gulp.task('serve', gulp.series('build', 'watch', 'set-env:development', 'start-electron'))

var gulp = require('gulp');
var shell = require('gulp-shell');
var sequence = require('run-sequence');
var packager = require("electron-packager");
var package = require("./package.json");
var del = require('del');
var path = require('path');
var packagesFolder = 'build';
var dist = 'dist';

const ignoreFilter = [
    ".vscode",
    "resources",
    packagesFolder,
    "e2e",
    /^\/\bsrc\//i,
    ".angular-cli.json|.editorconfig|.gitignore|.gulpfile.js|karma.conf.js|protractor.conf.js|README.md|tsconfig.json|tslint.json"
];

gulp.task('electron-start', () => {
    return gulp.src('/').pipe(shell('electron ./dist/electron.js'));
});
gulp.task('cli-build', () => {
    return gulp.src('/').pipe(shell('ng build --base-href .'));
});
gulp.task('start', () => {
    return sequence('cli-build', 'electron-start');
});
gulp.task('run', () => {
    return sequence('electron-start');
});

gulp.task('electron-start-arg',()=>{
    return gulp.src('/').pipe(shell('electron ./dist/electron.js abc.txt'));
});

gulp.task('pack-linux', (cb) => {
    let opts = {
        name: 'dialogdemo',
        dir: './',  
        arch: 'x64',
        platform: ['linux'],
        overwrite: true,
        out: './' + packagesFolder,
        asar: true,
        ignore: ignoreFilter,
        appCopyright: "yafeya",
        appVersion: "1.0.0.0",
        icon: "src/assets/images/favicon.ico",
        win32metadata: {
            CompanyName: "yafeya",
            FileDescription: "Dialog Demo",
            OriginalFilename: "dialogdemo.exe",
            ProductName: "Dialog Demo",
            LegalCopyright: "yafeya"
        }
    }
    return packager(opts, (err, appPath) => {
        if (err) {
            console.log(`Meet error in the package process: ${err}`);
        }
    })
});

gulp.task('pack-win', (cb) => {
    let opts = {
        name: 'dialogdemo',
        dir: './',  
        arch: 'x64',
        platform: ['win32'],
        overwrite: true,
        out: './' + packagesFolder,
        asar: true,
        ignore: ignoreFilter,
        appCopyright: "yafeya",
        appVersion: "1.0.0.0",
        icon: "src/assets/images/favicon.ico",
        win32metadata: {
            CompanyName: "yafeya",
            FileDescription: "Dialog Demo",
            OriginalFilename: "dialogdemo.exe",
            ProductName: "Dialog Demo",
            LegalCopyright: "yafeya"
        }
    }
    return packager(opts, (err, appPath) => {
        if (err) {
            console.log(`Meet error in the package process: ${err}`);
        }
    })
});

gulp.task('delete-result', () => {
    return del(['dist/**/*', 'build/**/*', 'dist/', 'built', 'build']);
});

gulp.task('electron-build', () => {
    return gulp.src('/').pipe(shell('ng build --prod'));
});

gulp.task('deploy-win', () => {
    return sequence('delete-result', 'cli-build', 'pack-win');
});

gulp.task('deploy-linux', () => {
    return sequence('delete-result', 'cli-build', 'pack-linux');
});
/*
*测试模板引擎 nunjucks
views/hello.html 简单测试
views/base.html views/extend.html 模板继承测试
*/

const nunjucks = require('nunjucks'); //引入模板引擎库

/*
定义模板配置函数
path 文件路径
opts 模板设置参数
*/
function createEnv(path, opts) {
    var autoescape = opts.autoescape === undefined ? true : opts.autoescape,//
        noCache = opts.noCache || false,//缓存
        watch = opts.watch || false,//监视
        throwOnUndefined = opts.throwOnUndefined || false,
        
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('views', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
        
    if (opts.filters) {//过滤设置
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }

    return env;
}

//测试模板...
var env = createEnv('views', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});

console.log(env.render("hello.html",{name:"小明"}));
console.log();
console.log();

console.log(env.render("hello.html",{name:"<script>alert('小明')</script>"}));
console.log();
console.log();

console.log(env.render('extend.html',{header:'Hello',body:'Body------...'}));
const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');

const app = new Koa();

const isProduction = process.env.NODE_ENV === 'production';

// log request URL:
app.use( (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var start = new Date().getTime(),
        execTime;
     
    next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);//打印处理请求所用时间
});

//静态文件请求处理
if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

//解析请求体
app.use(bodyParser());

//添加模板引擎
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

//添加controller
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');

"use strict";

// koa 路由测试 get请求 post请求
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

const app = new Koa();

// log request URL:
// app.use((ctx, next) => {
//     console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
//     next();
// });
app.use(bodyParser());

// add url-route:
router.get('/hello/:name', (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});

router.post('/signin', (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

// add router middleware:
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');
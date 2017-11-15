"use strict";

// koa  get请求 post请求 bodyparser router

// -----------------
const Koa = require('koa');


// -----------------
/*
koa-bodyparser 是一个middleware,用来解析原始request请求，
然后，把解析后的参数，绑定到ctx.request.body中。
*/
const bodyParser = require('koa-bodyparser');

// ---------------------------
// 注意require('koa-router')返回的是函数:
/* 相当于:
    const fn_router = require('koa-router');
    const router = fn_router();
*/
const router = require('koa-router')();
// koa-router 是一个能集中处理URL的middleware。
// 它根据不同的URL调用不同的处理函数。
// 这样，我们才能专心为每个URL编写处理函数。


const app = new Koa();

// 添加 middleware
// koa-bodyparser 必须在 router 之前被注册到 app 对象上
app.use(bodyParser());

// 注册一个 get 请求到路由
router.get('/hello/:name', (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>${name} 您好!</h1>`;
});

router.get('/', (ctx, next) => {
    ctx.response.body = `<h1>主页</h1>
        <form action="/signin" method="post">
            <p>用户名: <input name="name" value="koa"></p>
            <p>密码: <input name="password" type="password"></p>
            <p><input type="submit" value="提交"></p>
        </form>`;
});

router.post('/signin', (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';

    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>欢迎光临, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>登录失败!</h1>
        <p><a href="/">再试试</a></p>`;
    }
});

// 添加 middleware
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');
"use strict";

const Koa = require('koa');
const app = new Koa();

let cnt = 0;
// 中间件测试 app.use() next()
app.use(async (ctx, next) => {
    console.log("请求次数：",++cnt);
    console.log("app.use 1");
    console.log("next",next.toString());
    console.log(`请求方式：${ctx.request.method} 路径：${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
});

app.use(async (ctx, next) => {
    console.log("app.use 2");
    await next(); // 调用下一个middleware
});

app.use(async (ctx, next) => {
    
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2 Test!</h1>';
    console.log("app.use 3");
});


app.listen(3000);
console.log('app started at port 3000...');
/**
 * koa Hello World 
 */

// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
// 参数ctx是由koa传入的封装了request和response的变量，我们可以通过它访问request和response
// next是koa传入的将要处理的下一个异步函数
var cnt = 0;
app.use(async (ctx, next) => {
    console.log("ctx 格式化打印：");
    console.log(JSON.stringify(ctx,null,'---'));
    console.log("next 打印：");
    console.log(next.toString());
    console.log("请求次数：",++cnt);
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');
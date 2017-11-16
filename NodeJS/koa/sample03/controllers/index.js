
var fn_index = async (ctx, next) => {

    console.log("index.js>> handle GET /");

    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>姓名: <input name="name" value="koa"></p>
            <p>密码: <input name="password" type="password"></p>
            <p><input type="submit" value="提交"></p>
        </form>`;
};

var fn_signin = async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';

    console.log(`index.js >> handle POST /signin >>signin with name: ${name}, password: ${password}`);

    if (name === 'koa' && password === '12345') {
        console.log('登录成功');
        console.log(ctx.response);
        ctx.response.body = `<h1>欢迎光临, ${name}!</h1>`;
        
    } else {
        console.log('登录失败');
        
        ctx.response.body = `<h1>登录失败!</h1>
        <p><a href="/">再试试</a></p>`;
    }

    console.log("out sigin ");
};

module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_signin
};
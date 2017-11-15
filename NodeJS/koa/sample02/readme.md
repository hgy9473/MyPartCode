# 项目说明

> 在 `Node.js` 基于 `Koa` 实现服务器

## test.js
> 测试中间件(middleware)

1. 中间件通过 `app.use` 注册
2. 中间件通过 `next()` 连接
3. 中间件执行顺序取决于注册顺序

## app.js
> 更复杂的中间件测试

1. 尝试响应 `get post` 请求。
2. 尝试使用 `koa-router` 中间件简化路由处理
3. 尝试使用 `koa-bodyparser` 中间件解析 `post` 请求参数
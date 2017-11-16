const fs = require('fs');

/*
* 一个根据映射表注册路由的函数
* 
* @param {Object} router 一个中间件，用于设置路由 
* @param {Object} mapping 包含了 req-res 对应关系
*/
function addMapping(router, mapping) {
    for (var url in mapping) {//遍历映射表
        
        if (url.startsWith('GET ')) {//判断 并处理 GET 请求
            var path = url.substring(4);
            
            router.get(path, mapping[url]);//为 get 注册路由
            
            console.log(`register URL mapping: GET ${path}`);
        
        } else if (url.startsWith('POST ')) {//判断 并处理 POST 请求

            var path = url.substring(5);
            router.post(path, mapping[url]);//为 post 注册路由
            console.log(`register URL mapping: POST ${path}`);

        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}


/**
 * 读取 controllers 目录下的 js 文件并注册路由
 * 
 * @param {Object} router 用于设置路由的中间件 
 * 
 */
function addControllers(router) {
    // 获取文件
    var files = fs.readdirSync(__dirname + '/controllers');
    // 筛选文件
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    
    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        // 获取 req-res 键值对
        let mapping = require(__dirname + '/controllers/' + f);
        // 注册路由
        addMapping(router, mapping);
    }
}

module.exports = function (dir) {
    let controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')();

    addControllers(router, controllers_dir);
    return router.routes();
};

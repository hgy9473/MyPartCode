// node.js 操作 mysql 数据库测试

const Sequelize = require('sequelize');
const config = require('./config');

//准备
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

//定义模型 映射数据库表
var Pet = sequelize.define(
    'pet', 
    {
        id: {
            type: Sequelize.STRING(50),
            primaryKey: true
        },
        name: Sequelize.STRING(100),
        gender: Sequelize.BOOLEAN,
        birth: Sequelize.STRING(10),
        createdAt: Sequelize.BIGINT,
        updatedAt: Sequelize.BIGINT,
        version: Sequelize.BIGINT
    }, 
    {
        timestamps: false
    }
);

//添加行
console.log("begin...")
var now = Date.now();

Pet.create({
    id: 'g-' + now,
    name: 'Gaffey4',
    gender: false,
    birth: '2011-11-09',
    createdAt: now,
    updatedAt: now,
    version: 0
}).then(function (p) {
    console.log('created.' + JSON.stringify(p));
}).catch(function (err) {
    console.log('failed: ' + err);
});

//添加行 方法二 async await 待解决
// (async () => {
//     var dog = await Pet.create({
//         id: 'd-' + now,
//         name: 'Odie',
//         gender: false,
//         birth: '2008-08-08',
//         createdAt: now,
//         updatedAt: now,
//         version: 0
//     });
//     console.log('created: ' + JSON.stringify(dog));
// })();
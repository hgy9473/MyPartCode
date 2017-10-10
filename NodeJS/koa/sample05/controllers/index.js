// index:

module.exports = {
    'GET /':  (ctx, next) => {
        ctx.render('index.html', {
            title: 'Welcome'
        });
    }
};

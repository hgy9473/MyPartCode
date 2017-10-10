const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

function staticFiles(url, dir) {
    return  (ctx, next) => {
        let rpath = ctx.request.path;
        if (rpath.startsWith(url)) {
            let fp = path.join(dir, rpath.substring(url.length));
            if ( fs.exists(fp)) {
                ctx.response.type = mime.lookup(rpath);
                ctx.response.body =  fs.readFile(fp);
            } else {
                ctx.response.status = 404;
            }
        } else {
             next();
        }
    };
}

module.exports = staticFiles;

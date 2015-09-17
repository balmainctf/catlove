/**
 * Created by Administrator on 2015/9/17.
 */
'use strict';
module.exports = {
    entry: './js/app.js',
    output:{
        path: __dirname+'./build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'jsx-loader' } // loaders 可以接受 querystring 格式的参数
        ]
    }
};
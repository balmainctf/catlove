/**
 *
 * Created by Administrator on 2015/9/16.
 */
//处理公用部分的js,并合并成一个common.js
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
'use strict';
module.exports = {
    entry: './js/app.js',
    output:{
        path: __dirname +'./build',
        filename: 'build.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'jsx-loader' } // loaders 可以接受 querystring 格式的参数
        ]
    }
};
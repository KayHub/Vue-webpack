
const path = require('path')
//引用path模块
const webpack = require('webpack')
//引用webpack模块
const HtmlWebpackPlugin = require('html-webpack-plugin')
//引用html-webpack-plugin模块
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//引用mini-css-extract-plugin模块用来压缩css
const PurifycssWebpack = require('purifycss-webpack')
//引用purifycss-webpack模块，用来css去冗余
const CleanWebpackPlugin = require('clean-webpack-plugin')
//引用clean-webpack-plugin，用来运行前删除指定文件或文件夹
const globAll = require('glob-all')
//引用glob-all模块，用来查找多个文件夹
const VueLoader = require('vue-loader/lib/plugin')
//引用vue-loader模块，用来运行vue

module.exports = {
    entry: {    //指定入口文件路径
        main: path.resolve(__dirname, './src/main.js'),
    },
    output: {   //指定打包后的出口文件路径
        path: path.resolve(__dirname, './dist'), //路径
        filename: 'js/[name].bundle.js', //文件名
    },
    plugins: [  //插件集合
        new VueLoader(),   //vue-loader实例，用来运行vue
        new HtmlWebpackPlugin({ //html-webpack-plugin，用来开发环境预览页面
            template: path.resolve(__dirname, './src/index.html'),
            //模板文件路径
            hash: true,
            //是否开启hash模式，用来清除缓存
            title: '家家拼',
            //html页面的title
            filename: 'index.html',
            //文件名称
            minify: {   //是否压缩
                collapseWhitespace: true,
                //是否去除空格回车
                removeAttributeQuotes: true,
                //是否去除html属性值中的双引号
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        //启用热重载
        new webpack.ProvidePlugin({
            //启用webpack.ProvidePlugin引用第三方库或自定义文件导出对象
            $: [path.resolve(__dirname, './src/common/common.js'), 'default'],
            //$为自定义名称，值是一个数组，第一个元素为自定义文件的路径或第三方库的名称，第二个元素为导出对象的默认对象，只有导出对象为构造函数时需要设置第二个元素值
            md5: 'js-md5',
            sha1: [path.resolve(__dirname, './src/lib/sha1/sha1.min.js')],
            Vue: ['vue', 'default'],
            VueRouter: ['vue-router', 'default'],
            axios: 'axios',
            qs: ['qs','default'],
        }),
        new CleanWebpackPlugin(['dist']),
        //是否在打包时删除指定文件或文件夹
        new MiniCssExtractPlugin({
            //抽离css
            filename: 'css/[name].css'
        }),
        new PurifycssWebpack({
            //css去冗余
            paths: globAll.sync([
                //使用globAll查找多个文件夹下的文件
                path.join(__dirname, './index.html'),
                //每个文件夹传入一个值，多个文件夹传入多个
                path.join(__dirname, './main.js')
            ]),
            minimize: true,
            //去冗余后启用压缩
        }),
    ],
    devServer: {
        hot: true,
        port: 8080,
        host: '127.0.0.1',
        open: true,
        disableHostCheck: true, 
        //解决内网穿透不能访问的问题
    },
    module: {
        rules: [
            {
                test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.jpg|gif|png$/, use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        outputPath: 'images',
                        //打包后的图片存放路径，会存放到出口文件夹下，值为自定义文件夹路径名称
                        name: '[name]_[hash:8].[ext]'
                        //打包后的图片名称，[name]指图片原名称，[hash:8]指图片的hash值前8位，[ext]指图片后缀名
                    }
                }
            },
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
            { test: /\.vue$/, use: 'vue-loader' }
        ]
    },
    optimization: { //提取第三方的库
        // minimize:true,  //启用压缩
        splitChunks: {
            chunks: 'all',  //initial表示只抽离入口引入的文件,async表示只抽离异步文件,all都处理
            cacheGroups: {  
                common: {   //自定义的属性名，通常和第三方库打包后的自定义文件名称相同
                    test: /[\\/]node_modules[\\/]/,
                    name:'common',  //第三方库打包之后的自定义文件名称
                    enforce: true
                },
                // styles: {    //可以分组提取多个第三方库
                //     test: /\.css|less$/,
                //     name: 'main',
                //     enforce: true
                // }
            }
        },
        runtimeChunk: { 
            //优化持久化缓存,将不需要频繁更新的代码部分抽离出来
            name: 'manifest'    //定义抽离出代码的文件名称
        }
    },
    performance: {  //webpack生产模式下的js文件limit超出警告
        hints: false    //false关闭，warning警告，error错误
    }
}
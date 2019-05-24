##  npm：

npm常用命令：

* 查看npm版本号

  ​	npm -v

* 升级npm

  npm install --global npm

* npm init (快速创建项目)

  npm init -y 可以跳过向导，快速生成package.json

* npm install ***

  npm install 包名   ->  只下载第三方包

  可简写为:npm i 包名

  npm install --save 包名   ->  下载并且保存依赖项(package.json文件中的dependencies中)

  可简写为:npm i -S 包名

* npm install

  一次性把dependencies中的依赖项全部安装

  可简写为:npm i

* npm uninstall 包名

  只删除，如果有依赖项会依然保存

  可简写为: npm un 包名

* npm uninstall --save 包名

  删除的同时也会把依赖信息也删除掉

  可简写为: npm un -S 包名

* npm help

  查看npm的使用帮助

* npm 命令 --help

  查看指定命令的使用帮助

  例如忘记uninstall简写，这时可以输入npm uninstall --help查看使用帮助。





##  npm被墙问题：

npm 存储包文件的服务器在国外，有时候会被墙，速度很慢

如何解决:

* 使用 cnpm：

​		http://npm.taobao.org/淘宝的开发团队把 npm 在国内做了一个备份

​		安装 cnpm：

​		在任意目录下执行:

​		`npm install --global cnpm `

​		`--global` 表示安装到全局，不能省略

​		安装第三方包的时候把之前的 npm 替换成 cnpm

​		例如:

​		`cnpm install jquery`

​		如果不安装cnpm 又想使用淘宝的服务器来下载：

​		`npm install jquery --registry=https://registry.npm.taobao.org`

 

​		我们可以把这个选项加入配置文件中:		

​		`npm config set registry https://registry.npm.taobao.org`

​		只要经过了上面命令的配置，则以后所有的npm install都会默认通过淘宝的服务器来下载。



​		如何验证是否配置成功:

​		查看 npm 配置信息

​		`npm config list`



* 使用 nrm：

  作用：提供了一些最常用的 npm 镜像地址，能够让我们快速的切换安装包时候的服务器地址

  只是替换了资源地址，使用方法同 npm 完全一样

  安装：

  `npm install nrm -global`

  使用 `nrm ls` 查看当前所有可用的镜像资源地址以及当前所使用的镜像资源地址

  使用 `nrm use npm` 或 `nrm use taobao`  切换不同的镜像资源地址

 

​		`npm install jquery --save`  安装后生产环境也能用

​		`npm install jquery --save-dev` 安装后只能在开发环境中使用





##  什么是webpack：

webpack是一个前端项目构建工具，基于node.js



#####  webpack解决了那些问题：

1. 网页加载速度慢，因为要发起很多二次请求

2. 处理错综复杂的依赖关系





##  webpack4.0的安装方式：

安装webpack之前先执行 `npm init` 创建 package.json 文件

`npm init -y `可以跳过向导，快速生成 package.json

1.  全局安装 webpack

   运行 `npm install webpack -global` 安装全局 webpack

   webpack 4之后 cli 被单独拿到了 webpack-cli 包里，所以安装 webpack 时要同时安装 webpack-cli 

   `npm install webpack-cli -global`

2. 项目安装webpack

   在项目根目录中运行 `npm install wepack --save-dev` 安装到项目依赖中,之后再运行 `npm install webpack-cli --save-dev ` 将 webpack-cli 也安装到项目依赖中





##  webpack4.0新增mode：

1. 开发环境(development)：

   指的是编写代码的环境

   `npm install -jqery --save-dev`

   `-dev` 表示安装到开发环境中，等到项目上线后就不用，不加 `-dev` 表示安装到生产环境中，项目上线之后依然要依赖和使用。

   完成之后package.json文件中会多出一个devDependencies属性对象，里面是对应的文件及文件版本

2. 生产环境(production)：

   项目开发完毕部署上线

   `npm install -jqery --save`

   `--save` 表示安装到生产环境中，项目上线之后依然要依赖和使用

   完成之后package.json文件中会多出一个多dpendencies属性对象，里面是对应的文件及文件版本





##  项目基本结构：

![](images\webpack\prodectList.jpg)

dist目录是放完成之后的项目

src是项目的各种资源





##  webpack打包命令：

`webpack 要打包的路径文件名 --output 打包好的路径文件名`。

这个打包可以处理js的互相依赖关系和js的兼容性问题





##  webpack警告：

WARNING in configuration：

因为webpack4.0新增了mode环境，分为development(开发环境)和production(生产环境)，如果不选择环境的话，就会报出警告 WARNING in configuration





##  Webpack基本构成：

1. mode

2. entry

3. output

4. module

5. plugins

6. devServer
7. optimization (抽离公共模块)
8. performance (设置代码编译后的尺寸警告)





## webpack配置文件：

Webpack配置文件是一个js文件，是基于Node.js的通过Node.js中的模块操作，向外暴露了一个配html置对象

```js
const path = require('path')
module.exports = {
	//在配置文件中，需要指定入口和出口文件
	entry:path.join(__dirname,'./src/main.js'),
	//入口，表示要使用webpack打包哪个文件,__dirname表示根目录，./src/从表示根目录开始要打包的哪个文件路径
    
    output:{//出口，输出文件的相关配置
        path:path.join(__dirname,'./dist'),
        //指定打包好的文件输出到哪个目录中去
        filename:'[name].bundle.js'
    	//指定输出文件的名称
    },
}
```

webpack的配置文件名不一定非得叫 webpack.config.js

如果改名为 `kay.config.js`，打包的时候要执行：

`webpack --config kay.config.js`

如果想在 `npm run` 中执行上述命令的话，可以再 package.json 中的 `scripts` 中添加配置项：

```json
"scripts":{		//webpack这个关键词是用来打包的
	"build":"webpack --config kay.config.js  --mode production",
    //在生产环境的条件下打包到硬盘中
	"dev":"webpack-dev-server --config kay1.config.js --mode development"
    //在开发环境的条件下打包到内存中
}
//可以利用这种方法实现对应的环境使用对应的webpack配置文件
```

<font color='red'>注：想要打包或者运行必须依赖 webpack 关键词或者 webpack-dev-server</font>





##  Webpack 热部署：

使用 `webpack-dev-server` 这个工具实现自动打包编译的功能

注：安装 `webpack-dev-server` 时，项目本地依赖中必须再次安装 webpack

注：安装 `webpack-dev-server` 之前必须有 package.json 文件

执行 `npm init` 创建 package.json 文件，`npm init -y` 可以跳过向导，快速生成 package.json

1. 执行 `npm install webpack-dev-server --save-dev`

   把这个工具包安装到项目的本地开发依赖

   安装警告：(webpack-dev-server@3.1.9 requires a peer of webpack@^4.0.0 but none is installed. You must install peer dependencies yourself)提示webpack-dev-server没有对应的webpack版本

   如何解决：

   只需要在当前项目的本地开发依赖中再次安装 `webpack` 和 `webpack-cli` 即可

   `npm install webpack webpack-cli --save-dev`

   以后如果在全局已经安装了 webpack 但是依然提示需要安装对应版本的webpack时，只需要在项目的本地开发依赖安装 webpack 和 webpack-cli 即可

2. 安装完毕后，这个工具的用法和 webpack 命令的用法完全一样

3. 由于上面的方法是在项目中本地安装的 `webpack-dev-server`，所以无法把它当做脚本命令在powershell终端中直接运行(只有那些安装到全局 -global 的工具，才能在终端中正常执行)，需要在 `package.json` 文件中的 `scripts` 属性对象中添加 `"dev": "webpack-dev-server"`

   ```json
   "scripts": {
   	"test": "echo \"Error: no test specified\" && exit 1",
   	"dev": "webpack-dev-server"//添加dev
   	//dev这个参数名可以自定义，保证npm run dev这个指令dev位置的参数名一致即可
   }
   ```

   注：如果编辑器有打开 localhost 的插件或功能等，切记不能让插件和 webpack-dev-server 的端口号重复，否则会导致热更新生成的 js 文件访问不到

4. webpack 项目必须将文件夹以根目录打开

   运行命令 `npm run dev` 之后，指定的入口文件会被自动编译并且默认托管到项目的根目录，所以html文件用引用的js路径要改为根路径，此时编译后的 js 文件存放于内存中，看不见摸不着

   此时，只要修改代码，页面就会自动改变。

5. `webpack-dev-server` 打包生成的 bundle.js 文件，并没有存放到实际的物理磁盘中，而是直接托管到了电脑的内存中，所以，在项目目录中根本找不到这个打包好的 bundle.js





##  devServer：

```js
module.exports = {
    devServer:{
        disableHostCheck: true, //解决webpack使用内网穿透的问题
        open:true, //在内存中打包时自动打开浏览器
        port:3000, //指定端口号为3000
        contentBase:path.resolve(__dirname,'./dist'), //指定运行时默认访问的文件地址，默认会打开当前文件夹下的index.html，如果在配置了html-webpack-plugin插件后，并且hwp实例 参数对象中filename属性指定的输出文件的文件名为index.html时，此属性不会生效
        host:'localhost', //指定打开时的域名 或者 ip地址，
        hot:true, //启动热更新，如果是在devServer中启用热更新的话，需要先引入const webpack = require(‘webpack’)模块，然后再在plugins插件数组中添加new webpack.HotModuleReplacementPlugin()实例，再启用即可。如果是在package.json中添加，只需要添加--hot即可
        }
    }
}
```





##  html-webpack-plugin：

编译 html 文件并自动引用编译后的 js 文件

安装html-webpack-plugin：

`npm install html-webpack-plugin --save-dev`

```js
//在 webpack.config.js 文件中引入这个模块
const hwp = require('html-webpack-plugin')

//再在 webpack.config.js 配置文件中的plugins数组对象中引入这个构造函数的实例
module.exports = {
    plugins:[
        new hwp({
            template:path.resolve(__dirname,'./src/index.html'),
            filename:'index.html', //生成后的html文件名称
            title:'htmlTitle', //在要生成的html中插入title标题
            				   //同时在将要生成的html中的title标签中添加:
           				 	   //<title><%= htmlWebpackPlugin.options.title%></title>
            hash:true, //每次生成的html文件中自动生成的js地址后都会添加一串hash值，以达到每次访问时消除缓存的目的
            minify:{
                collapseWhitespace:true, //删除html中的回车换行
                removeAttributeQuotes:true,//删除html中的双引号，(有少数空格删不掉，不然报错)
            }
        })
    ]
}
```



####  指定多个html文件，并生成多个html文件(html多文件)：

要生成几个html文件就创建几个 `htmlwebpackplugin` 实例

```js
plugins:[
    new hwp({
        title:'第一个html页面',
        template:path.resolve(__dirname,'./src/page1.html'),
        filename:'page1.html', //生成后的html文件名称，默认是index.html
        ...
    }),
    new hwp({
        title:'第二个html页面',
        template:path.resolve(__dirname,'./src/page2.html'),
        filename:'page2.html' //生成后的html文件名称，默认是index.html
        ...
    }),
    ...
]
```

注：如果要生成 html 多文件，filename 属性是必须的，用来指定每个 html 文件生成之后对应的名称，如果不指定该属性，只有最后一个 htmlwebpackplugin 实例对象会执行，则只会生成一个 html 文件



#### 生成多js文件和多html文件后，每个html文件分别引入自己的js：

```js
module.exports = {
    entry:{
        main1:path.resolve(__dirname,'./src/main1.js'),
        main2:path.resolve(__dirname,'./src/main2.js'),
	},
    plugins:[
    new hwp({
            chunks:['main1'],//指定当前这个hwp实例生成的html页面引入哪些js文件，值是entry入口对象的属性名
        //注：如果使用optimization抽离公共js的话，那么在多入口多出口的情况下，hwp将不会再自动引用抽离出来的公共js，需要自己手动为每一个hwp插件中的chunks添加公共js引用
            title:'第一个html页面',
            template:path.resolve(__dirname,'./src/page1.html'),
            filename:'page1.html', //生成后的html文件名称，默认是index.html
            ...
        }),
        new hwp({
            chunks:['main2'],//指定当前这个hwp实例生成的html页面引入哪些js文件，值是entry入口对象的属性名
            title:'第二个html页面',
            template:path.resolve(__dirname,'./src/page2.html'),
            filename:'page2.html', //生成后的html文件名称，默认是index.html
            ...
        }),
        ...
    ]
}
```

在每个 htmlwebpackplugin 实例中添加 `chunks` 属性，值是一个数组，数组的值指定当前这个 `hwp`  实例生成的html 页面引入哪些 js 文件，可以添加多个，值是 `entry` 入口对象的属性名





##  单文件与多文件：

1. 多文件单出口：

   ```js
   module.exports={
   	entry:[
           path.resolve(__dirname,'./src/main1.js'),
           path.resolve(__dirname,'./src/main2.js')
           //数组形式是按照顺序从左往右依次打包，会将数组内的所有文件都打包到一个输出文件中
       ],
       output:{	
           path:path.resolve(__diename,'./dist'),
       	filename:'[name].bundle.js'
       }
   }
   ```

2. 多入口多出口：

   ```js
   module.exports={
       entry:{ //在entry中用自定义属性指定多个入口文件
           main1:path.resolve(__dirname,'./src/main1.js'),
           main2:path.resolve(__dirname,'./src/main.js')
       },
       output:{
           path:path.resolve(__dirname,'./dist'),
           filename:'[name].bundle.js'	//会根据entry对象中的自定义属性名依次生成main1.bundle.js和main2.bundle.js，如果filename中的指定的文件名写死，比如写成bundle.js，同时还使用了optimization抽离第三方js库，第一个入口文件会打包成bundle.js，而之后的js文件会打包成指定的属性名+bundle.js，比如第二个main2会打包成main2.bundle.js，从第二个开始打包的名称都是默认filename定义的文件名向前追加，如果使用了[name]定义名称,则会替换[name]为原名
       }
   }
   ```

   entry有三种写法，分别是：

   ```js
   // 属性值
   entry:path.resolve(__dirname,'./src/main.js')
   
   // 数组
   entry:[
       path.resolve(__dirname,'./src/main1.js'),
       path.resolve(__dirname,'./src/main2.js')
   ]
   // 对象
   entry:{
   	main1:path.resolve(__dirname,'./src/main1.js'),
   	main2:path.resolve(__dirname,'./src/main2.js')
   }
   ```





## loader：

Webpack 默认只能打包处理 js 类型的文件，无法处理其他非 js 类型的文件

1. 如果要处理非 js 类型的文件，需要手动安装一些合适的第三方 loader 加载器

2. 安装成功之后打开webpack.config.js这个配置文件，在里面新增一个配置节点，叫做 `module`，它是一个对象，在这个 `module` 对象中有一个 `rules` 属性，这个 `rules` 属性是一个数组，这个数组中存放了所有第三方文件的匹配和处理规则

   ```js
   module.exports = {
       module:{
           rules:[
               //...
           ]
       }
   }
   ```

webpack处理第三方文件类型的过程：

1. 发现这个要处理的文件不是 js文 件，然后就去配置文件中查找有没有对应的第三方 loade r规则。

2. 如果能找到对应的规则，就会调用对应的 loader 处理这个文件类型，否则抛出错误。

   ![](images\webpack\loaderErr.jpg)

   [^loader顺序写反之后的报错信息]: 

3. 在调用 loader 的时候是从右向左调用的。

4. 当最后一个 loader 调用完毕，会把处理的结果直接交给 webpack 进行打包合并，最终输出到 bundle.js 中去。



####  loader处理css：

webpack 处理 css 依赖 `style-loader` 和 `css-loader`

安装：

` npm install style-loader css-loader --save-dev`

配置 loader规则：

```js
module.exports = {
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
                // 如果有postcss，则是
                //use:['style-loader','css-loader','postcss-loader']
            }
        ]
    }
}
```



####  loader处理less：

在项目中安装less：

`npm install less --save-dev`

之后再安装 style-loader，css-loader，less-loader：

`npm install style-loader css-loader less-loader --save-dev`

注：`less-loader` 依赖于 less 包

配置 loader规则：

```js
module.exports = {
    module:{
        rules:[
            {
                test:/\.less$/,
                use:['style-loader','css-loader','less-loader']
                // 如果有postcss，则是
                //use:['style-loader','css-loader','postcss-loader','less-loader']
            }
        ]
    }
}
```



####  loader处理scss：

在项目中安装sass包：

`npm install node-sass --save-dev`

之后再安装 style-loader，css-loader，sass-loader：

`npm install style-loader css-loader sass-loader --save-dev`

配置 loader规则：

```js
module.exports = {
    module:{
        rules:[
            {
                test:/\.scss$/,
                use:['style-loader','css-loader','sass-loader']
                // 如果有postcss，则是
                //use:['style-loader','css-loader','postcss-loader','sass-loader']
            }
        ]
    }
}
```



####  loader处理url：

默认情况下，webpack无法处理css文件中的url地址，无论图片还是字体库，只要是url，都无法处理

安装 url-loader：

`npm install url-loader --save-dev`

同时，因为 url-loade r依赖于 file-loader，所以也要安装 file-loader：

`npm install file-loader --save-dev`

配置 loader规则：

```js
module.exports = {
    module:{
        rules:[
            {
                test:/\.jpg|png|gif|bmp|jpeg$/,
                use:[{
                    loader:'url-loader',
                    options:{
                    limit:5000,	//图片的字节大小，当图片字节小于指定的值时，则图片会被转为base64并且打包到出口文件的js中，否则不会转换并同时打包到outputPath指定的目录中去。根路径以output指定的出口文件夹为准。
                    outputPath:'images', //将大于limit值的图片都打包到output指定的出口文件夹中的images文件夹下。
                    name:'[hash:8]_[name].[ext]' //[hash:8]代表的是图片的hash值的前8位，[name]代表原图片名称，[ext]代表原图片后缀名
                    }
                }]
            }
        ]
    }
}
```



####  关于loader的三种写法：

```js
// 1.
use:['style-loader','css-loader']
// 2.
loader:['style-loader','css-loader']
// 3.
use:[	
    {loader:'style-loader'},
    {loader:'css-loader'},
]
```

注：loader 的顺序一定不能写反，执行顺序是从右向左的





##  配置babel：

为了可以在开发中使用更高级的语法， 增加开发效率，通过babel可以帮我们将高级的语法转为低级的语法，增强兼容性

1. 安装：

   `npm install babel-core babel-loader babel-plugin-transform-runtime --save-dev`

    如果报错的话安装 `babel-loader@7`

   `npm install babel-preset-env babel-preset-stage-0 --save-dve`

2. 配置babel：

   ```js
   module:{
       rules:[
       	{
               test:/\.js$/,
               use:'babel-loader',
               exclude:/node_modules/
           }
       ]
   }
   ```

   注：在配置 babel 的 loader 规则时，必须把 node_modules 目录，通过 `exclude` 选项排除掉，原因有两个

   * 如果不排除 node_modules，则 babel 会把 node_modules 中所有的第三方 js 文件都打包编译，这样会非常消耗 CPU，同时打包速度非常慢
   * 就算最终 babel 把所有 node_modules 中的 js 文件都转换完毕了，但是项目也无法正常运行

3. 在项目的根目录中新建一个叫做 `.babelrc` 的 babel 配置文件，这个配置文件数据 JSON 格式，所以在写 `.babelrc` 配置文件的时候，必须符合 JSON 语法规范，不能写注释，字符串必须用双引号

   注：`.babelrc` 文件名是空的，整个文件的名字就是 `.babelrc`

   在 `.babelrc` 文件中写如下的配置：

   ```json
   {
   	"presets":["env","stage-0"],
   	//presets可以理解为语法的意思，引用的时候不加babel-preset
   	"plugins":["transform-runtime"]
   	//transform-runtime引用的时候不加babel-plugin
   
   }   // 配置成功后运行项目即可
   ```

   



##  Vue与webpack：

runtime-only 形式下不能使用传统的组件渲染方式，不能直接在js文件中使用模板对象字面量的方式注册子组件



1. webpack默认无法打包 `.vue` 文件，需要安装相关的 loader：(vue-loader， vue-template-compiler)

   `npm install vue-loader vue-template-compiler --save-dev`

   安装成功后在 webpack.config.js 配置文件中引入 `vue-loader/lib/plugin `模块并新增 loader 配置项：

   ```js
   //引入`vue-loader/lib/plugin`模块
   const vueLoaderPlugin = require('vue-loader/lib/plugin')
   
   //添加配置项
   module.exports = {
       plugins:[
   		new vueLoaderPlugin()
   	],
   	module:{
   		rules:[
   			{test:/\.vue$/,use:['vue-loader']}
   		]
   	}
   }
   ```

   配置完成后就可以使用 `.vue` 文件了

   



##  webpack优化：

####  分离css：

需要使用插件 `mini-css-extract-plugin`

`npm install mini-css-extract-plugin --save-dev`

```js
//webpack.config.js
const MiniExtract = require('mini-css-extract-plugin')

//配置 mini-css-extract-plugin
module.exports = {
    plugins:[
    new MiniExtract({
    	filename:'css/[name].main.css'//也可以使用[name],[hash]等
    }),	//在对象中指定要打包到的路径及文件名，默认是打包到output指定的文件夹下，'css/main.css'则会打包到output指定的文件夹下的css文件夹中的main.css
    rules:[
        {
            test:/\.css$/,use:[{
            	loader:MiniExtract.loader,
            	options:{
            		publicPath:'../'
            	}
            },'css-loader']
        }
	]
}
```



####  处理Less并分离：

安装 style-loader、css-loader、less-loader、less

用法同分离 css 基本一致，只不过 use 中的 loader 多了一个，还是要先下载插件 `mini-css-extract-plugin`

`npm install mini-css-extract-plugin --D`

```js
//webpack.config.js
const MiniExtract = require('mini-css-extract-plugin')
//在plugins中引入并指定分离出去的css文件路径，以output出口路径为准

//配置 mini-css-extract-plugin
module.exports = {
    plugins:[
    new MiniExtract({
    	filename:'css/main.css'//也可以使用[name],[hash]等
    }),	//在对象中指定要打包到的路径及文件名，默认是打包到output指定的文件夹下，‘css/main.css’ 则会打包到output指定的文件夹下的css文件夹中的main.css
    module:{
        rules:[
        {test:/\.less$/.use:[{
            loader:MiniExtract.loader,
                options:{
                publicPaht:'../' //分离出去的css文件中的图片路径默认会去除路径前的../，使用该属性解决此问题
            }
            },'css-loader','less-loader']}
        ]
    }
}
```



####  处理scss并分离：

安装style-loader、css-loader、sass-loader、node-sass

用法同分离 css 基本一致，只不过 use 中的 loader 多了一个，还是要先下载插件 `mini-css-extract-plugin`

`npm install mini-css-extract-plugin --D`

```js
//webpack.config.js
const MiniExtract = require('mini-css-extract-plugin')
//在plugins中引入并指定分离出去的css文件路径，以output出口路径为准：

module.exports = {
    plugins:[ 
        new MiniExtract({
            filename:'main.css'
        }) 
	],
	// 在module中的rules中添加规则
    module:{
        rules:[
            {
                test:/\.scss$/,use:[{
            		loader:MiniExtract.loader,
           			options:{
            			publicPath:'../'
            		}
            },'css-loader','sass-loader']}
        ]
    }
}
```

node-sass 因为被墙的原因安装比较困难。



####  自动处理css前缀：

使用 postCss 预处理器，专门处理 css 的平台

安装：postcss-loader、autoprefixer

`npm install postcss-loader autoprefixer --save-dev`

在项目根目录创建一个 postcss.config.js 文件，配置 postCss

```js
//在该文件内添加
module.exports={
    plugins:[
   		require('autoprefixer')
    ]
}
```

之后再在要添加前缀的 css rules 中添加 loader 即可

```js
module.exports = {
    module:{
        rules:[
            //不提取css
            {
                test:/\.css$/,use:['style-loader','css-loader','postcss-loader']
            }
            //提取css
            {
            	test:/\.css$/,use: MiniExtract.extract({
                    fallback: 'style-loader',
                    use: ['css-loader','postcss-loader'],
                    publicPath: '../'
                })
            }
        ]
    }
}
```



#####  postCss处理Less：

```js
use:['style-loader','css-loader','postcss-loader'，'less-loader']
```



#####  postCss处理Scss：

```js
use:['style-loader','css-loader','postcss-loader'，'sass-loader']
```





####  消除冗余的css：

引入第三方库时，只会用到其中很少的一部分代码，但是依然会全部打包，浪费空间

使用 purifycss 插件：

安装 purifycss-webpack、purify-css

`npm install purifycss-webpack purify-css --save-dev`

之后再安装 glob 

`npm install glob --save-dev`

```js
//webpack.config.js
const PurifycssWebpack = require('purifycss-webpack')
const glob = require('glob')

module.exports = {
    //配置plugin
    plugins:[
        new purifyCss({
			paths:glob.sync(path.resolve(__dirname, './src/*.html'))
		})
    ]
}
```

去除冗余 css 代码的原理：使用 glob 循环判断指定的文件夹下的一个或多个 html 引入的 css 代码是否冗余

<font color='red'>**注：如果使用 `extract-text-webpack-plugin` 插件分离了 css，在 `plugins` 插件数组中，`extract-text-webpack-plugin` 插件的实例对象必须放到 `purifycss-webpack` 插件的实例对象前面，否则 `purifycss-webpack` 实例对象无效！  要先分离，再去冗余！**</font>



**glob 筛选多个文件夹，去除多个文件夹下的文件引用的冗余 css：**

使用 glob-all 插件：

`npm install glob-all --save-dev`

```js
//webpack.config.js
const PurifycssWebpack = require('purifycss-webpack')
const globAll = require('glob-all')

module.exports = {
    plugins:[
        new PurifycssWebpack({
            paths: globAll.sync([
            	path.join(__dirname, './index.html'),	//可以传入多个
            	path.join(__dirname, './main.js')
            ]),
            minimize:true,	//启用css压缩
        }),
    ]
}
```



#### webpack 配置文件模块化：

方式和 node.js 一样，都是通过 `module.exports` 或者 `exports` 导出，通过 `require()` 引入



#### webpack使用第三方库的一些问题：

引入第三方库的方法：

1. npm 直接下载，然后 `import` 引入

   `npm install vue --save`

   `import Vue from 'vue'`	

   `import` 引入之后，无论你在代码中是否使用，打包后，都会打进去，这样就会产生大量的冗余js代码。

2. 使用 webpack 中的内置插件 `ProvidePlugin`：

   ```js
   //webpack.config.js
   //引入 webpack
   const webpack = require('webpack')
   
   module.exports = {
       //在plugins中引入webpack实例对象
       plugins:[
           new webpack.ProvidePlugin({
               $:'jquery',
               Vue:['vue', 'default'],
               VueRouter:['vue-router', 'default']
               //属性是对外暴露的名称，参数是要引入模块的名称
               //注：如果模块使用export default导出的，则引入时的参数必须是数组，数组的第二个值必须是’default’
           })
       ]
   }
   ```

   只要 js 文件中使用 `export default` 或者 `export` 导出参数或对象了，都可以使用 `ProvidePlugin` 插件引入这个 js 文件。

   引入自定义文件：

   ```js
   new webpack.ProvidePlugin({
   	$: path.resolve(__dirname, './src/common/base.js')
   })
   ```

   通过 `ProvidePlugin` 插件引入和 `import` 直接引入的区别：

   1. `import` 引入之后，无论你在代码中是否使用，打包后，都会打进去，这样就会产生大量的冗余js代码。

   2. 使用 `ProvidePlugin` 插件引入第三方包后，只有你使用了该第三方库，才会打包。



#### 提取第三方(自己想提取的)js库：

将引用到的或使用的第三方库或者自己指定的文件夹下的 js (一定要被引用或使用过) 提取分离

webpack4: 使用默认配置项

```js
module.exports={
..
    optimization:{
        splitChunks:{
            chunks:'initial', //initial表示只抽离入口引入的文件,async表示只抽离异步文件,all都处理
            cacheGroups:{
            	自定义属性名:{
            		test: /[\\/]node_modules[\\/]/,//匹配要抽离的js所在的文件夹的正则，必须值，否则将会出现入口js文件也打包到抽离文件中的情况
            		name:'js/common',
            		enforce:true,
            	}，
            	自定义属性名:{
            		test:/[\\/]src[\\/]js[\\/]/,   
                    //也可以是文件/[\\/]src[\\/]js[\\/].*\.js/
            		name:'js/index',
            		enforce:true,
            	}，
            }
        },
        runtimeChunk: {	//优化持久化缓存,将不需要频繁更新的代码部分抽离出来
       	 	name: 'manifest'
       	}
    }
}
```

要抽离不同的文件夹下的 js 代码，就要为其分别指定抽离规则，并在 `test` 属性中指定要抽离代码的 js 文件夹路径，同时在 `name` 属性中指定抽离成功之后的 js 文件路径及文件名称。

runtimeChunk：`runtime` 指的是 webpack 的运行环境 (具体作用就是模块解析，加载) 和 模块信息清单，模块信息清单在每次有模块变更(hash 变更)时都会变更，所以我们想把这部分代码单独打包出来，配合后端缓存策略，这样就不会因为某个模块的变更导致包含模块信息的模块 (通常会被包含在最后一个 bundle 中)缓存失效。`optimization.runtimeChunk` 就是告诉 webpack 是否要把这部分单独打包出来



#### 打包和运行时先删除(清除)指定文件夹：

使用 `clean-webpack-plugin`

`npm install clean-webpack-plugin --save-dev`

```js
const CWP = require('clean-webpack-plugin')
module.exports = {
    plugins:[
    	new CWP(['dist']) //参数是一个数组，数组中指定要删除哪个目录，默认从根目录开始
    ]
}
```





## performance：

```js
performance: {	//关闭webpack生产模式下的js文件limit超出警告
	hints: false
}
```


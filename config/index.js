// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        sitEnv: require('./sit.env'),
        prodEnv: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',          //请根据自己路径配置更改
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        //选择调试文件
        env: require('./dev.env'),
        //服务启动端口
        port: 9527,
        //启动后打开浏览器
        autoOpenBrowser: true,
        //资源子目录 指js,css，img存放的目录，其路径相对于index.html
        //介绍连接https://segmentfault.com/a/1190000010627001
        assetsSubDirectory: 'static',
        //资源目录默认是这样配置的assetsPublicPath: '/'，指assetsSubDirectory目录也就是js,css,img等资源相对于服务器host地址，传说中的绝对路径，host是什么,ip地址加端口号，
        assetsPublicPath: '/',
        // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
        // 例如将'localhost:8080/api/xxx'代理到'www.example.com/api/xxx'
         // 使用方法：https://vuejs-templates.github.io/webpack/proxy.html
         //介绍文档https://www.jianshu.com/p/744691eeb8f0
        proxyTable: {
          //权限
          '/jwt': {
            target: 'http://localhost:8766',
            pathRewrite: {
              '^/jwt': '/jwt'  //实际请求去掉/api以空字符串代替
            },
          },
          //目前接口
          '/api':{
            target: 'http://localhost:8766',
            pathRewrite: {
              '^/api': '/api'
            },
          }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}

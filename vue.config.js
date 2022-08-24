const path = require('path')
    
function resolve (dir) {
  return path.join(__dirname, './', dir)
}



module.exports = {
    lintOnSave: false,
    devServer: {
        // host: '192.168.31.215', // ip
        host: '192.168.8.68', // ip
        port: 6688, // 设置端口号
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        proxy: null  //设置代理
    },


    //icon相关
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    },
    /* svg 相关配置 */
    chainWebpack: (config) => {
        // set svg-sprite-loader
        config.module.rules.delete('svg'); // 重点:删除默认配置中处理svg
        config.module
          .rule('svg-sprite-loader')
          .test(/\.svg$/)
          .include
          .add(resolve('src/icons')) // 处理svg目录
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]',
          });
      },
}

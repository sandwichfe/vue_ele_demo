module.exports = {
    lintOnSave: false,
    devServer: {
        host: '192.168.8.68', // ip
        port: 6688, // 设置端口号
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        proxy:null  //设置代理
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
    }


}

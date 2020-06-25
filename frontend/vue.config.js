const fs = require('fs')
module.exports = {
    devServer: {
        port: '8080',
        //host: "connectable.dev",
        disableHostCheck: true,
        // https: true,
        // key: fs.readFileSync('./certs/server.key'),
        // cert: fs.readFileSync('./certs/server.crt')
    },
    configureWebpack: {
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
            }
        },
        stats: 'errors-only',
    }
}

module.exports = {
    development: {
        port: process.env.PORT || 3000,
        saltingRounds: 10,
    },
    // не работает для require
    // resolve: {
    //     alias: {
    //         Models: path.resolve(__dirname, 'app/models/')
    //     }
    // }
};
module.exports = {
    publicPath: "/reader",
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3010/',
                changeOrigin: true
            },
            '/books': {
                target: 'http://localhost:3010',
                changeOrigin: true
            }
        }
    }
};
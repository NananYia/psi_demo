const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(createProxyMiddleware('/api', {
        target: "http://localhost:9999",
        changeOrigin: true,
        pathRewrite: {  "^/api": "/psiERP-boot" },
        secure: true //如果访问的是https类的链接，就需要设置为true
    }))
}
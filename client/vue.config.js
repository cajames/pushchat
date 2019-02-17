module.exports = {
    lintOnSave: false,
    devServer: {
        port: 8080,
        proxy: {
            "^/api": {
                target: "http://localhost:3000",
                ws: false,
                changeOrigin: true
            }
        }
    },
    pwa: {
        name: "Pushchat"
    }
};

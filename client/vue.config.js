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
    name: "Pushchat",
    themeColor: "#6574cd",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black-translucent",

    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/assets/sw.js"
    }
  }
};

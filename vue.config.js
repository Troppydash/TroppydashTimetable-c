module.exports = {
    configureWebpack:{
        optimization: {
            splitChunks: {
                minSize: 10000,
                maxSize: 250000,
            }
        }
    },
    pwa: {
        name: "STimetable (Dev)",
        themeColor: "#b82832"
    }
}

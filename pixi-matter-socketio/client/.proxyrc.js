const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
    app.use(
        createProxyMiddleware("/socket.io", {
            target: "http://localhost:3001/",
        })
    );

    // app.use(
    //     createProxyMiddleware("/socket.io", {
    //         target: "ws://localhost:3001/",
    //         ws: true,
    //     })
    // );
};

const jsonServer = require("json-server");
const cookieParser = require("cookie-parser");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const express = require("express");
const get = require("lodash/get");

const dataModel = {
    users: [],
    messages: []
}

const router = jsonServer.router(dataModel);

// Set default middlewares (logger, static, cors and no-cache)
server.use(cookieParser());
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router
server.post("/api/setUser", (req, res) => {
    const user = req.body.user
    res.cookie('user', user)
    res.sendStatus(200)
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use((req, res, next) => {
    if (req.method === "POST") {
        req.body.createdAt = Date.now();
    }
    // Continue to JSON Server router
    next();
});

// Use default router
server.use('/api', middlewares);
server.use('/api', router);
if (process.env.NODE_ENV === "production") {
    // Serve client side
    server.use(express.static("./public"));
}

server.listen(3000, () => {
    console.log("JSON Server is running");
});

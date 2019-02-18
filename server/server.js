const jsonServer = require("json-server");
const cookieParser = require("cookie-parser");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const express = require("express");
const get = require("lodash/get");
const webpush = require("web-push");
const fs = require("fs");

// Configure web-push
const publicVapidKey =
  "BBU8orMQ7mdAobZYAQUgQ0mhkUiMO1KVjToepH_orj4JD2zChcoH_gedtK6Hya-QBHUQ17-_aC9DgyLMx-vcmmQ";
const privateVapidKey = "-AVd4aJXw2IJssA42nN-F0tywIIaWGzX9WobuNxQeUA";
webpush.setVapidDetails(
  "mailto:chris@webglowit.net",
  publicVapidKey,
  privateVapidKey
);

const router = jsonServer.router("./db.json");

// Set default middlewares (logger, static, cors and no-cache)
server.use(cookieParser());
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router
server.post("/api/setUser", (req, res) => {
  const user = req.body.user;
  res.cookie("user", user);
  res.sendStatus(200);
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

// Trigger push
server.use((req, res, next) => {
  if (req.method === "POST" && req.originalUrl === "/api/messages") {
    fs.readFile(`./db.json`, "utf8", (err, data) => {
      if (err) {
        console.error("Failed to push message");
        return;
      }

      // get all required props
      const db = JSON.parse(data);
      const message = req.body;
      const user = db.users.find(user => user.id === message.to);
      const notificationSub = get(user, "notification");

      const origin = get(req, "headers.origin", "");
      // If sub, push
      if (notificationSub) {
        const payload = {
          title: `New message from ${message.from}`,
          message: message.text,
          chatUser: message.from,
          chatUrl: `${origin}/chat/${message.from}`,
          redirectUrl: `${origin}/?chat=${message.from}`
        };
        webpush.sendNotification(notificationSub, JSON.stringify(payload));
        console.log("sent notification");
      }
    });
  }
  // Continue to JSON Server router
  next();
});

// Broadcast URL
server.use((req, res, next) => {
  if (req.method === "POST" && req.originalUrl === "/api/broadcast") {
    const origin = get(req, "headers.origin", "");
    const message = req.body;

    fs.readFile(`./db.json`, "utf8", (err, data) => {
      const db = JSON.parse(data);
      const users = db.users;

      users.map(user => {
        const notificationSub = get(user, "notification");
        if (notificationSub) {
          const payload = {
            title: `New message via Broadcast `,
            message: message.text,
            redirectUrl: `${origin}/`
          };
          webpush.sendNotification(notificationSub, JSON.stringify(payload));
        }
      });
      console.log("broadcast sent");
    });
  }
  next();
});

// Use default router
server.use("/api", middlewares);
server.use("/api", router);

if (process.env.NODE_ENV === "production") {
  // Serve client side
  server.use(express.static("./public"));
  // Handle 404s to just return the index.html
  server.use((req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
  });
}

server.listen(3000, () => {
  console.log("JSON Server is running");
});

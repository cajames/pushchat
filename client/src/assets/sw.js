console.log("Loading from Service worker!!");

workbox.routing.registerRoute("/", workbox.strategies.staleWhileRevalidate());
workbox.routing.registerRoute(
  new RegExp("/js/"),
  workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
  new RegExp("/css/"),
  workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
  new RegExp(".png$"),
  workbox.strategies.staleWhileRevalidate()
);

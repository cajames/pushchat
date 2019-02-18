console.log("Loading from Service worker!!");

workbox.routing.registerRoute("/", workbox.strategies.networkFirst());
workbox.routing.registerRoute(
  new RegExp(".(js|css|png)$"),
  workbox.strategies.networkFirst()
);

// Handle notification!
self.addEventListener("push", async e => {
  const data = e.data.json();
  console.log("Push Received...");

  const url = data.chatUrl;

  // Don't show if active window
  const isAlreadyActive = await isClientFocused();
  if (isAlreadyActive) {
    return;
  }

  // Have relevant actions

  // Show's notification
  self.registration.showNotification(data.title, {
    body: `"${data.message}"`,
    data: {
      chatUrl: data.chatUrl,
      redirectUrl: data.redirectUrl
    },
    badge: "/img/icons/favicon-32x32.png",
    icon: "/img/icons/android-chrome-192x192.png",
    actions: [
      { action: "seeAll", title: "See all Messages" },
      { action: "reply", title: `Reply to ${data.chatUser}` }
    ]
  });
});

// handle the notification click
self.addEventListener(
  "notificationclick",
  function(event) {
    var { chatUrl, redirectUrl } = event.notification.data;

    event.notification.close();

    let promise = null;
    if (event.action === "seeAll") {
      promise = openOrFocusUrl("/", "/");
    } else if (event.action === "reply") {
      promise = openOrFocusUrl(chatUrl, redirectUrl);
    } else {
      promise = openOrFocusUrl(chatUrl, redirectUrl);
    }

    event.waitUntil(promise);
  },
  false
);

// Helper Functions

// Open the url or focus
const openOrFocusUrl = async (url, redirect) => {
  const windowClients = await clients.matchAll({
    type: "window",
    includeUncontrolled: true
  });

  let matchingClient = null;
  for (let i = 0; i < windowClients.length; i++) {
    const windowClient = windowClients[i];
    if (windowClient.url === url) {
      matchingClient = windowClient;
      break;
    }
  }

  if (matchingClient) {
    return matchingClient.focus();
  } else {
    return clients.openWindow(redirect);
  }
};

// Is the client already opened
function isClientFocused() {
  return clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      let clientIsFocused = false;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.focused) {
          clientIsFocused = true;
          break;
        }
      }

      return clientIsFocused;
    });
}

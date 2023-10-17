import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "app-id",
  key: "app-key",
  secret: "app-secret",
  cluster: "",
  useTLS: false,
  host: "127.0.0.1",
  port: "6001",
});

export const pusherClient = new PusherClient("app-key", {
  cluster: "",
  httpHost: "127.0.0.1",
  httpPort: 6001,
  wsHost: "127.0.0.1",
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
  authTransport: "ajax",
  authEndpoint: "/api/pusher-auth",
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

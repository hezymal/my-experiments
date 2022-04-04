import { ClientApp } from "./ClientApp";

const clientApp = new ClientApp({ socketUrl: "ws://localhost:1234" });
clientApp.run();

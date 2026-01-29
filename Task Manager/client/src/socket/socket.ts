// client/src/socket/socket.ts
import { io } from "socket.io-client";

export const socket = io(
  // "http://localhost:5000", 
  "https://pfx9d576-5000.inc1.devtunnels.ms",
  {
  autoConnect: false
});

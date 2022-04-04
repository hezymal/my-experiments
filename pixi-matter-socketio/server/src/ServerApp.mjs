import { Server } from "socket.io";

const ROOM_PLAYERS_ID = "players";

const EVENT_TYPE_NEW_PLAYER = "new-player";
const EVENT_TYPE_DESTROY_PLAYER = "destroy-player";
const EVENT_TYPE_PLAYER_POSITION = "player-position";

export class ServerApp {
    constructor() {
        this.run = this.run.bind(this);
        this.handleSocketConnect = this.handleSocketConnect.bind(this);
        this.handleSocketDisconnect = this.handleSocketDisconnect.bind(this);
        this.handlePlayerPosition = this.handlePlayerPosition.bind(this);
    }

    run(port) {
        this.server = new Server(port);
        this.server.on("connection", this.handleSocketConnect);
    }

    async handleSocketConnect(socket) {
        socket.join(ROOM_PLAYERS_ID);

        socket.to(ROOM_PLAYERS_ID).emit(EVENT_TYPE_NEW_PLAYER, {
            socketId: socket.id,
        });

        const socketsIds = await this.server.in(ROOM_PLAYERS_ID).allSockets();
        for (const socketId of socketsIds) {
            if (socketId !== socket.id) {
                socket.emit(EVENT_TYPE_NEW_PLAYER, { socketId });
            }
        }

        socket.on("disconnect", () => {
            this.handleSocketDisconnect(socket);
        });

        socket.on(EVENT_TYPE_PLAYER_POSITION, (arg) => {
            this.handlePlayerPosition(socket, arg);
        });
    }

    handleSocketDisconnect(socket) {
        socket.to(ROOM_PLAYERS_ID).emit(EVENT_TYPE_DESTROY_PLAYER, {
            socketId: socket.id,
        });
    }

    handlePlayerPosition(socket, arg) {
        socket.to(ROOM_PLAYERS_ID).emit(EVENT_TYPE_PLAYER_POSITION, arg);
    }
}

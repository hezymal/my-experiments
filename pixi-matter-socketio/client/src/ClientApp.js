import * as Matter from "matter-js";
import * as Pixi from "pixi.js";
import { io } from "socket.io-client";

const MOVEMENT_SPEED = 4;
const JUMP_SPEED = 7;

const EVENT_TYPE_NEW_PLAYER = "new-player";
const EVENT_TYPE_DESTROY_PLAYER = "destroy-player";
const EVENT_TYPE_PLAYER_POSITION = "player-position";

export class ClientApp {
    constructor(options) {
        this.options = options;

        this.socket = null;
        this.matterEngine = null;
        this.pixiApp = null;

        this.sceneObjects = [];
        this.isJumped = false;
        this.moveDirection = 0;
        this.player = null;

        this.initializeSocket = this.initializeSocket.bind(this);
        this.initializeKeyboard = this.initializeKeyboard.bind(this);
        this.initializePixi = this.initializePixi.bind(this);
        this.initializeMatter = this.initializeMatter.bind(this);
        this.initializeStaticObjects = this.initializeStaticObjects.bind(this);
        this.run = this.run.bind(this);
        this.handleSocketConnect = this.handleSocketConnect.bind(this);
        this.handleNewPlayer = this.handleNewPlayer.bind(this);
        this.handlePlayerPosition = this.handlePlayerPosition.bind(this);
        this.handlePlayerDestroy = this.handlePlayerDestroy.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleTicker = this.handleTicker.bind(this);
        this.createLabel = this.createLabel.bind(this);
        this.createStaticObject = this.createStaticObject.bind(this);
        this.createPlayerObject = this.createPlayerObject.bind(this);
    }

    initializeSocket() {
        this.socket = io(this.options.socketUrl);
        this.socket.on("connect", this.handleSocketConnect);
        this.socket.on(EVENT_TYPE_NEW_PLAYER, this.handleNewPlayer);
        this.socket.on(EVENT_TYPE_PLAYER_POSITION, this.handlePlayerPosition);
        this.socket.on(EVENT_TYPE_DESTROY_PLAYER, this.handlePlayerDestroy);
    }

    initializeKeyboard() {
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    initializePixi() {
        this.pixiApp = new Pixi.Application({
            backgroundAlpha: 0,
            resizeTo: document.body,
        });
        this.pixiApp.ticker.add(this.handleTicker);

        document.body.appendChild(this.pixiApp.view);
    }

    initializeMatter() {
        this.matterEngine = Matter.Engine.create();
        Matter.Runner.run(this.matterEngine);
    }

    initializeStaticObjects() {
        const ground = this.createStaticObject({
            id: "ground",
            imageUrl: new URL("ground.png", import.meta.url),
            initialPosition: {
                x: 700,
                y: 500,
            },
            width: 810,
            height: 60,
            body: {
                friction: 0,
                isStatic: true,
            },
        });

        Matter.World.addBody(this.matterEngine.world, ground.body);
        this.pixiApp.stage.addChild(ground.sprite);
        this.sceneObjects.push(ground);
    }

    run() {
        this.initializeSocket();
        this.initializeKeyboard();
        this.initializePixi();
        this.initializeMatter();
        this.initializeStaticObjects();
    }

    handleSocketConnect() {
        this.player = this.createPlayerObject({
            id: this.socket.id,
            label: this.socket.id,
            imageUrl: new URL("player.png", import.meta.url),
            initialPosition: {
                x: 400,
                y: 200,
            },
            width: 40,
            height: 80,
            body: {
                friction: 0,
                inertia: Infinity,
            },
        });

        Matter.World.addBody(this.matterEngine.world, this.player.body);
        this.pixiApp.stage.addChild(this.player.sprite);
        this.sceneObjects.push(this.player);
    }

    handleNewPlayer(arg) {
        if (arg.socketId === this.socket.id) {
            return;
        }

        const newPlayer = this.createPlayerObject({
            id: arg.socketId,
            label: arg.socketId,
            imageUrl: new URL("player.png", import.meta.url),
            initialPosition: {
                x: 400,
                y: 200,
            },
            width: 40,
            height: 80,
            body: {
                friction: 0,
                inertia: Infinity,
            },
        });

        Matter.World.addBody(this.matterEngine.world, newPlayer.body);
        this.pixiApp.stage.addChild(newPlayer.sprite);
        this.sceneObjects.push(newPlayer);
    }

    handlePlayerPosition(arg) {
        if (arg.socketId === this.socket.id) {
            return;
        }

        const sceneObject = this.sceneObjects.find(
            (o) => o.id === arg.socketId
        );
        if (!sceneObject) {
            return;
        }

        Matter.Body.setPosition(
            sceneObject.body,
            Matter.Vector.create(arg.position.x, arg.position.y)
        );
    }

    handlePlayerDestroy(arg) {
        const sceneObject = this.sceneObjects.find(
            (o) => o.id === arg.socketId
        );
        if (!sceneObject) {
            return;
        }

        this.pixiApp.stage.removeChild(sceneObject.container);
        Matter.World.remove(this.matterEngine.world, sceneObject.body);
    }

    handleKeyDown(event) {
        switch (event.key) {
            case "ArrowLeft": {
                this.moveDirection = -MOVEMENT_SPEED;

                const position = Matter.Vector.add(
                    this.player.body.position,
                    Matter.Vector.create(-MOVEMENT_SPEED, 0)
                );
                Matter.Body.setPosition(this.player.body, position);

                this.socket.emit(EVENT_TYPE_PLAYER_POSITION, {
                    socketId: this.socket.id,
                    position,
                });
                break;
            }

            case "ArrowRight": {
                this.moveDirection = MOVEMENT_SPEED;

                const position = Matter.Vector.add(
                    this.player.body.position,
                    Matter.Vector.create(+MOVEMENT_SPEED, 0)
                );
                Matter.Body.setPosition(this.player.body, position);

                this.socket.emit(EVENT_TYPE_PLAYER_POSITION, {
                    socketId: this.socket.id,
                    position,
                });
                break;
            }

            case "ArrowUp": {
                let velocity = this.player.body.velocity;

                if (Math.abs(velocity.y) < 0.1) {
                    velocity = Matter.Vector.add(
                        velocity,
                        Matter.Vector.create(this.moveDirection, -JUMP_SPEED)
                    );
                    Matter.Body.setVelocity(this.player.body, velocity);

                    this.socket.emit(EVENT_TYPE_PLAYER_POSITION, {
                        socketId: this.socket.id,
                        position: this.player.body.position,
                    });
                    this.isJumped = true;
                }
                break;
            }
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case "ArrowLeft":
            case "ArrowRight":
                this.moveDirection = 0;
                break;

            case "ArrowUp":
                this.isJumped = false; // TODO: после коллизии с землей
                break;
        }
    }

    handleTicker() {
        this.sceneObjects.forEach((sceneObject) => {
            sceneObject.sprite.position = sceneObject.body.position;
            sceneObject.sprite.rotation = sceneObject.body.angle;
        });
    }

    createLabel(options) {
        const sprite = new Pixi.Text(options.text, {
            fontFamily: "Arial",
            fontSize: 16,
            fill: 0xff1010,
            align: "center",
        });

        return { sprite };
    }

    createStaticObject(options) {
        const body = Matter.Bodies.rectangle(
            options.initialPosition.x,
            options.initialPosition.y,
            options.width,
            options.height,
            options.body
        );

        const sprite = Pixi.Sprite.from(options.imageUrl.toString());
        sprite.width = options.width;
        sprite.height = options.height;
        sprite.anchor.set(0.5, 0.5);

        return { id: options.id, body, sprite };
    }

    createPlayerObject(options) {
        const body = Matter.Bodies.rectangle(
            options.initialPosition.x,
            options.initialPosition.y,
            options.width,
            options.height,
            options.body
        );

        const container = new Pixi.Container();

        const sprite = Pixi.Sprite.from(options.imageUrl.toString());
        sprite.width = options.width;
        sprite.height = options.height;
        sprite.anchor.set(0.5, 0.5);
        container.addChild(sprite);

        if (options.label) {
            const label = this.createLabel({ text: options.label });
            label.sprite.anchor.set(0.5, 1);
            label.sprite.position.y = options.height / -2;
            container.addChild(label.sprite);
        }

        return { id: options.id, body, sprite: container };
    }
}

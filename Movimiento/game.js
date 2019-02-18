var sprites = {
    ship: {
        sx: 0,
        sy: 0,
        w: 37,
        h: 42,
        frames: 1
    },
    enemy_purple: {
        sx: 37,
        sy: 0,
        w: 42,
        h: 43,
        frames: 1
    },
    enemy_bee: {
        sx: 79,
        sy: 0,
        w: 37,
        h: 43,
        frames: 1
    },
    enemy_ship: {
        sx: 116,
        sy: 0,
        w: 42,
        h: 43,
        frames: 1
    },
    enemy_circle: {
        sx: 158,
        sy: 0,
        w: 32,
        h: 33,
        frames: 1
    },
    player_missile: {
        sx: 0,
        sy: 42,
        w: 7,
        h: 20,
        frames: 1
    },
    enemy_missile: {
        sx: 9,
        sy: 42,
        w: 3,
        h: 20,
        frames: 1
    },
    explosion: {
        sx: 0,
        sy: 64,
        w: 64,
        h: 64,
        frames: 12,
        name: "explosion"
    }
};
// Especifica lo que se debe pintar al cargar el juego
var startGame = function () {
    Game.setBoard(0, new PlayerShip());
}
// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
    Game.initialize("game", sprites, startGame);
});

var PlayerShip = function () {
    this.w = SpriteSheet.map['ship'].w;
    this.h = SpriteSheet.map['ship'].h;
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - 10 - this.h;
    this.vx = 0;
    this.maxVel = 200;
    this.step = function (dt) {
        if (Game.keys['left']) {
            this.vx = -this.maxVel;
        } else if (Game.keys['right']) {
            this.vx = this.maxVel;
        } else {
            this.vx = 0;
        }
        this.x += this.vx * dt;
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > Game.width - this.w) {
            this.x = Game.width - this.w
        }
    }
    this.draw = function (ctx) {
        SpriteSheet.draw(ctx, 'ship', this.x, this.y, 0);
    }
}
// Variables
var sprites = {
    ship: {
        sx: 0,
        sy: 0,
        w: 37,
        h: 42,
        frames: 1
    },
    enemy_ship_purple: {
        sx: 37,
        sy: 0,
        w: 42,
        h: 43,
        frames: 1
    },
    enemy_ship_orange: {
        sx: 79,
        sy: 0,
        w: 37,
        h: 43,
        frames: 1
    },
    enemy_ship_gray: {
        sx: 116,
        sy: 0,
        w: 42,
        h: 43,
        frames: 1
    },
    enemy_green_ball: {
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
        frames: 12
    }
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;


// Funciones

// Especifica lo que se debe pintar al cargar el juego
var startGame = function () {
    Game.setBoard(0, new TitleScreen("Alien Invasion",
        "Press fire to start playing",
        playGame));
    Game.setBoard(1, new PrintMsg("FPS:"));
}
var playGame = function () {
    Game.setBoard(0, new TitleScreen("Alien Invasion",
        "Game Started ..."));
    Game.setBoard(1, new PrintMsg("FPS:"));
}

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
    Game.initialize("game", sprites, startGame);
});
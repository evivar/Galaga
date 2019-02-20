// Variables

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
}

var playGame = function () {
    /*Game.setBoard(0, new StarField(20,0.4,100,true));
    Game.setBoard(1, new StarField(50, 0.6, 100));
    Game.setBoard(2, new StarField(100, 1.0, 50));*/
    var board = new GameBoard();
    board.add(new PlayerShip());
    board.add(new Enemy(enemies.basic));
    board.add(new Enemy(enemies.basic, {
        x: 200
    }));
    board.add(new Enemy(enemies.bee, {
        x: 200
    }));
    board.add(new Enemy(enemies.bee, {
        x: 250
    }));
    Game.setBoard(0, board);
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
    Game.initialize("game", sprites, startGame);
});

function drawExplosion_Low2High() {
    var fire = 13;
    var id = setInterval(explosion, 50);

    function explosion() {
        if (fire == -1) {
            clearInterval(id);
        } else {
            fire--;
            SpriteSheet.render(ctx, "explosion", 150, 100, fire);
        }
    }
}

function drawExplosion_High2Low() {
    var fire = 0;
    var id = setInterval(explosion, 50);

    function explosion() {
        if (fire > 12) {
            clearInterval(id);
        } else {
            fire++;
            SpriteSheet.render(ctx, "explosion", 250, 100, fire);
        }
    }
}
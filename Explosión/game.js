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

var canvas = document.getElementById('game');
var ctx = canvas.getContext && canvas.getContext('2d');
if (!ctx) {
    // No 2d context available, let the user know
    alert('Please upgrade your browser');
} else {
    startGame();
}

function startGame() {
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(50, 100, 380, 400);
    ctx.fillStyle = "rgba(0,0,128,0.5)";
    ctx.fillRect(25, 50, 380, 400);
}

SpriteSheet.load({
    explosion: {
        sx: 0,
        sy: 64,
        w: 64,
        h: 64,
        frames: 12
    }
}, function () {});

function drawExplosionLow2High() {
    var fire = 13;
    var id = setInterval(explosion, 30);

    function explosion() {
        if (fire == -1) {
            clearInterval(id);
        } else {
            fire--;
            SpriteSheet.render(ctx, sprites.explosion.name, 150, 100, fire);
        }
    }
}

function drawExplosionHigh2Low() {
    var fire = 0;
    var id = setInterval(explosion, 30);

    function explosion() {
        if (fire > 12) {
            clearInterval(id);
        } else {
            fire++;
            SpriteSheet.render(ctx, sprites.explosion.name, 250, 100, fire);
        }
    }
}
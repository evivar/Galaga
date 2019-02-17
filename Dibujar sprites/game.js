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
        frames: 12
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

function showSprite() {
    var sprite = document.getElementById("sprites").value;
    return sprite;
}

function drawAllSprites() {
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(50, 100, 380, 400);
    ctx.fillStyle = "rgba(0,0,128,0.5)";
    ctx.fillRect(25, 50, 380, 400);
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 100, 100);
    }
    img.src = 'images/sprites.png';

}

function drawSelectedSprite(sprite) {
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(50, 100, 380, 400);
    ctx.fillStyle = "rgba(0,0,128,0.5)";
    ctx.fillRect(25, 50, 380, 400);
    if (sprite != "") {
        document.getElementById('info').innerHTML = sprite + ": " + "sx: " + sprites[sprite].sx + ", sy: " + sprites[sprite].sy + ", w: " +
            sprites[sprite].w + ", h: " + sprites[sprite].h + ", frames: " + sprites[sprite].frames;
    } else {
        document.getElementById('info').innerHTML = "No has seleccionado ningun sprite";
    }
    if (sprite != '') {
        SpriteSheet.load(sprites, function () {
            SpriteSheet.draw(ctx, sprite, 100, 100);
        });
    }
}
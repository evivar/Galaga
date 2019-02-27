// Variable

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
    missile: {
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
    },
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;


// Blueprints de los movimientos de los enemigos
/*
    Utilizamos esta funcion para el movimiento de los enemigos:
        vx = A + B * sin (C * t + D)
        vy = E + F * sin (G * t + H)

        A: Velocidad constante horizontal
        B: Velocidad sinusoidal horizontal
        C: Periodo horizontal
        D: Desfase de la velocidad sinusoidal horizontal
        E: Velocidad constante vertical
        F: Velocidad sinusoidal vertical
        G: Periodo vertical
        H: Desfase de la velocidad sinusoidal vertical
*/

var enemies = {
    straight: {
        x: 0,
        y: -50,
        sprite: 'enemy_ship',
        health: 10,
        E: 100
    },
    ltr: {
        x: 0,
        y: -100,
        sprite: 'enemy_purple',
        health: 10,
        B: 200,
        C: 1,
        E: 200
    },
    circle: {
        x: 400,
        y: -50,
        sprite: 'enemy_circle',
        health: 10,
        A: 0,
        B: -200,
        C: 1,
        E: 20,
        F: 200,
        G: 1,
        H: Math.PI / 2
    },
    wiggle: {
        x: 100,
        y: -50,
        sprite: 'enemy_bee',
        health: 20,
        B: 100,
        C: 4,
        E: 100
    },
    step: {
        x: 0,
        y: -50,
        sprite: 'enemy_circle',
        health: 10,
        B: 300,
        C: 1.5,
        E: 60
    }
};

/**
 * Clase Sprite -> Tambien para frogger
 */
var Sprite = function () {}

Sprite.prototype.setup = function (sprite, props) {
    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w = SpriteSheet.map[sprite].w;
    this.h = SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function (props) {
    if (props) {
        for (var prop in props) {
            this[prop] = props[prop];
        }
    }
}

Sprite.prototype.draw = function (ctx) {
    SpriteSheet.draw(ctx, this.sprite, this.x, this.y, this.frame);
}

Sprite.prototype.hit = function (damage) {
    this.board.remove(this);
}


/**
 * 
 */
var PlayerShip = function () {

    this.setup('ship', {
        vx: 0,
        frame: 0,
        reloadTime: 0.25,
        maxVel: 200
    });

    // Variables
    this.x = Game.width / 2 - this.w / 2;

    this.y = Game.height - 10 - this.h;

    this.vx = 0;

    this.reload = this.reloadTime;

}

PlayerShip.prototype = new Sprite();

PlayerShip.prototype.type = OBJECT_PLAYER;

/**
 * Implementa las formulas de los movimientos
 * @param  {} dt
 */
PlayerShip.prototype.step = function (dt) {
    // Movimiento de la nave
    if (Game.keys['left']) {
        this.vx = -this.maxVel;
    } else if (Game.keys['right']) {
        this.vx = this.maxVel;
    } else {
        this.vx = 0;
    }
    // Para no salirme del tablero
    this.x += this.vx * dt;
    if (this.x < 0) {
        this.x = 0;
    } else if (this.x > Game.width - this.w) {
        this.x = Game.width - this.w
    }
    // Disparos de la nave
    this.reload -= dt;
    if (Game.keys['fire'] && this.reload < 0) {
        Game.keys['fire'] = false;
        this.reload = this.reloadTime;
        this.board.add(new PlayerMissile(this.x, this.y + this.h / 2));
        this.board.add(new PlayerMissile(this.x + this.w, this.y + this.h / 2));
    }
}

PlayerShip.prototype.hit = function (damage) {
    if (this.board.remove(this)) {
        loseGame();
    }
}


/**
 * Enemigo
 * @param {} blueprint 
 * @param {} override 
 */
var Enemy = function (blueprint, override) {
    this.merge(this.baseParameters);
    this.setup(blueprint.sprite, blueprint);
    this.merge(override);
}

Enemy.prototype = new Sprite();

Enemy.prototype.baseParameters = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    t: 0,
    health: 20,
    damage: 20
};

Enemy.prototype.type = OBJECT_ENEMY; // ESTO ES IMPORTANTE

/**
 * Funcion step de los prototipos, implementa las funciones del movimiento de los enemigos
 * @param {} dt
 */
Enemy.prototype.step = function (dt) {
    this.t += dt;
    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y > Game.height ||
        this.x < -this.w ||
        this.x > Game.width) {
        this.board.remove(this);
    }
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    }
}

Enemy.prototype.hit = function (damage) {
    this.health -= damage;
    if (this.health <= 0) {
        if (this.board.remove(this)) {
            this.board.add(new Explosion(this.x + this.w / 2,
                this.y + this.h / 2));
        }
    }
}


/**
 * Misil del jugador
 * @param {} x 
 * @param {} y 
 */
var PlayerMissile = function (x, y) {
    this.setup('missile', {
        vy: -700,
        damage: 10
    });
    this.x = x - this.w / 2;
    this.y = y - this.h;
};


PlayerMissile.prototype = new Sprite();

PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

/**
 * Funcion step de los misilees del jugador, siguen una trayectoria recta hasta que se salen del tablero
 * @param {} dt
 */
PlayerMissile.prototype.step = function (dt) {
    this.y += this.vy * dt;
    var collision = this.board.collide(this, OBJECT_ENEMY);
    if (collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    } else if (this.y < -this.h) {
        this.board.remove(this);
    }
}

var StarField = function (speed, opacity, numStars, clear) {
    this.stars = document.createElement("canvas");
    this.stars.width = Game.width;
    this.stars.height = Game.height;
    this.starCtx = this.stars.getContext("2d");
    this.offset = 0;
    this.speed = speed;
    if (clear) {
        this.starCtx.fillStyle = "#000";
        this.starCtx.fillRect(0, 0, this.stars.width, this.stars.height);
    }

    // Now draw a bunch of random 2 pixel
    // rectangles onto the offscreen canvas
    this.starCtx.fillStyle = "#FFF";
    this.starCtx.globalAlpha = opacity;
    for (var i = 0; i < numStars; i++) {
        this.starCtx.fillRect(Math.floor(Math.random() * this.stars.width),
            Math.floor(Math.random() * this.stars.height),
            2,
            2);
    }
}

// This method is called every frame
// to draw the starfield onto the canvas
StarField.prototype.draw = function (ctx) {
    var intOffset = Math.floor(this.offset);
    var remaining = this.stars.height - intOffset;

    // Draw the top half of the starfield
    if (intOffset > 0) {
        ctx.drawImage(this.stars,
            0, remaining,
            this.stars.width, intOffset,
            0, 0,
            this.stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if (remaining > 0) {
        ctx.drawImage(this.stars,
            0, 0,
            this.stars.width, remaining,
            0, intOffset,
            this.stars.width, remaining);
    }
}

// This method is called to update
// the starfield
StarField.prototype.step = function (dt) {
    this.offset += dt * this.speed;
    this.offset = this.offset % this.stars.height;
}

var Explosion = function (centerX, centerY) {
    this.setup('explosion', {
        frame: 0
    });
    this.x = centerX - this.w / 2;
    this.y = centerY - this.h / 2;
    this.subFrame = 0;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function (dt) {
        this.frame = Math.floor(this.subFrame++/ 3);
            if (this.subFrame >= 36) {
                this.board.remove(this);
            }
        }
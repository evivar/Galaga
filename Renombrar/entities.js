// Variable

var sprites = {
    ship: {
        sx: 0,
        sy: 0,
        w: 37,
        h: 42,
        frames: 1
    },
    enemy_purple: { // Se mueve desde la esquina izquierda hacia la derecha y hacia abajo
        sx: 37,
        sy: 0,
        w: 42,
        h: 43,
        frames: 1
    },
    enemy_bee: { // Se mueve en grupo hacia abajo y en pequeñas eses
        sx: 79,
        sy: 0,
        w: 37,
        h: 43,
        frames: 1
    },
    enemy_ship: { // Se mueve hacia abajo 
        sx: 116,
        sy: 0,
        w: 42,
        h: 43,
        frames: 1
    },
    enemy_circle: { // Se mueve haciendo eses desde cualquier esquina superior y solo disparan un misil
        sx: 158,
        sy: 0,
        w: 32,
        h: 33,
        frames: 1
    },
    missile: { // Misil del jugador
        sx: 0,
        sy: 42,
        w: 7,
        h: 20,
        frames: 1
    },
    enemy_missile: { // Misil del enemigo
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


// Blueprints de los movimientos de los enemigos
/*
    Utilizamos esta funcion para el movimiento de los enemigos:
        vx = A + B * sin (C * t + D)
        vy = E + F * sin (G * t + H)
*/

var enemies = {
    basic: {
        x: 100,
        y: -50,
        sprite: 'enemy_purple',
        B: 100,
        C: 2,
        E: 100
    },
    bee: {
        x: 150,
        y: 0,
        sprite: 'enemy_bee',
        B: 80,
        C: 5,
        E: 50
    }
};




var PlayerShip = function () {

    // Variables

    this.w = SpriteSheet.map['ship'].w;

    this.h = SpriteSheet.map['ship'].h;

    this.x = Game.width / 2 - this.w / 2;

    this.y = Game.height - 10 - this.h;

    this.vx = 0;

    this.maxVel = 200;

    // No puede haber dos disparos seguidos si no pasan 0.25 segundos
    this.reloadTime = 0.25; // un cuarto de segundo

    this.reload = this.reloadTime;

    // Funciones

    // Implementa las formulas de los movimientos
    this.step = function (dt) {
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

    this.draw = function (ctx) {
        SpriteSheet.draw(ctx, 'ship', this.x, this.y, 0);
    }
}

var Enemy = function (blueprint, override) {
    var baseParameters = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
        H: 0
    }
    // Se inicializan todos los parámetros a 0
    for (var prop in baseParameters) {
        this[prop] = baseParameters[prop];
    }
    // Se copian los atributos del blueprint
    for (prop in blueprint) {
        this[prop] = blueprint[prop];
    }
    // Se copian los atributos redefinidos, si los hay
    if (override) {
        for (prop in override) {
            this[prop] = override[prop];
        }
    }
    this.w = SpriteSheet.map[this.sprite].w;
    this.h = SpriteSheet.map[this.sprite].h;
    this.t = 0;
}

Enemy.prototype.type = OBJECT_ENEMY; // ESTO ES IMPORTANTE

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
}

Enemy.prototype.draw = function (ctx) {
    SpriteSheet.draw(ctx, this.sprite, this.x, this.y);
}


var PlayerMissile = function (x, y) {

    // Variables

    this.w = SpriteSheet.map['missile'].w;

    this.h = SpriteSheet.map['missile'].h;

    // El misil aparece centrado en 'x'
    this.x = x - this.w / 2;

    // Con la parte inferior del misil en 'y'
    this.y = y - this.h;

    this.vy = -700;
};

PlayerMissile.prototype.step = function (dt) {
    this.y += this.vy * dt;
    if (this.y < -this.h) {
        this.board.remove(this);
    }
};

PlayerMissile.prototype.draw = function (ctx) {
    SpriteSheet.draw(ctx, 'missile', this.x, this.y);
};

var PlayerMissile = function (x, y) {
    this.setup('missile', {
        vy: -700,
        damage: 10
    });
    this.x = x - this.w / 2;
    this.y = y - this.h;
};


PlayerMissile.prototype.step = function (dt) {
    this.y += this.vy * dt;
    var collision = this.board.collide(this, OBJECT_ENEMY);
    if (collision) {
        collision.hit(this.damage);
        this.board.remove(this);
    } else if (this.y < -this.h) {
        this.board.remove(this);
    }
};

var StarField = function (speed, opacity, numStars, clear) {
    var stars = document.createElement("canvas");
    stars.width = Game.width;
    stars.height = Game.height;
    var starCtx = stars.getContext("2d");
    var offset = 0;
    if(clear) {
        starCtx.fillStyle = "#000";
        starCtx.fillRect(0,0,stars.width,stars.height);
      }
    
      // Now draw a bunch of random 2 pixel
      // rectangles onto the offscreen canvas
      starCtx.fillStyle = "#FFF";
      starCtx.globalAlpha = opacity;
      for(var i=0;i<numStars;i++) {
        starCtx.fillRect(Math.floor(Math.random()*stars.width),
                         Math.floor(Math.random()*stars.height),
                         2,
                         2);
      }
    
      // This method is called every frame
      // to draw the starfield onto the canvas
      this.draw = function(ctx) {
        var intOffset = Math.floor(offset);
        var remaining = stars.height - intOffset;
    
        // Draw the top half of the starfield
        if(intOffset > 0) {
          ctx.drawImage(stars,
                    0, remaining,
                    stars.width, intOffset,
                    0, 0,
                    stars.width, intOffset);
        }
    
        // Draw the bottom half of the starfield
        if(remaining > 0) {
          ctx.drawImage(stars,
                  0, 0,
                  stars.width, remaining,
                  0, intOffset,
                  stars.width, remaining);
        }
      };
    
      // This method is called to update
      // the starfield
      this.step = function(dt) {
        offset += dt * speed;
        offset = offset % stars.height;
      };
}
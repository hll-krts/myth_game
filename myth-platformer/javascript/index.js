
//create drawing variables
var canvas;
var ctx;
var img = document.getElementById("back");

//input variables
var upKey;
var downKey;
var rightKey;
var leftKey;

//sounds
var holobass_bg;
var ame_hic;
var gura_a;

//create game variables
var gameLoop;
var player;
var enemy;
var borders;
var border_left;
var border_right;
var score_holder_x;
var score_holder_y;
var bullet;
var pause = true;
var score = 0;
var music_start_stop;

var player_y;
var player_x;
var player_x_w;
var border_y;

function Enemy() {
    this.x = 1215;
    this.y = 320;
    this.maxSpeed = 30;
    this.width = 60;
    this.height = 70;
    var gura_left = document.getElementById("gura_left");

    this.spawn = function () {
        ctx.drawImage(gura_left, this.x, this.y, this.width, this.height);
    }

}

var bullet_speedArr = [5,15,25,35,40];
var bulletSpeed = bullet_speedArr[Math.floor(Math.random() * bullet_speedArr.length)];

function guraShoot(x, y, width, height) {
    var bulletImg = document.getElementById("bullet");
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 15;

    this.spawn = function () {
        ctx.drawImage(bulletImg, this.x, this.y, this.width, this.height);
        this.x -= bulletSpeed;
        
        if (player_x <= this.x && player_x_w >= this.x) {
            //console.log("AAAAAA");
            if (player_y > this.y) {
                console.log("MORE AAAAAAAAAAAAAAA");
                alert("GURA KILLED YOU! Score: " + score);
                retry();
            }
        }

        //console.log(this.x);
        if (this.x <= 0) {
            this.x = x;
            gura_a.play();
            score++;
            bulletSpeed = bullet_speedArr[Math.floor(Math.random() * bullet_speedArr.length)];
        }
    }
}

function holobass(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
}

function amehic(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
}

function guraA(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
}


function Player(x, y) {
    this.x = x;
    this.y = y;
    this.xspeed = 0;
    this.yspeed = 0;
    this.friction = 0.6;
    this.maxSpeed = 10;
    this.width = 70;
    this.height = 100;
    this.active = true;
    var ame_stand = document.getElementById("ame_stand_r");
    var ame_stand_right = document.getElementById("ame_stand_r");
    var ame_stand_left = document.getElementById("ame_stand_l");

    this.step = function () {
        //movement
        if (this.active) {
            //horizontal
            if (!leftKey && !rightKey || leftKey && rightKey) {
                //slow down
                this.xspeed *= this.friction;
            }
            else if (rightKey) {
                //move right
                this.xspeed++;
            }
            else if (leftKey) {
                //move left
                this.xspeed--;
            }
            //vertical
            if (upKey) {
                
                this.yspeed -= 10;
                if (this.y < 200) {
                    upKey = false;
                }

            }

            //gravity
            this.yspeed += 5;


            //correct speed
            if (this.xspeed > this.maxSpeed) {
                this.xspeed = this.maxSpeed;
            }
            else if (this.xspeed < -this.maxSpeed) {
                this.xspeed = -this.maxSpeed;
            }
            if (this.yspeed > this.maxSpeed) {
                this.yspeed = this.maxSpeed;
            }
            else if (this.yspeed < -this.maxSpeed) {
                this.yspeed = -this.maxSpeed;
            }

            if (this.xspeed > 0) {
                this.xspeed = Math.floor(this.xspeed);
            }
            else {
                this.xspeed = Math.ceil(this.xspeed);
            }
            if (this.yspeed > 0) {
                this.yspeed = Math.floor(this.yspeed);
            }
            else {
                this.yspeed = Math.ceil(this.yspeed);
            }

            //horizontal collision
            let horizontalRect = {
                x: this.x + this.xspeed,
                y: this.y,
                width: this.width,
                height: this.height,
            }

            //vertical collision
            let verticalRect = {
                x: this.x,
                y: this.y + this.yspeed,
                width: this.width,
                height: this.height,
            }

            //border collision
            let borderRect = {
                x: borders.x,
                y: borders.y,
                width: borders.width,
                height: borders.height,
            }
            let border_left_rect = {
                x: border_left.x,
                y: border_left.y,
                width: border_left.width,
                height: border_left.height,
            }
            let border_right_rect = {
                x: border_right.x,
                y: border_right.y,
                width: border_right.width,
                height: border_right.height,
            }


            //x
            if (collisionControl(horizontalRect, border_left_rect)) {
                this.xspeed = 0;
            }
            if (collisionControl(horizontalRect, border_right_rect)) {
                this.xspeed = 0;
            }
            //y
            if (collisionControl(verticalRect, borderRect)) {
                this.yspeed = 0;
            }

            this.x += this.xspeed;
            this.y += this.yspeed;

        }
    }

    this.drawTurnR = function () {
        ame_stand = ame_stand_right;
    }
    this.drawTurnL = function () {
        ame_stand = ame_stand_left;
    }

    this.draw = function () {
        ctx.drawImage(ame_stand, this.x, this.y, this.width, this.height);
        //console.log(this.x);
        player_y = this.y + this.height;
        //console.log("PLAYER-Y: " + player_y);
        player_x = this.x;
        player_x_w = this.x + this.width - 40;
    }
}

function Border(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function () {
        ctx.fillStyle = "transparent";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    border_y = this.y - 1;
}

function BorderLeft(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function BorderRight(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

//runs once page loaded
let gameplay = () => {
    
    gura_a = new guraA("sounds/gura_a.mp3");
    
    holobass_bg = new holobass("sounds/pop_on_rocks.mp3");

    ame_hic = new amehic("sounds/ame_hic.mp3");
    
    holobass_bg.play();

    //gameloop
    gameLoop = setInterval(step, 1000 / 30);

}

function step() {


    if (pause) {
        //player step
        player.step();

        //draw everything
        draw();
    }


}

function draw() {
    //clear the canvas
    ctx.drawImage(back, 0, 0);

    //draw player
    player.draw();

    //draw gura
    gura.spawn();

    //draw ollie
    ollie_board.draw();

    //draw bullet
    bulletshoot.spawn();

    score_writer();

    //draw border
    borders.draw();
    border_left.draw();
    border_right.draw();
}

function setupInputs() {
    document.addEventListener("keydown", function (event) {

        if (player_y == 390) {

            if (event.key == "w" || event.key == "ArrowUp") {
                upKey = true;
                ame_hic.play();
            }
        }
        if (event.key == "s" || event.key == "ArrowDown") {
            downKey = true;
        }
        else if (event.key === "a" || event.key === "ArrowLeft") {
            leftKey = true;
            player.drawTurnL();
        }
        else if (event.key === "d" || event.key === "ArrowRight") {
            rightKey = true;
            player.drawTurnR();
        }
    });
    document.addEventListener("keyup", function (event) {
        if (event.key === "w" || event.key === "ArrowUp") {
            upKey = false;
        }
        else if (event.key === "s" || event.key === "ArrowDown") {
            downKey = false;
        }
        else if (event.key === "a" || event.key === "ArrowLeft") {
            leftKey = false;
        }
        else if (event.key === "d" || event.key === "ArrowRight") {
            rightKey = false;
        }
    });
}

function collisionControl(r1, r2) {
    if (r1.x >= r2.x + r2.width) {
        return false;
    }
    else if (r1.x + r1.width <= r2.x) {
        return false;
    }
    else if (r1.y >= r2.y + r2.height) {
        return false;
    }
    else if (r1.y + r1.height <= r2.y) {
        return false;
    }
    else {
        return true;
    }
}



function score_holder() {
    this.x = 930,
        this.y = 250,
        this.width = 100,
        this.height = 100,
        scoreboard = document.getElementById("ollie_scoreboeard"),

        score_holder_x = this.x;
    score_holder_y = this.y;


    this.draw = function () {
        ctx.drawImage(scoreboard, this.x, this.y, this.width, this.height);
    }
}

/* arrow function */
let start_game = () => {
    if(pause){
        gameplay();
    }
    else{
        pause = true;
    }
}

let pause_game = () => {
    pause = false;
    // this line has cancelled bc i couldn't start it again, holobass_bg.stop();
}

let retry = () => {
    score = 0;
    drawer();
    draw();
    //start_game();
}

window.onload = function () {
    drawer();
    draw();
}

function drawer() {

    //assign canvas and context variables
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    //key listeners
    setupInputs();

    //player
    player = new Player(240, 240);

    //gura
    gura = new Enemy();

    //scoreboard
    ollie_board = new score_holder();

    //bullet
    bulletshoot = new guraShoot(1210, 350, 20, 15);

    //border
    borders = new Border(0, 390, 1280, 180);
    border_left = new BorderLeft(0, 0, 0, 480);
    border_right = new BorderRight(1200, 0, 0, 480);
}

function score_writer() {
    ctx.font = "30px Arial";
    ctx.fillText(score, score_holder_x + 40, score_holder_y + 30);
}
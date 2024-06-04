import {GameObject} from "/static/js/game_object/base.js";

class Player extends GameObject {
    constructor(root, info) {
        super();

        this.root = root;
        // console.log(root)
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400; // 水平速度
        this.speedy = -1500; // 跳跃的初始速度

        this.gravity = 50;

        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.status = 3; // 0: idle, 1: 向前, 2: 向后, 3: 跳跃, 4: 攻击, 5: 被打, 6: 死亡

        this.animations = new Map();
        this.frame_current_cnt = 0; // 当前记录了多少帧

        // console.log(this.status);
    }

    start() {

    }
    
    update_move() {
        if (this.status === 3) {
            this.vy += this.gravity;
        }
        
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            this.status = 0;
        } 

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }

        // console.log(this.status);
    }

    update_control() { //两名玩家的按键设置
        let w, a, d, space;
        if (this.id == 0) { //如果是1P
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        // console.log(this.pressed_keys);

        if (this.status === 0 || this.status === 1) { // 静止或者向前走
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) { // 竖直跳或向前跳或向后跳
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0; 
            }
        } 

        // console.log(this.status);
    }

    update_direction() {
        let player = this.root.players;
    }

    update() {
        this.update_control();
        this.update_move();

        this.render();
    }

    render() {
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);

        let status = this.status;

        if (this.status == 1 && this.direction * this.vx < 0) {
            status = 2;
        }  

        let obj = this.animations.get(status);
        // console.log(obj.gif);
        if (obj && obj.loaded) {
            let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
            let image = obj.gif.frames[k].image;
            // console.log(obj.gif);
            this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
        } 

        if (status === 4) {
            if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
                this.status = 0;
                // this.frame_current_cnt = 0;
            }
        }

        this.frame_current_cnt ++;
    }
}

export {
    Player
}
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

        this.hp = 100;

        // console.log(this.status);
    }

    start() {

    }
    
    update_move() {
        this.vy += this.gravity;
        
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        // 判断两名玩家不重叠
        // let [a, b] = this.root.players;
        // if (a !== this) [a, b] = [b, a];
        // let r1 = {
        //     x1: a.x,
        //     y2: a.y,
        //     x2: a.x + a.width,
        //     y2: a.y + a.height
        // };
        // let r2 = {
        //     x1: b.x,
        //     y2: b.y,
        //     x2: b.x + b.width,
        //     y2: b.y + b.height
        // };
        // if(this.is_collision(r1, r2)) {
        //     b.x += this.vx * this.timedelta / 1000 / 2;
        //     b.y += this.vy * this.timedelta / 1000 / 2;
        //     a.x -= this.vx * this.timedelta / 1000 / 2;
        //     a.y -= this.vy * this.timedelta / 1000 / 2;

        //     if (this.status === 3) {
        //         this.status = 0;
        //     }
        // }

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;

            if (this.status === 3) this.status = 0;
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
        if (this.status === 6) {
            return ;
        }

        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) { // 正常方向为：1p在左 2p在右
                me.direction = 1;
            } else {
                me.direction = -1;
            }
        }
    }

    is_attack() {
        if (this.status === 6) {
            return ;
        }

        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - 10, 0);
        if (this.hp <= 0 ) {
            this.status = 6;
            this.frame_current_cnt = 0;
        }
    }

    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 18) {
            let players = this.root.players;
            let me = this, you = players[1 - this.id];
            let r1;
            if(this.direction > 0) {
                r1 = { // (x1, y1) 表示挥重拳的角色的黄色方框左上角坐标, (x2, y2) 表示挥重拳的角色的黄色方框右下角坐标
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120 - 100 + 100,
                    y2: me.y + 40 + 20
                };    
            }

            let r2 = { // 重拳打的角色(不一定被打中)
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height
            }; 

            if (this.is_collision(r1, r2)) {
                you.is_attack();
            }
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();

        this.render();
    }

    render() {
        // this.ctx.fillStyle = this.color; 
        // this.ctx.fillRect(this.x, this.y, this.width, this.height); // 显示两边人物的渲染方块
        
        // if (this.direction > 0) {
        //     this.ctx.fillStyle = 'yellow';
        //     this.ctx.fillRect(this.x + 120, this.y + 40, 100, 20); // 显示两边人物重拳的渲染小方块
        // } else {
        //     this.ctx.fillStyle = 'yellow';
        //     this.ctx.fillRect(this.x + this.width - 120 - 100, this.y + 40, 100, 20); // 显示两边人物重拳的渲染小方块
        // }
        

        let status = this.status;

        if (this.status == 1 && this.direction * this.vx < 0) {
            status = 2;
        }  

        let obj = this.animations.get(status);
        // console.log(obj.gif);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                // console.log(obj.gif);
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                // console.log(obj.gif);
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();
            }
            
        } 

        if (status === 4 || status === 5 || status === 6) {
            if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
                if (status === 6) {
                    this.frame_current_cnt --;
                } else {
                    this.status = 0;
                }
                // this.frame_current_cnt = 0;
            }
        }

        this.frame_current_cnt ++;
    }
}

export {
    Player
}
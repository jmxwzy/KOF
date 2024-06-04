import {GameObject} from "/static/js/game_object/base.js";
import { Controller } from "/static/js/controller/base.js";

class GameMap extends GameObject {
    constructor(root) {
        super();

        this.root = root;

        this.$canvas = $('<canvas id="tutorial" width="1280" height="720" tabindex=0></canvas>'); // tabindex=0表示元素是可聚焦的，并且可以通过tab键盘导航来聚焦到该元素
        this.ctx = this.$canvas[0].getContext('2d');
        
        this.root.$kof.append(this.$canvas); //在KOF类(即kof的div，游戏的地图区域)后面加上画布
        this.$canvas.focus();

        this.controller = new Controller(this.$canvas);
    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.ctx.fillStyle = 'black';
        // this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());
    }
}

export {
    GameMap
}
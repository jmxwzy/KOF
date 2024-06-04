import {GameMap} from "/static/js/game_map/base.js";
import { Player } from "/static/js/player/base.js";
import {Kyo} from "/static/js/player/kyo.js";

class KOF {
    constructor(id) {
        // this.$kof = $('#kof');
        this.$kof = $('#' + id); // 与上面注释同理，获取前端id为kof的div
        // console.log(this.$kof);
        this.game_map = new GameMap(this); // 加载地图
        this.players = [ // 加载人物
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: 'blue'
            }),
            new Kyo(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 120,
                height: 200,
                color: 'red'
            })
        ];
        // console.log(this.players);
    } 
}

export {
    KOF
}
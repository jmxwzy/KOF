let GAME_OBJECTS = [];

class GameObject { // 渲染类
    constructor() {
        GAME_OBJECTS.push(this);
        this.timedelta = 0; // 当前这一帧距离上一帧的时间间隔
        this.has_call_started = false;
    }

    start() { // 初始执行一次

    }

    update() { // 每一帧执行一次(除了第一帧以外)

    }

    destroy() {
        for (let i in GAME_OBJECTS) {
            if (GAME_OBJECTS[i] == this) {
                GAME_OBJECTS[i].splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let GAME_OBJECTS_FRAME = (timestamp) => {
    for (let obj of GAME_OBJECTS) {
        if(!obj.has_call_start) {
            obj.start();
            obj.has_call_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(GAME_OBJECTS_FRAME);
}

requestAnimationFrame(GAME_OBJECTS_FRAME);

export {
    GameObject
}
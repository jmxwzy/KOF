class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;

        this.pressed_keys = new Set();
        this.start();
    }

    start() {
        let outer = this;
        // console.log(this); // 这里的this指的是Controller类

        this.$canvas.keydown(function(e) { //这个this也指得Controller,它有$canvas和pressed_keys两个属性，这里调用了$canvas来进行键盘事件
            // console.log(this); // 这里的this指的是this(外面的).$canvas(也就是Controller.$canvas)
            outer.pressed_keys.add(e.key); // 存储键盘按的键
            // console.log(e.key);
        });

        this.$canvas.keyup(function (e) {
            outer.pressed_keys.delete(e.key);
        });
    }
}

export {
    Controller
}
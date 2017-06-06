/**
 * 姓名：协调者
 * 作用：控制通行
 * 初始化时： 运行几次后触发， 触发的回调， 是否只触发一次（默认否）
 * 用法：每运行一次调用一次`.done()`方法
 */
class Coordinator {
    constructor(times, callback, once = false) {
        this.now = 0;
        this.max = times;
        this.once = once;
        this.canPass = true;
        this.finalDone = callback;
    }
    done() {
        this.now += 1;
        console.log(`(${this.now}, ${this.max})`)
        if (this.now >= this.max && this.canPass) {
            this.canPass = this.once ? false : true;
            this.finalDone(this.max, this.now);
        }
    }
}

// 使用例子：
let coo = new Coordinator(4, function (all, now) {
    console.log(`总共要运行${all}次，您已运行${now}次，结束。`);
});
coo.done();
coo.done();
coo.done();
coo.done();
coo.done();
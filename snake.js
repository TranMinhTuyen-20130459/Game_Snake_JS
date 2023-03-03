const WIDTH_GAME = 600;
const HEIGHT_GAME = 520;
const canvas = document.getElementById('canvas-game');
canvas.width = WIDTH_GAME , canvas.height = HEIGHT_GAME;

const COLOR_BACKGROUND = 'black';
const context = canvas.getContext('2d');
context.fillStyle = COLOR_BACKGROUND
context.fillRect(0, 0, WIDTH_GAME, HEIGHT_GAME);

const UNIT = 30;

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Snake {
    constructor() {

        this.COLOR_HEAD_SNAKE = 'blue';
        this.COLOR_BODY_SNAKE = 'white';

        this.bodySnake = [
            new Vector2D(UNIT * 5, UNIT * 4),
            new Vector2D(UNIT * 6, UNIT * 4),
            new Vector2D(UNIT * 7, UNIT * 4)
        ]
    }

    drawSnake() {

        // Head
        context.fillStyle = this.COLOR_HEAD_SNAKE // đặt màu cho hình
        context.beginPath()  // bắt đầu vẽ
        context.arc(this.bodySnake[0].x + 30, this.bodySnake[0].y + 15, 15, 0, 2 * Math.PI); // vẽ hình tròn
        context.fill() // tô màu

        // Body
        context.fillStyle = this.COLOR_BODY_SNAKE
        for (let i = 1; i < this.bodySnake.length; i++) {
            context.fillRect(this.bodySnake[i].x, this.bodySnake[i].y, UNIT, UNIT)
        }

    }

    clearSnake() {

        context.fillStyle = COLOR_BACKGROUND
        // clear Head
        context.fillRect(this.bodySnake[0].x, this.bodySnake[0].y, UNIT, UNIT)

        // clear Body
        for (let i = 1; i < this.bodySnake.length; i++) {
            context.fillRect(this.bodySnake[i].x, this.bodySnake[i].y, UNIT, UNIT)
        }

    }

}

class Food {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    randomFood() {

        /*
         hàm Math.floor() sẽ làm tròn số -> trả về số nguyên gần nhất nhỏ hơn số truyền vào
         hàm Math.random() sẽ random ra các con số từ 0 - 1
         */
        this.x = Math.floor(Math.random() * (WIDTH_GAME - UNIT))
        this.y = Math.floor(Math.random() * (HEIGHT_GAME - UNIT))

        // bug -> có trường hợp Food sẽ nằm trùng với vị trí của Snake

    }

    drawFood() {
        context.fillStyle = 'red'
        this.randomFood()
        context.fillRect(this.x, this.y, UNIT, UNIT)
    }

    clearFood() {
        context.fillStyle = COLOR_BACKGROUND
        context.fillRect(this.x, this.y, UNIT, UNIT)
    }

}

class GameSnake {

    constructor() {
        let snake = new Snake();
        let food = new Food(0, 0);
        snake.drawSnake()
        food.drawFood()
    }

}

let game = new GameSnake()








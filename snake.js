const BLOCK_SIZE = 25;
const cols = 24;
const rows = 20;
const WIDTH_GAME = BLOCK_SIZE * cols;
const HEIGHT_GAME = BLOCK_SIZE * rows;
const canvas = document.getElementById('canvas-game');
canvas.width = WIDTH_GAME , canvas.height = HEIGHT_GAME;

const COLOR_BACKGROUND = 'black';
const context = canvas.getContext('2d');
context.fillStyle = COLOR_BACKGROUND
context.fillRect(0, 0, WIDTH_GAME, HEIGHT_GAME);

const LEFT = 37;
const RIGHT = 39;
const UP = 38;
const DOWN = 40;
let snake;
let food;
let currentDirectionSnake; // hướng hiện tại của con rắn hệ trục tọa độ x,y
let score = 0;

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Snake {
    constructor() {

        this.COLOR_HEAD_SNAKE = 'green';
        this.COLOR_BODY_SNAKE = 'white';

        this.bodySnake = [
            new Vector2D(BLOCK_SIZE * 5, BLOCK_SIZE * 4),
            new Vector2D(BLOCK_SIZE * 6, BLOCK_SIZE * 4),
            new Vector2D(BLOCK_SIZE * 7, BLOCK_SIZE * 4)
        ];

        currentDirectionSnake = new Vector2D(-1, 0);
    }

    drawSnake() {

        // Head
        context.fillStyle = this.COLOR_HEAD_SNAKE // đặt màu cho hình
        context.fillRect(this.bodySnake[0].x, this.bodySnake[0].y, BLOCK_SIZE, BLOCK_SIZE)

        // context.beginPath()  // bắt đầu vẽ
        // context.arc(this.bodySnake[0].x + 30, this.bodySnake[0].y + 15, 15, 0, 2 * Math.PI); // vẽ hình tròn
        // context.fill() // tô màu

        // Body
        context.fillStyle = this.COLOR_BODY_SNAKE
        for (let i = 1; i < this.bodySnake.length; i++) {
            context.fillRect(this.bodySnake[i].x, this.bodySnake[i].y, BLOCK_SIZE, BLOCK_SIZE)
        }

    }

    clearSnake() {

        context.fillStyle = COLOR_BACKGROUND
        // clear Head
        context.fillRect(this.bodySnake[0].x, this.bodySnake[0].y, BLOCK_SIZE, BLOCK_SIZE)

        // clear Body
        for (let i = 1; i < this.bodySnake.length; i++) {
            context.fillRect(this.bodySnake[i].x, this.bodySnake[i].y, BLOCK_SIZE, BLOCK_SIZE)
        }

    }

    moveSnake() {

        /*
         khi con rắn di chuyển thực chất là ta sẽ xóa đi con rắn ở vị trí cũ,vẽ lại con rắn ở vị trí mới
         */

        this.clearSnake();

        for (let i = this.bodySnake.length - 1; i > 0; i--) {
            this.bodySnake[i].x = this.bodySnake[i - 1].x;
            this.bodySnake[i].y = this.bodySnake[i - 1].y;
        }

        this.bodySnake[0].x += currentDirectionSnake.x * BLOCK_SIZE;
        this.bodySnake[0].y += currentDirectionSnake.y * BLOCK_SIZE;

        this.drawSnake();

    }

    checkEatFood(food) {
        let headSnake = this.bodySnake[0];
        return food.x === headSnake.x && food.y === headSnake.y;
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
        this.x = Math.floor(Math.random() * cols) * BLOCK_SIZE;
        this.y = Math.floor(Math.random() * rows) * BLOCK_SIZE;

        // bug -> có trường hợp Food sẽ nằm trùng với vị trí của Snake

    }

    drawFood() {
        context.fillStyle = 'red'
        this.randomFood()
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE)
    }

    clearFood() {
        context.fillStyle = COLOR_BACKGROUND
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE)
    }

}

class GameSnake {

    constructor() {
        snake = new Snake();
        food = new Food(0, 0);
        snake.drawSnake()
        food.drawFood()
    }

}

let game = new GameSnake()

document.onkeydown = function (e) {

    switch (e.keyCode) {
        case LEFT:
            if (currentDirectionSnake.x === 1) break; // -> không cho phép con rắn được được đổi hướng sang bên phải
            currentDirectionSnake = new Vector2D(-1, 0);
            break;
        case RIGHT:
            if (currentDirectionSnake.x === -1) break;  // -> không cho phép con rắn được được đổi hướng sang bên trái
            currentDirectionSnake = new Vector2D(1, 0)
            break;
        case UP:
            if (currentDirectionSnake.y === 1) break;  // -> không cho phép con rắn được được đổi hướng xuống dưới
            currentDirectionSnake = new Vector2D(0, -1)
            break;
        case DOWN:
            if (currentDirectionSnake.y === -1) break;  // -> không cho phép con rắn được được đổi hướng lên trên
            currentDirectionSnake = new Vector2D(0, 1)
            break;
        default:
            break;
    }
    //  console.log(e.keyCode)
} // -> xử lí sự kiện khi con rắn di chuyển
setInterval(() => {
    snake.moveSnake();
    if (snake.checkEatFood(food)) {
        score++;
        food.drawFood();
        let scoreElements = document.getElementsByClassName('score');
        for (let element of scoreElements) {
            element.innerHTML = score;
        }
    }
}, 200)   // -> hàm này giúp lặp lại một khối code sau khoảng thời gian chỉ định







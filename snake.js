const BLOCK_SIZE = 25;
const cols = 24;
const rows = 20;
const WIDTH_GAME = BLOCK_SIZE * cols;
const HEIGHT_GAME = BLOCK_SIZE * rows;
const canvas = document.getElementById('canvas-game');
canvas.width = WIDTH_GAME , canvas.height = HEIGHT_GAME;

const COLOR_BACKGROUND = 'black';
const COLOR_FOOD = 'yellow';

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
let gameLevel;
let intervalLevel;
let gameOverLevel = false;
let TIME_OUT_LEVEL_2 = 200;

let isRunLevel1 = false; // biến kiểm soát Game có đang chạy ở Level 1 hay không ?
let isRunLevel2 = false; // biến kiểm soát Game có đang chạy ở Level 2 hay không ?
let isRunLevel3 = false; // biến kiểm soát Game có đang chạy ở Level 3 hay không ?
let isRunLevel4 = false; // biến kiểm soát Game có đang chạy ở Level 4 hay không ?
let isRunLevel5 = false; // biến kiểm soát Game có đang chạy ở Level 5 hay không ?
let isRunLevel6 = false; // biến kiểm soát Game có đang chạy ở Level 6 hay không ?

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Snake {
    constructor(x1, x2, x3, y) {

        this.COLOR_HEAD_SNAKE = 'green';
        this.COLOR_BODY_SNAKE = 'white';

        this.bodySnake = [
            new Vector2D(BLOCK_SIZE * x1, BLOCK_SIZE * y),
            new Vector2D(BLOCK_SIZE * x2, BLOCK_SIZE * y),
            new Vector2D(BLOCK_SIZE * x3, BLOCK_SIZE * y)
        ];

        currentDirectionSnake = new Vector2D(-1, 0);
    }

    drawSnake() {

        // Head
        context.fillStyle = this.COLOR_HEAD_SNAKE // đặt màu cho hình
        context.fillRect(this.bodySnake[0].x, this.bodySnake[0].y, BLOCK_SIZE, BLOCK_SIZE)

        /*
         context.beginPath()  // bắt đầu vẽ
         context.arc(this.bodySnake[0].x + 30, this.bodySnake[0].y + 15, 15, 0, 2 * Math.PI); // vẽ hình tròn
         context.fill() // tô màu
        */

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

    moveSnake1() {

        /*
         khi con rắn di chuyển thực chất là ta sẽ xóa đi con rắn ở vị trí cũ,vẽ lại con rắn ở vị trí mới
         */

        this.clearSnake();

        for (let i = this.bodySnake.length - 1; i > 0; i--) {
            this.bodySnake[i].x = this.bodySnake[i - 1].x;
            this.bodySnake[i].y = this.bodySnake[i - 1].y;
        } // -> tọa độ từng phần của con rắn sẽ bằng tọa độ của phần trước đó

        this.bodySnake[0].x += currentDirectionSnake.x * BLOCK_SIZE;
        this.bodySnake[0].y += currentDirectionSnake.y * BLOCK_SIZE;

        this.drawSnake();
        this.evenWhenTouchBody(); // sự kiện khi con rắn chạm vào thân của nó
        this.eventWhenTouchEdge1(); // sự kiện khi con rắn chạm vào các cạnh của màn hình chơi game

    } // -> con rắn tự động di chuyển ở Level 1

    moveSnake2() {

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
        this.evenWhenTouchBody();
        this.eventWhenTouchEdge2();

        if (this.checkTouchWall2()) {
            gameOver();
        }

    } // -> con rắn tự động di chuyển ở Level 2

    eventWhenTouchEdge1() {

        let headSnake = this.bodySnake[0];
        if (headSnake.x < 0) {
            headSnake.x = WIDTH_GAME - BLOCK_SIZE;
        }
        if (headSnake.x > WIDTH_GAME) {
            headSnake.x = 0;
        }
        if (headSnake.y < 0) {
            headSnake.y = HEIGHT_GAME - BLOCK_SIZE;
        }
        if (headSnake.y > HEIGHT_GAME) {
            headSnake.y = 0;
        }
    } // -> đây là hàm xử lí giúp cho con rắn có thể đi được xuyên tường ở Level1

    eventWhenTouchEdge2() {

        let headSnake = this.bodySnake[0];
        if (headSnake.x < 0) {
            headSnake.x = WIDTH_GAME - BLOCK_SIZE;
        }
        if (headSnake.x > WIDTH_GAME) {
            headSnake.x = 0;
        }

    } // -> đây là hàm xử lí giúp cho con rắn có thể đi được xuyên tường ở Level2
    checkTouchWall2() {

        let headSnake = this.bodySnake[0];
        if (headSnake.y === 0 || headSnake.y === HEIGHT_GAME - BLOCK_SIZE)
            return true;
        return false;

    } // -> kiểm tra con rắn có đụng tường hay không ?

    checkEatFood(food) {
        let headSnake = this.bodySnake[0];
        return food.x === headSnake.x && food.y === headSnake.y;
    } // -> kiểm tra rắn đã ăn mồi thành công hay chưa ?

    evenWhenTouchBody() {

        let headSnake = this.bodySnake[0];

        for (let i = 1; i < this.bodySnake.length; i++) {

            let body = this.bodySnake[i];
            if ((headSnake.x === body.x) && (headSnake.y === body.y)) {
                gameOverLevel = true;
                break;
            }

        }

        if (gameOverLevel === true) {
            gameOver();
        }

    }  // -> đây là hàm xử lí khi con rắn chạm vào thân của mình

    growUp() {
        this.clearSnake();
        let partBodyLast = this.bodySnake[this.bodySnake.length - 1]; // phần cuối cùng của con rắn trước khi tăng trưởng
        let partBodyBeforeLast = this.bodySnake[this.bodySnake.length - 2]; // phần gần cuối cùng của con rắn trước khi tăng trưởng

        // tìm tọa độ (X,Y) cho phần thân mới của con rắn
        let newPartBodyX = partBodyLast.x + (partBodyLast.x - partBodyBeforeLast.x);
        let newPartBodyY = partBodyLast.y + (partBodyLast.y - partBodyBeforeLast.y);

        let newPartBody = new Vector2D(newPartBodyX, newPartBodyY);

        this.bodySnake.push(newPartBody);
        this.drawSnake();
    }  // -> tăng độ dài cho con rắn

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

    randomFoodLevel2() {

        this.randomFood();
        let temp = this.y;
        if (temp === 0 || temp === HEIGHT_GAME - BLOCK_SIZE) {
            this.randomFood();
        }

        // bug -> có trường hợp Food sẽ nằm trùng với vị trí của Snake

    }

    drawFoodLevel1() {
        context.fillStyle = COLOR_FOOD;
        this.randomFood()
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE)
    }

    drawFoodLevel2() {
        context.fillStyle = COLOR_FOOD;
        this.randomFoodLevel2()
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE)
    }

    clearFood() {
        context.fillStyle = COLOR_BACKGROUND
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE)
    }

}

class GameSnakeLevel1 {

    constructor() {
        snake = new Snake(7, 8, 9, 5);
        food = new Food(0, 0);
        snake.drawSnake();
        food.drawFoodLevel1();
    }

}

class GameSnakeLevel2 {

    constructor() {
        snake = new Snake(10, 11, 12, 10);
        food = new Food(0, 0);
        snake.drawSnake()
        food.drawFoodLevel2()
    }

    drawWall() {

        for (let x = 0; x < WIDTH_GAME; x += BLOCK_SIZE) {

            context.fillStyle = 'red';
            context.fillRect(x, 0, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(x, HEIGHT_GAME - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

        }


    }


}

function runLevel1() {

    if (isRunLevel1 === false) { //-> nếu function này chưa được thực thi

        playDiv.style.display = "none"; // -> ẩn đi phần tử

        intervalLevel = setInterval(function () {
            snake.moveSnake1();
            if (snake.checkEatFood(food)) {
                score++;
                food.drawFoodLevel1();
                snake.growUp();
                let scoreElements = document.getElementsByClassName('score');
                for (let element of scoreElements) {
                    element.innerHTML = score;
                }
            }
        }, 200) // -> hàm này giúp lặp lại một khối code sau khoảng thời gian chỉ định;

        keyBoardGame();

        isRunLevel1 = true; // -> đánh dấu function này đã được thực thi

    }

}

function runLevel2() {

    if (isRunLevel2 === false) {

        playDiv.style.display = "none"; // -> ẩn đi phần tử

        intervalLevel = setInterval(function () {
            snake.moveSnake2();
            if (snake.checkEatFood(food)) {
                score++;
                food.drawFoodLevel2();
                snake.growUp();
                let scoreElements = document.getElementsByClassName('score');
                for (let element of scoreElements) {
                    element.innerHTML = score;
                }
            }
            TIME_OUT_LEVEL_2 -= 50;
        }, TIME_OUT_LEVEL_2);

        keyBoardGame();

        isRunLevel2 = true;
    }
}

function keyBoardGame() {

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

}




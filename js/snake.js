const BLOCK_SIZE = 25;
const cols = 24;
const rows = 20;
const WIDTH_GAME = BLOCK_SIZE * cols;
const HEIGHT_GAME = BLOCK_SIZE * rows;
const canvas = document.getElementById('canvas-game');
canvas.width = WIDTH_GAME , canvas.height = HEIGHT_GAME;

const COLOR_BACKGROUND = 'black';
const COLOR_FOOD = 'yellow';
const COLOR_DOOR = 'purple';
const COLOR_WALL = 'red';

const context = canvas.getContext('2d');
context.fillStyle = COLOR_BACKGROUND
context.fillRect(0, 0, WIDTH_GAME, HEIGHT_GAME);

const LEFT = 37;
const RIGHT = 39;
const UP = 38;
const DOWN = 40;
const A = 65;
const D = 68;
const W = 87;
const S = 83;

let snake;
let food;
let wall;
let door;
let currentDirectionSnake; // hướng hiện tại của con rắn hệ trục tọa độ x,y
let score = 0;
let gameLevel;
let intervalLevel;
let intervalDoor;
let intervalRemoveDoor;
let timeOutRemoveDoor;
let gameOverLevel = false;

let TIME_OUT_LEVEL_1 = 175;
let TIME_OUT_LEVEL_2 = 150;
let TIME_OUT_LEVEL_3 = 150;
let TIME_OUT_LEVEL_4 = 125;
let TIME_OUT_LEVEL_5 = 125;
let TIME_OUT_LEVEL_6 = 200;

let arrWall = []; // mảng các chướng ngại vật (tường)

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

    } // -> vẽ con rắn

    clearSnake() {

        context.fillStyle = COLOR_BACKGROUND
        // clear Head
        context.fillRect(this.bodySnake[0].x, this.bodySnake[0].y, BLOCK_SIZE, BLOCK_SIZE)

        // clear Body
        for (let i = 1; i < this.bodySnake.length; i++) {
            context.fillRect(this.bodySnake[i].x, this.bodySnake[i].y, BLOCK_SIZE, BLOCK_SIZE)
        }

    } // -> xóa con rắn

    clearBodySnake() {
        for (let i = 1; i < this.bodySnake.length; i++) {
            context.fillRect(this.bodySnake[i].x, this.bodySnake[i].y, BLOCK_SIZE, BLOCK_SIZE)
        }
    } // -> xóa đi phần thân của con rắn

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
        this.eventWhenTouchEdge(); // sự kiện khi con rắn chạm vào các cạnh của màn hình chơi game

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
        this.eventWhenTouchEdge();

        if (this.checkTouchWall2()) {
            gameOver();
        }

    } // -> con rắn tự động di chuyển ở Level 2 , 4, 5

    moveSnake3() {

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
        this.eventWhenTouchEdge();
        this.eventWhenTouchDoor();

        if (this.checkTouchWall2()) {
            gameOver();
        }

    } // -> con rắn tự động di chuyển ở Level 3

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

    eventWhenTouchEdge() {

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
    } // -> đây là hàm xử lí giúp cho con rắn có thể đi được xuyên tường ở tất cả các level

    eventWhenTouchDoor() {

        let headSnake = this.bodySnake[0];
        let arrDoor = door.arrDoor;

        if (arrDoor.length > 0) {

            // nếu đầu con rắn trùng tọa độ với cánh cửa thứ nhất
            if (headSnake.x === arrDoor[0].x && headSnake.y === arrDoor[0].y) {

                headSnake.x = arrDoor[1].x;
                headSnake.y = arrDoor[1].y;
                door.arrDoor = [];


            }

            // nếu đầu con rắn trùng tọa độ với cánh cửa thứ 2
            else if (headSnake.x === arrDoor[1].x && headSnake.y === arrDoor[1].y) {

                headSnake.x = arrDoor[0].x;
                headSnake.y = arrDoor[0].y;
                door.arrDoor = [];


            }

        }


    } // -> đây là hàm xử lí khi con rắn chạm vào một trong 2 cánh cửa thần kỳ

    checkTouchWall2() {

        let headSnake = this.bodySnake[0];
        for (let wall of arrWall) {
            if (headSnake.x === wall.x && headSnake.y === wall.y) {
                return true;
            }
        }

        return false;

    } // -> kiểm tra con rắn có đụng tường hay không ?

    checkEatFood(food) {
        let headSnake = this.bodySnake[0];
        return food.x === headSnake.x && food.y === headSnake.y;
    } // -> kiểm tra rắn đã ăn mồi thành công hay chưa ?

    growUp() {
        eat_food_sound.play();

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

    randomFoodLevel1() {

        /*
         hàm Math.floor() sẽ làm tròn số -> trả về số nguyên gần nhất nhỏ hơn số truyền vào
         hàm Math.random() sẽ random ra các con số từ 0 - 1
         */

        let checkWhile;
        let foodX = Math.floor(Math.random() * (cols - 1)) * BLOCK_SIZE;
        let foodY = Math.floor(Math.random() * (rows - 1)) * BLOCK_SIZE;

        let bodySnake = snake.bodySnake;
        for (let partBody of bodySnake) {

            // -> Kiểm tra tọa độ của mồi có trùng với tọa độ nào của con rắn hay không ?
            if (foodX === partBody.x && foodY === partBody.y) {
                checkWhile = true;
                break; // -> thoát khỏi vòng for, xuống chạy vòng while
            } else {
                checkWhile = false;
            }

        }

        while (checkWhile === true) {
            foodX = Math.floor(Math.random() * (cols - 1)) * BLOCK_SIZE;
            foodY = Math.floor(Math.random() * (rows - 1)) * BLOCK_SIZE;

            for (let partBody of bodySnake) {

                // tọa độ thức ăn không trùng với tọa độ các phần thân của con rắn
                if (!(foodX === partBody.x && foodY === partBody.y)) {
                    checkWhile = false;
                } else {
                    checkWhile = true;
                    break; // thoát khỏi vòng for nhưng vẫn chạy vòng while
                }
            }

        }

        this.x = foodX;
        this.y = foodY;

        console.log('x:' + this.x, 'y:' + this.y);

        // bug -> có trường hợp Food sẽ nằm trùng với vị trí của Snake


    } // -> tọa độ cùa food nằm ngẫu nhiên trên màn hình canvas , không được trùng với vị trí của con rắn

    randomFoodLevel2() {

        /*
            - b1: Lấy ngẫu nhiên tọa độ của food (x,y)
            - b2: Kiểm tra tọa độ đó có trùng với tọa độ nào trong danh sách các chướng ngại vật (tường) hay không ?
            - b3: Kiểm tra tọa độ đó có trùng với tọa độ nào của con rắn hay không ?
            - b4:
               + Nếu trùng thì chạy vòng lặp while, tiếp tục chạy lại b1 , b2 , b3
               + Nếu không trùng thì tọa độ food (x,y) được random ở b1 được coi là tọa độ chính thức của food
         */

        let checkWhileWall;
        let checkWhileSnake;
        let bodySnake = snake.bodySnake;

        let foodX = Math.floor(Math.random() * (cols - 1)) * BLOCK_SIZE;
        let foodY = Math.floor(Math.random() * (rows - 1)) * BLOCK_SIZE;

        for (let wall of arrWall) {

            if (foodX === wall.x && foodY === wall.y) {
                checkWhileWall = true;
                break;
            } else {
                checkWhileWall = false;
            }

        }

        for (let partBody of bodySnake) {

            if (foodX === partBody.x && foodY === partBody.y) {
                checkWhileSnake = true;
                break;
            } else {
                checkWhileSnake = false;
            }
        }

        // --> * Note: kĩ thuật bật/tắt vòng lặp while
        while (checkWhileWall || checkWhileSnake) {

            foodX = Math.floor(Math.random() * (cols - 1)) * BLOCK_SIZE;
            foodY = Math.floor(Math.random() * (rows - 1)) * BLOCK_SIZE;

            for (let wall of arrWall) {

                // nếu tọa độ của mồi không trùng với tọa độ của tường
                if (!(foodX === wall.x && foodY === wall.y)) {
                    checkWhileWall = false;
                } else {
                    checkWhileWall = true;
                    break; // -> thoát khỏi vòng for
                }
            }

            for (let partBody of bodySnake) {

                // nếu tọa độ của mồi không trùng với tọa độ của rắn
                if (!(foodX === partBody.x && foodY === partBody.y)) {
                    checkWhileSnake = false;
                } else {
                    checkWhileSnake = true;
                    break; // -> thoát khỏi vòng for
                }
            }

        }

        this.x = foodX;
        this.y = foodY;

        console.log('Food- ' + 'x:' + this.x, 'y:' + this.y);

    } // -> tọa độ của food không được trùng với tọa độ của các chướng ngại vật (tường) và tọa độ của con rắn

    drawFoodLevel1() {
        context.fillStyle = COLOR_FOOD;
        this.randomFoodLevel1();
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
    } // -> tọa độ của food không được trùng với tọa độ của con rắn

    drawFoodLevel2() {
        context.fillStyle = COLOR_FOOD;
        this.randomFoodLevel2();
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
    } // -> tọa độ của food không được trùng với tọa độ của các chướng ngại vật (tường) và tọa độ của con rắn

    clearFood() {
        context.fillStyle = COLOR_BACKGROUND
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE)
    }

}

class Wall {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    drawWall2() {

        for (let x = 0; x < WIDTH_GAME; x += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, 0, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(x, HEIGHT_GAME - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            // thêm vào danh sách các chướng ngại vật
            arrWall.push(new Vector2D(x, 0), new Vector2D(x, HEIGHT_GAME - BLOCK_SIZE));

        }

        for (let y = BLOCK_SIZE * 5; y < HEIGHT_GAME - 5 * BLOCK_SIZE; y += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(BLOCK_SIZE * 0, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(BLOCK_SIZE * 4, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(BLOCK_SIZE * 8, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(BLOCK_SIZE * 12, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(WIDTH_GAME - BLOCK_SIZE, y, BLOCK_SIZE, BLOCK_SIZE);

            // thêm vào danh sách các chướng ngại vật
            arrWall.push(new Vector2D(BLOCK_SIZE * 0, y),
                new Vector2D(BLOCK_SIZE * 4, y),
                new Vector2D(BLOCK_SIZE * 8, y),
                new Vector2D(BLOCK_SIZE * 12, y),
                new Vector2D(WIDTH_GAME - BLOCK_SIZE, y));

        }

        for (let x = WIDTH_GAME - BLOCK_SIZE; x > BLOCK_SIZE * 12; x -= BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, BLOCK_SIZE * 5, BLOCK_SIZE, BLOCK_SIZE);

            arrWall.push(new Vector2D(x, BLOCK_SIZE * 5));

        }

        for (let x = WIDTH_GAME - BLOCK_SIZE; x > BLOCK_SIZE * 15; x -= BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, HEIGHT_GAME - 5 * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            arrWall.push(new Vector2D(x, HEIGHT_GAME - 5 * BLOCK_SIZE));

        }


    } // -> vẽ các chướng ngại vật (Tường) ở level 2

    drawWall3() {

        for (let x = 0; x < WIDTH_GAME; x += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, 0, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(x, HEIGHT_GAME - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            // thêm vào danh sách các chướng ngại vật
            arrWall.push(new Vector2D(x, 0), new Vector2D(x, HEIGHT_GAME - BLOCK_SIZE));

        }

        for (let y = BLOCK_SIZE * 5; y < HEIGHT_GAME - 5 * BLOCK_SIZE; y += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(BLOCK_SIZE * 0, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(BLOCK_SIZE * 4, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(BLOCK_SIZE * 8, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(BLOCK_SIZE * 12, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(WIDTH_GAME - BLOCK_SIZE, y, BLOCK_SIZE, BLOCK_SIZE);

            // thêm vào danh sách các chướng ngại vật
            arrWall.push(new Vector2D(BLOCK_SIZE * 0, y),
                new Vector2D(BLOCK_SIZE * 4, y),
                new Vector2D(BLOCK_SIZE * 8, y),
                new Vector2D(BLOCK_SIZE * 12, y),
                new Vector2D(WIDTH_GAME - BLOCK_SIZE, y));

        }

        for (let x = WIDTH_GAME - BLOCK_SIZE; x > BLOCK_SIZE * 12; x -= BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, BLOCK_SIZE * 5, BLOCK_SIZE, BLOCK_SIZE);

            arrWall.push(new Vector2D(x, BLOCK_SIZE * 5));

        }

        for (let x = WIDTH_GAME - BLOCK_SIZE; x > BLOCK_SIZE * 15; x -= BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, HEIGHT_GAME - 5 * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            arrWall.push(new Vector2D(x, HEIGHT_GAME - 5 * BLOCK_SIZE));

        }


    } // -> vẽ các chướng ngại vật (Tường) ở level 3

    drawWall5() {

        for (let x = 0; x < WIDTH_GAME; x += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, 0, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(x, HEIGHT_GAME - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            // thêm vào danh sách các chướng ngại vật
            arrWall.push(new Vector2D(x, 0), new Vector2D(x, HEIGHT_GAME - BLOCK_SIZE));

        }

        for (let x = BLOCK_SIZE * 6; x < WIDTH_GAME - BLOCK_SIZE * 6; x += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, BLOCK_SIZE * 4, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(x, BLOCK_SIZE * 5, BLOCK_SIZE, BLOCK_SIZE);
            arrWall.push(new Vector2D(x, BLOCK_SIZE * 4), new Vector2D(x, BLOCK_SIZE * 5));
        }

        for (let y = BLOCK_SIZE * 5; y < HEIGHT_GAME - BLOCK_SIZE * 5; y += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(BLOCK_SIZE * 11, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(BLOCK_SIZE * 12, y, BLOCK_SIZE, BLOCK_SIZE);

            arrWall.push(new Vector2D(BLOCK_SIZE * 11, y), new Vector2D(BLOCK_SIZE * 12, y));


        }


    }// -> vẽ các chướng ngại vật (Tường) ở level 5

    drawWall6() {

        for (let x = 0; x < WIDTH_GAME; x += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, 0, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(x, HEIGHT_GAME - BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            // thêm vào danh sách các chướng ngại vật
            arrWall.push(new Vector2D(x, 0), new Vector2D(x, HEIGHT_GAME - BLOCK_SIZE));

        }

        for (let x = BLOCK_SIZE * 6; x < WIDTH_GAME - BLOCK_SIZE * 6; x += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, BLOCK_SIZE * 4, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(x, BLOCK_SIZE * 5, BLOCK_SIZE, BLOCK_SIZE);
            arrWall.push(new Vector2D(x, BLOCK_SIZE * 4), new Vector2D(x, BLOCK_SIZE * 5));
        }

        for (let y = BLOCK_SIZE * 5; y < HEIGHT_GAME - BLOCK_SIZE * 5; y += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(BLOCK_SIZE * 11, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(BLOCK_SIZE * 12, y, BLOCK_SIZE, BLOCK_SIZE);

            arrWall.push(new Vector2D(BLOCK_SIZE * 11, y), new Vector2D(BLOCK_SIZE * 12, y));


        }


    }// -> vẽ các chướng ngại vật (Tường) ở level 6

    drawWallRandom() {

        context.fillStyle = COLOR_WALL;
        this.randomWall();
        arrWall.push(new Vector2D(this.x, this.y));
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);

    } // -> vị trí các tường mới không trùng với vị trí tường cũ

    randomWall() {

        /*
           - b1: Lấy ngẫu nhiên tọa độ của wall (x,y)
           - b2: Kiểm tra tọa độ đó có trùng với tọa độ nào trong danh sách các chướng ngại vật (tường) hay không ?
           - b3: Kiểm tra tọa độ đó có trùng với tọa độ nào của con rắn hay không ?
           - b4:
              + Nếu trùng thì chạy vòng lặp while, tiếp tục chạy lại b1 , b2 , b3
              + Nếu không trùng thì tọa độ food (x,y) được random ở b1 được coi là tọa độ chính thức của food
        */

        let checkWhileWall;
        let checkWhileSnake;
        let bodySnake = snake.bodySnake;

        let foodX = Math.floor(Math.random() * (cols - 1)) * BLOCK_SIZE;
        let foodY = Math.floor(Math.random() * (rows - 1)) * BLOCK_SIZE;

        for (let wall of arrWall) {

            if (foodX === wall.x && foodY === wall.y) {
                checkWhileWall = true;
                break;
            } else {
                checkWhileWall = false;
            }

        }

        for (let partBody of bodySnake) {

            if (foodX === partBody.x && foodY === partBody.y) {
                checkWhileSnake = true;
                break;
            } else {
                checkWhileSnake = false;
            }
        }

        // --> * Note: kĩ thuật bật/tắt vòng lặp while
        while (checkWhileWall || checkWhileSnake) {

            foodX = Math.floor(Math.random() * (cols - 1)) * BLOCK_SIZE;
            foodY = Math.floor(Math.random() * (rows - 1)) * BLOCK_SIZE;

            for (let wall of arrWall) {

                // nếu tọa độ của tường Random không trùng với tọa độ của tường
                if (!(foodX === wall.x && foodY === wall.y)) {
                    checkWhileWall = false;
                } else {
                    checkWhileWall = true;
                    break; // -> thoát khỏi vòng for
                }
            }

            for (let partBody of bodySnake) {

                // nếu tọa độ của tường Random không trùng với tọa độ của rắn
                if (!(foodX === partBody.x && foodY === partBody.y)) {
                    checkWhileSnake = false;
                } else {
                    checkWhileSnake = true;
                    break; // -> thoát khỏi vòng for
                }
            }

        }

        this.x = foodX;
        this.y = foodY;

        console.log('Wall- ' + 'x:' + this.x, 'y:' + this.y);

    } // -> tìm vị trí các tường mới sao cho không trùng với vị trí các tường cũ và vị trí của con rắn


}

class Door {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.arrDoor = [];
    }

    randomDoor() {


        let checkWhileWall;
        let checkWhileSnake;
        let checkWhileFood;

        let bodySnake = snake.bodySnake;

        let doorX = Math.floor(Math.random() * (cols - 1)) * BLOCK_SIZE;
        let doorY = Math.floor(Math.random() * (rows - 1)) * BLOCK_SIZE;

        for (let wall of arrWall) {

            if (doorX === wall.x && doorY === wall.y) {
                checkWhileWall = true;
                break;
            } else {
                checkWhileWall = false;
            }

        }

        for (let partBody of bodySnake) {

            if (doorX === partBody.x && doorY === partBody.y) {
                checkWhileSnake = true;
                break;
            } else {
                checkWhileSnake = false;
            }
        }

        if (doorX === food.x && doorY === food.y) {
            checkWhileFood = true;
        }

        // --> * Note: kĩ thuật bật/tắt vòng lặp while
        while (checkWhileWall || checkWhileSnake || checkWhileFood) {

            doorX = Math.floor(Math.random() * (cols - 1)) * BLOCK_SIZE;
            doorY = Math.floor(Math.random() * (rows - 1)) * BLOCK_SIZE;

            for (let wall of arrWall) {

                // nếu tọa độ của cánh cửa Random không trùng với tọa độ của tường
                if (!(doorX === wall.x && doorY === wall.y)) {
                    checkWhileWall = false;
                } else {
                    checkWhileWall = true;
                    break; // -> thoát khỏi vòng for
                }
            }

            for (let partBody of bodySnake) {

                // nếu tọa độ của cánh cửa Random không trùng với tọa độ của rắn
                if (!(doorX === partBody.x && doorY === partBody.y)) {
                    checkWhileSnake = false;
                } else {
                    checkWhileSnake = true;
                    break; // -> thoát khỏi vòng for
                }
            }

            // nếu tọa độ của cánh cửa Random trùng với tọa độ của thức ăn
            if (doorX === food.x && doorY === food.y) {
                checkWhileFood = true;
            }

        }

        this.x = doorX;
        this.y = doorY;

    } // -> tìm vị trí của 2 cánh cửa mới sao cho không trùng với vị trí của tường , rắn và thức ăn


    drawRandomDoor() {

        context.fillStyle = COLOR_DOOR;
        this.randomDoor();
        this.arrDoor.push(new Vector2D(this.x, this.y));
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
        this.randomDoor();
        this.arrDoor.push(new Vector2D(this.x, this.y));
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);

    }// -> cánh cửa màu tím , khi con rắn chạm vào một trong 2 cánh cửa bất kì thì sẽ dịch chuyển đến cánh cửa còn lại

    clearDoor() {
        context.fillStyle = COLOR_BACKGROUND;
        for (let door of this.arrDoor) {
            context.fillRect(door.x, door.y, BLOCK_SIZE, BLOCK_SIZE); // -> xóa trên giao diện canvas
        }

        this.arrDoor = []; // -> xóa toàn bộ phần tử trong mảng
    }

}

class GameSnakeLevel1 {

    /*
    - Người chơi điều khiển con rắn đi ăn mồi
    - Sau khi ăn mồi thành công thì con rắn sẽ lớn lên và điểm số sẽ tăng lên 1
    - Trò chơi kết thúc khi người chơi điều khiển con rắn chạm vào thân của nó
     */

    constructor() {
        snake = new Snake(7, 8, 9, 5);
        food = new Food(0, 0);
        snake.drawSnake();
        food.drawFoodLevel1();
    }

}

class GameSnakeLevel2 {

    /*
     - Người chơi điều khiển con rắn ăn mồi và vượt qua các chướng ngại vật (tường)
     - Sau khi ăn mồi thành công thì con rắn sẽ lớn lên và điểm số sẽ tăng lên 1
     - Trò chơi kết thúc khi người chơi điều khiển con rắn chạm vào thân của nó hoặc là chạm vào tường
     */


    constructor() {
        wall = new Wall();
        snake = new Snake(10, 11, 12, 17);
        food = new Food(0, 0);

        wall.drawWall2();
        snake.drawSnake();
        food.drawFoodLevel2();
    }

}

class GameSnakeLevel3 {

    /*
    - Người chơi điều khiển con rắn ăn mồi và vượt qua các chướng ngại vật (tường)
    - Con rắn sẽ di chuyển ngược hướng so với điều khiển của người chơi
    - Sau khi ăn mồi thành công thì con rắn sẽ lớn lên và điểm số sẽ tăng lên 1
    - Trò chơi kết thúc khi người chơi điều khiển con rắn chạm vào thân của nó hoặc là chạm vào tường
    */

    constructor() {
        wall = new Wall();
        snake = new Snake(10, 11, 12, 17);
        food = new Food();
        door = new Door();

        wall.drawWall3();
        snake.drawSnake();
        food.drawFoodLevel2();
        door.drawRandomDoor();
    }

}

class GameSnakeLevel4 {

    /*
        - Người chơi điều khiển con rắn ăn mồi
        - Sau khi ăn mồi thành công con rắn sẽ lớn lên và điểm số sẽ tăng lên 1
        - Tường sẽ được tự động sinh ra sau khi rắn ăn mồi thành công
        - Trò chơi kết thúc khi con rắn chạm vào thân của nó hoặc là chạm vào tường được sinh ra
     */
    constructor() {

        snake = new Snake(10, 11, 12, 15);
        food = new Food(0, 0);
        wall = new Wall();
        snake.drawSnake();
        food.drawFoodLevel1();
    }

}

class GameSnakeLevel5 {

    /*
       - Người chơi điều khiển con rắn ăn mồi
       - Sẽ có thêm tường cố định được sinh ra
       - Sau khi ăn mồi thành công con rắn sẽ lớn lên và điểm số sẽ tăng lên 1
       - Tường sẽ được tự động sinh ra sau khi rắn ăn mồi thành công
       - Trò chơi kết thúc khi con rắn chạm vào thân của nó hoặc là chạm vào tường
    */


    constructor() {

        snake = new Snake(11, 12, 13, 16);
        food = new Food();
        wall = new Wall();

        wall.drawWall5(); // phải vẽ tường trước khi vẽ mồi
        food.drawFoodLevel2();
        snake.drawSnake();

    }

}

class GameSnakeLevel6 {

    constructor() {
        wall = new Wall();
        snake = new Snake(11, 12, 13, 16);
        food = new Food();

        wall.drawWall6();
        snake.drawSnake();
        food.drawFoodLevel2();


    }

}

function runLevel1() {

    if (isRunLevel1 === false) { //-> nếu function này chưa được thực thi

        playDiv.style.display = "none"; // -> ẩn đi phần tử
        bg_music.play();

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
        }, TIME_OUT_LEVEL_1) // -> hàm này giúp lặp lại một khối code sau khoảng thời gian chỉ định;

        keyBoardGame();

        isRunLevel1 = true; // -> đánh dấu function này đã được thực thi

    }

}

function runLevel2() {

    if (isRunLevel2 === false) {

        playDiv.style.display = "none"; // -> ẩn đi phần tử
        bg_music.play();

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
                TIME_OUT_LEVEL_2 -= 10;
            }

        }, TIME_OUT_LEVEL_2);

        keyBoardGame();

        isRunLevel2 = true;
    }
}

function runLevel3() {

    if (isRunLevel3 === false) {

        playDiv.style.display = 'none';
        bg_music.play();

        intervalLevel = setInterval(function () {
            snake.moveSnake3();
            if (snake.checkEatFood(food)) {
                score++;
                food.drawFoodLevel2();
                snake.growUp();
                let scoreElements = document.getElementsByClassName('score');
                for (let element of scoreElements) {
                    element.innerHTML = score;
                }
                TIME_OUT_LEVEL_3 -= 20;
            }

        }, TIME_OUT_LEVEL_3);

        intervalDoor = setInterval(function () {

            door.drawRandomDoor();

        }, 20000);

        intervalRemoveDoor = setInterval(function () {

            if (door.arrDoor.length > 0) {
                door.clearDoor();
            }

        }, 30000);

        timeOutRemoveDoor = setTimeout(function () {

            if (door.arrDoor.length > 0) {

                door.clearDoor();
            }

        }, 10000);

        keyBoardGame();

        isRunLevel3 = true;

    }

}

function runLevel4() {

    if (isRunLevel4 === false) {

        playDiv.style.display = 'none';
        bg_music.play();

        intervalLevel = setInterval(function () {
            snake.moveSnake2(); // -> cách di chuyển của con rắn ở level 4 giống cách di chuyển ở level 2
            if (snake.checkEatFood(food)) {
                score++;
                wall.drawWallRandom();
                food.drawFoodLevel2(); // -> mồi mới được sinh ra sau khi ăn mồi cũ cũng giống ở level 2
                snake.growUp();
                let scoreElements = document.getElementsByClassName('score');
                for (let element of scoreElements) {
                    element.innerHTML = score;
                }
            }
            TIME_OUT_LEVEL_4 -= 10;
        }, TIME_OUT_LEVEL_4)

        keyBoardGame();

        isRunLevel4 = true; // -> giúp đảm bảo hàm này chỉ được gọi một lần duy nhất trong suốt thời gian chơi game

    }
}

function runLevel5() {

    if (isRunLevel5 === false) {

        playDiv.style.display = 'none';
        bg_music.play();

        intervalLevel = setInterval(function () {
            snake.moveSnake2(); // -> cách di chuyển của con rắn ở level 5 giống cách di chuyển ở level 2
            if (snake.checkEatFood(food)) {
                score++;
                wall.drawWallRandom();
                food.drawFoodLevel2(); // -> mồi mới được sinh ra sau khi ăn mồi cũ cũng giống ở level 2
                snake.growUp();
                let scoreElements = document.getElementsByClassName('score');
                for (let element of scoreElements) {
                    element.innerHTML = score;
                }
            }

        }, TIME_OUT_LEVEL_5)

        keyBoardGame();

        isRunLevel5 = true;
    }
}

function runLevel6() {

    if (isRunLevel6 === false) {

        playDiv.style.display = 'none';
        bg_music.play();

        intervalLevel = setInterval(function () {

            snake.moveSnake2(); // -> cách di chuyển của con rắn ở level 6 giống cách di chuyển ở level 2
            if (snake.checkEatFood(food)) {
                score++;
                wall.drawWallRandom();
                food.drawFoodLevel2(); // -> mồi mới được sinh ra sau khi ăn mồi cũ cũng giống ở level 2
                snake.growUp();
                let scoreElements = document.getElementsByClassName('score');
                for (let element of scoreElements) {
                    element.innerHTML = score;
                }
            }

        }, TIME_OUT_LEVEL_6);

        keyBoardGameReverse();
        isRunLevel6 = true;
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
            case A:
                if (currentDirectionSnake.x === 1) break; // -> không cho phép con rắn được được đổi hướng sang bên phải
                currentDirectionSnake = new Vector2D(-1, 0);
                break;
            case D:
                if (currentDirectionSnake.x === -1) break;  // -> không cho phép con rắn được được đổi hướng sang bên trái
                currentDirectionSnake = new Vector2D(1, 0)
                break;
            case W:
                if (currentDirectionSnake.y === 1) break;  // -> không cho phép con rắn được được đổi hướng xuống dưới
                currentDirectionSnake = new Vector2D(0, -1)
                break;
            case S:
                if (currentDirectionSnake.y === -1) break;  // -> không cho phép con rắn được được đổi hướng lên trên
                currentDirectionSnake = new Vector2D(0, 1)
                break;
            default:
                break;
        }
        // console.log(e.keyCode)
    } // -> xử lí sự kiện khi con rắn di chuyển

} // -> sự kiện bàn phím để chơi game ở tất cả các Level (trừ Level 3)

function keyBoardGameReverse() {

    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case LEFT:
                if (currentDirectionSnake.x === -1) break; // -> không cho phép con rắn được được đổi hướng sang bên phải
                currentDirectionSnake = new Vector2D(1, 0);
                break;
            case RIGHT:
                if (currentDirectionSnake.x === 1) break;  // -> không cho phép con rắn được được đổi hướng sang bên trái
                currentDirectionSnake = new Vector2D(-1, 0)
                break;
            case UP:
                if (currentDirectionSnake.y === -1) break;  // -> không cho phép con rắn được được đổi hướng xuống dưới
                currentDirectionSnake = new Vector2D(0, 1)
                break;
            case DOWN:
                if (currentDirectionSnake.y === 1) break;  // -> không cho phép con rắn được được đổi hướng lên trên
                currentDirectionSnake = new Vector2D(0, -1)
                break;
            case A:
                if (currentDirectionSnake.x === -1) break; // -> không cho phép con rắn được được đổi hướng sang bên phải
                currentDirectionSnake = new Vector2D(1, 0);
                break;
            case D:
                if (currentDirectionSnake.x === 1) break;  // -> không cho phép con rắn được được đổi hướng sang bên trái
                currentDirectionSnake = new Vector2D(-1, 0)
                break;
            case W:
                if (currentDirectionSnake.y === -1) break;  // -> không cho phép con rắn được được đổi hướng xuống dưới
                currentDirectionSnake = new Vector2D(0, 1)
                break;
            case S:
                if (currentDirectionSnake.y === 1) break;  // -> không cho phép con rắn được được đổi hướng lên trên
                currentDirectionSnake = new Vector2D(0, -1)
                break;
            default:
                break;
        }
        // console.log(e.keyCode)
    } // -> xử lí sự kiện khi con rắn di chuyển

} // -> sự kiện bàn phím để chơi game Level 6






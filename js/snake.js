const BLOCK_SIZE = 25;
const cols = 24;
const rows = 20;
/*
    - chia màn hình chính thành 24 cột và 20 dòng
    -> sẽ tạo thành 24 * 20 ô (mỗi ô có kích thước là 25)
 */

const WIDTH_GAME = BLOCK_SIZE * cols; // -> chiều rộng của màn hình chính
const HEIGHT_GAME = BLOCK_SIZE * rows; // -> chiều cao của màn hình chính

const canvas = document.getElementById('canvas-game');
canvas.width = WIDTH_GAME , canvas.height = HEIGHT_GAME; // set chiều rộng và chiều cao cho màn hình canvas

const COLOR_BACKGROUND = 'black'; // -> Màn hình chính sẽ có nền màu đen
const COLOR_FOOD = 'yellow'; // -> Mồi màu vàng
const COLOR_DOOR = 'purple'; // -> Cánh cửa thần kỳ màu tím
const COLOR_WALL = 'red'; // -> Tường màu đỏ

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

let snake; // con rắn
let food; // thức ăn (mồi)
let wall; // tường
let door; // cánh cửa thần kỳ
let currentDirectionSnake; // hướng hiện tại của con rắn theo hệ trục tọa độ x,y
let score = 0; // điểm số trong một level bất kì
let gameLevel;
let intervalLevel; // dùng để chứa hàm setInterval
let intervalDoor;
let intervalRemoveDoor;
let timeOutRemoveDoor; // dùng để chứa hàm setTimeOut
let gameOverLevel = false; // dùng để xác định khi nào game sẽ kết thúc

let TIME_OUT_LEVEL_1 = 175;
let TIME_OUT_LEVEL_2 = 150;
let TIME_OUT_LEVEL_3 = 150;
let TIME_OUT_LEVEL_4 = 125;
let TIME_OUT_LEVEL_5 = 125;
let TIME_OUT_LEVEL_6 = 125;

let arrWall = []; // mảng các chướng ngại vật (tường)

let isRunLevel1 = false; // biến kiểm soát Game có đang chạy ở Level 1 hay không ?
let isRunLevel2 = false; // biến kiểm soát Game có đang chạy ở Level 2 hay không ?
let isRunLevel3 = false; // biến kiểm soát Game có đang chạy ở Level 3 hay không ?
let isRunLevel4 = false; // biến kiểm soát Game có đang chạy ở Level 4 hay không ?
let isRunLevel5 = false; // biến kiểm soát Game có đang chạy ở Level 5 hay không ?
let isRunLevel6 = false; // biến kiểm soát Game có đang chạy ở Level 6 hay không ?

let score_lv1 = 0; // điểm số kỉ lục ở level 1
let score_lv2 = 0; // điểm số kỉ lục ở level 2
let score_lv3 = 0; // điểm số kỉ lục ở level 3
let score_lv4 = 0; // điểm số kỉ lục ở level 4
let score_lv5 = 0; // điểm số kỉ lục ở level 5
let score_lv6 = 0; // điểm số kỉ lục ở level 6

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
    } // -> xóa đi phần thân của con rắn (phần đầu vẫn giữ nguyên)

    moveSnake1() {

        /*
         - khi con rắn di chuyển thực chất là ta sẽ :
              + xóa đi con rắn ở vị trí cũ,
              + cập nhật lại vị trí mới của con rắn,
              + vẽ lại con rắn ở vị trí mới
         -> sau đó dùng hàm setInterval() thực hiện các hàm xóa và vẽ lại liên tục trên Canvas sau một khoảng thời gian nhất định
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
         - khi con rắn di chuyển thực chất là ta sẽ :
              + xóa đi con rắn ở vị trí cũ,
              + cập nhật lại vị trí mới của con rắn,
              + vẽ lại con rắn ở vị trí mới
         -> sau đó dùng hàm setInterval() thực hiện các hàm xóa và vẽ lại liên tục trên Canvas sau một khoảng thời gian nhất định
         */

        this.clearSnake();

        for (let i = this.bodySnake.length - 1; i > 0; i--) {
            this.bodySnake[i].x = this.bodySnake[i - 1].x;
            this.bodySnake[i].y = this.bodySnake[i - 1].y;
        }

        this.bodySnake[0].x += currentDirectionSnake.x * BLOCK_SIZE;
        this.bodySnake[0].y += currentDirectionSnake.y * BLOCK_SIZE;

        this.drawSnake();
        this.evenWhenTouchBody(); // sự kiện khi con rắn chạm vào thân của nó
        this.eventWhenTouchEdge(); // sự kiện khi con rắn chạm vào các cạnh của màn hình chơi game

        // kiểm tra rắn có chạm vào tường hay chưa ?
        if (this.checkTouchWall2()) {
            gameOver();
        }

    } // -> con rắn tự động di chuyển ( dùng ở Level 2 , 4, 5 )

    moveSnake3() {

        this.clearSnake();

        for (let i = this.bodySnake.length - 1; i > 0; i--) {
            this.bodySnake[i].x = this.bodySnake[i - 1].x;
            this.bodySnake[i].y = this.bodySnake[i - 1].y;
        }

        this.bodySnake[0].x += currentDirectionSnake.x * BLOCK_SIZE;
        this.bodySnake[0].y += currentDirectionSnake.y * BLOCK_SIZE;

        this.drawSnake();
        this.evenWhenTouchBody(); // sự kiện khi con rắn chạm vào thân của nó
        this.eventWhenTouchEdge(); // sự kiện khi con rắn chạm vào các cạnh màn hình chính của game
        this.eventWhenTouchDoor(); // sự kiện khi con rắn chạm vào cánh cửa màu tím

        // kiểm tra con rắn có chạm vào tường hay chưa ?
        if (this.checkTouchWall2()) {
            gameOver();
        }

    } // -> con rắn tự động di chuyển ( dùng ở Level 3)

    evenWhenTouchBody() {

        /*
            - b1: lấy ra phần đầu của con rắn
            - b2: kiểm tra tọa độ phần đầu của con rắn với tất cả tọa độ phần thân của nó
            - b3: nếu tọa độ phần đầu trùng với tọa độ phần thân thì game kết thúc
         */
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

        /*
            - b1 : lấy ra tọa độ phần đầu của con rắn
            - b2 : kiểm tra tọa độ phần đầu của rắn có trùng với tọa độ của các cánh cửa hay không ?
            - b3 : nếu tọa độ phần đầu của con rắn trùng với tọa độ của một trong các cánh cửa
                   thì dịch chuyển con rắn sang vị trí của cánh cửa còn lại
         */

        let headSnake = this.bodySnake[0];
        let arrDoor = door.arrDoor;

        if (arrDoor.length > 0) {
            // nếu đầu con rắn trùng tọa độ với cánh cửa thứ nhất
            if (headSnake.x === arrDoor[0].x && headSnake.y === arrDoor[0].y) {

                // dịch chuyển con rắn sang cánh cửa thứ 2
                headSnake.x = arrDoor[1].x;
                headSnake.y = arrDoor[1].y;
                door.arrDoor = []; // cập nhật lại danh sách các cánh cửa thần kỳ

            }
            // nếu đầu con rắn trùng tọa độ với cánh cửa thứ 2
            else if (headSnake.x === arrDoor[1].x && headSnake.y === arrDoor[1].y) {

                // dịch chuyển con rắn sang cánh cửa thứ nhất
                headSnake.x = arrDoor[0].x;
                headSnake.y = arrDoor[0].y;
                door.arrDoor = []; // cập nhật lại danh sách các cánh cửa thần kỳ

            }
        }


    } // -> đây là hàm xử lí khi con rắn chạm vào một trong 2 cánh cửa thần kỳ

    checkTouchWall2() {

        /*
            - b1: lấy ra tọa độ phần đầu của con rắn
            - b2: kiểm tra tọa độ phần đầu của rắn có trùng với tọa độ các chướng ngại vật (tường) hay không ?
         */

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

        eat_food_sound.play(); // -> phát ra âm thanh khi rắn ăn mồi thành công và lớn lên

        this.clearSnake();
        let partBodyLast = this.bodySnake[this.bodySnake.length - 1]; // phần cuối cùng của con rắn trước khi tăng trưởng
        let partBodyBeforeLast = this.bodySnake[this.bodySnake.length - 2]; // phần gần cuối cùng của con rắn trước khi tăng trưởng

        // tìm tọa độ (X,Y) cho phần thân mới của con rắn
        let newPartBodyX = partBodyLast.x + (partBodyLast.x - partBodyBeforeLast.x);
        let newPartBodyY = partBodyLast.y + (partBodyLast.y - partBodyBeforeLast.y);

        let newPartBody = new Vector2D(newPartBodyX, newPartBodyY);

        this.bodySnake.push(newPartBody); // -> thêm tọa độ mới tìm được vào phần thân của con rắn
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

        /*
            - b1 : random ra tọa độ chưa chính thức của food (x,y)
            - b2 : kiểm tra tọa độ đó có trùng với tọa độ của con rắn hay không ?
            - b3 :
                  + nếu trùng sẽ chạy vòng lặp while , tiếp tục thực hiện lại b1 , b2
                  + nếu không trùng thì tọa độ được random ở b1 chính là tọa độ chính thức
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
            context.fillRect(x, HEIGHT_GAME - 6 * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            arrWall.push(new Vector2D(x, HEIGHT_GAME - 6 * BLOCK_SIZE));

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
            context.fillRect(x, HEIGHT_GAME - 6 * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            arrWall.push(new Vector2D(x, HEIGHT_GAME - 6 * BLOCK_SIZE));

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

        for (let y = 0; y < HEIGHT_GAME; y += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(0, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(WIDTH_GAME - BLOCK_SIZE, y, BLOCK_SIZE, BLOCK_SIZE);

            // thêm vào danh sách các chướng ngại vật
            arrWall.push(new Vector2D(0, y), new Vector2D(WIDTH_GAME - BLOCK_SIZE, y));

        }

        for (let x = BLOCK_SIZE * 6; x < WIDTH_GAME - BLOCK_SIZE * 6; x += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(x, BLOCK_SIZE * 13, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(x, BLOCK_SIZE * 14, BLOCK_SIZE, BLOCK_SIZE);

            // thêm vào danh sách các chướng ngại vật
            arrWall.push(new Vector2D(x, BLOCK_SIZE * 13), new Vector2D(x, BLOCK_SIZE * 14));
        }

        for (let y = BLOCK_SIZE * 5; y < HEIGHT_GAME - BLOCK_SIZE * 5; y += BLOCK_SIZE) {

            context.fillStyle = COLOR_WALL;
            context.fillRect(BLOCK_SIZE * 11, y, BLOCK_SIZE, BLOCK_SIZE);
            context.fillRect(BLOCK_SIZE * 12, y, BLOCK_SIZE, BLOCK_SIZE);

            // thêm vào danh sách các chướng ngại vật
            arrWall.push(new Vector2D(BLOCK_SIZE * 11, y), new Vector2D(BLOCK_SIZE * 12, y));
        }


    }// -> vẽ các chướng ngại vật (Tường) ở level 6

    drawWallRandom() {

        context.fillStyle = COLOR_WALL;
        this.randomWall();
        arrWall.push(new Vector2D(this.x, this.y));
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);

    } // -> vị trí các tường mới không trùng với vị trí tường cũ và vị trí của con rắn

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

    } // -> tìm vị trí của cánh cửa mới sao cho không trùng với vị trí của tường, rắn và thức ăn

    drawRandomDoor() {

        context.fillStyle = COLOR_DOOR;
        this.randomDoor();
        this.arrDoor.push(new Vector2D(this.x, this.y)); // thêm tọa độ cánh cửa được random vào danh sách các cánh cửa
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
        this.randomDoor();
        this.arrDoor.push(new Vector2D(this.x, this.y));
        context.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);

    } // -> vẽ cánh cửa thần kỳ mới sao cho không trùng với vị trí của tường, thức ăn và con rắn

    clearAllDoors() {
        context.fillStyle = COLOR_BACKGROUND;
        for (let door of this.arrDoor) {
            context.fillRect(door.x, door.y, BLOCK_SIZE, BLOCK_SIZE); // -> xóa trên giao diện canvas
        }

        this.arrDoor = []; // -> xóa toàn bộ phần tử trong mảng
    } // -> xóa đi tất cả các cánh cửa thần kỳ

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
    - Khi người chơi điều khiển con rắn chạm vào cánh cửa màu tím thì con rắn sẽ dịch chuyển đến cánh cửa còn lại
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

    /*
    - Người chơi điều khiển con rắn ăn mồi
    - Con rắn sẽ di chuyển ngược hướng so với sự điều người của người chơi (vd : điều khiển con rắn lên trên thì nó sẽ đi xuống dưới ...)
    - Sẽ có thêm tường cố định được sinh ra
    - Sau khi ăn mồi thành công con rắn sẽ lớn lên và điểm số sẽ tăng lên 1
    - Tường sẽ được tự động sinh ra sau khi rắn ăn mồi thành công
    - Trò chơi kết thúc khi con rắn chạm vào thân của nó hoặc là chạm vào tường
 */

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
        bg_music.play(); // -> phát âm thanh nhạc nền game

        // Tạm thời ngăn chặn sự kiện click chuột
        canvas.style.pointerEvents = "none";

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
                if (score > score_lv1) {
                    score_lv1 = score;
                    score_level1.innerHTML = score_lv1;
                } // -> cập nhật số điểm kỉ lục của level-1 lên giao diện
            }
        }, TIME_OUT_LEVEL_1) // -> hàm này giúp lặp lại một khối code sau khoảng thời gian chỉ định;

        keyBoardGame(); // -> sự kiện bàn phím cho level

        isRunLevel1 = true; // -> đảm bảo function này chỉ được thực hiện 1 lần

    }

}

function runLevel2() {

    if (isRunLevel2 === false) {

        playDiv.style.display = "none"; // -> ẩn đi phần tử
        bg_music.play();

        // Tạm thời ngăn chặn sự kiện click chuột
        canvas.style.pointerEvents = "none";

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
                if (score > score_lv2) {
                    score_lv2 = score;
                    score_level2.innerHTML = score_lv2;
                }// -> cập nhật số điểm kỉ lục của level-2 lên giao diện
                TIME_OUT_LEVEL_2 -= 10;
            }

        }, TIME_OUT_LEVEL_2);

        keyBoardGame(); // -> sự kiện bàn phím cho level

        isRunLevel2 = true; // -> đảm bảo function này chỉ được thực hiện 1 lần
    }
}

function runLevel3() {

    if (isRunLevel3 === false) {

        playDiv.style.display = 'none';
        bg_music.play();

        // Tạm thời ngăn chặn sự kiện click chuột
        canvas.style.pointerEvents = "none";

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
                if (score > score_lv3) {
                    score_lv3 = score;
                    score_level3.innerHTML = score_lv3;
                }// -> cập nhật số điểm kỉ lục của level-3 lên giao diện
                TIME_OUT_LEVEL_3 -= 20;
            }

        }, TIME_OUT_LEVEL_3);

        intervalDoor = setInterval(function () {

            door.drawRandomDoor();

        }, 20000); // -> sau 20s sẽ xuất hiện 2 cánh cửa thần kỳ

        intervalRemoveDoor = setInterval(function () {

            if (door.arrDoor.length > 0) {
                door.clearAllDoors();
            }

        }, 30000); // -> sau 30s sẽ xóa đi tất cả các cánh cửa thần kỳ hiện có

        timeOutRemoveDoor = setTimeout(function () {

            if (door.arrDoor.length > 0) {

                door.clearAllDoors();
            }

        }, 10000); // -> 10s kể từ khi level bắt đầu , sẽ xóa đi tất cả các cánh cửa thần kì

        keyBoardGame(); // -> sự kiện bàn phím cho level

        isRunLevel3 = true; // -> đảm bảo function này chỉ được thực hiện 1 lần

    }

}

function runLevel4() {

    if (isRunLevel4 === false) {

        playDiv.style.display = 'none';
        bg_music.play();

        // Tạm thời ngăn chặn sự kiện click chuột
        canvas.style.pointerEvents = "none";

        intervalLevel = setInterval(function () {
            snake.moveSnake2(); // -> cách di chuyển của con rắn ở level 4 giống cách di chuyển ở level 2
            if (snake.checkEatFood(food)) {
                score++;
                wall.drawWallRandom();
                wall.drawWallRandom();
                food.drawFoodLevel2(); // -> mồi mới được sinh ra sau khi ăn mồi cũ cũng giống ở level 2
                snake.growUp();
                let scoreElements = document.getElementsByClassName('score');
                for (let element of scoreElements) {
                    element.innerHTML = score;
                }
                if (score > score_lv4) {
                    score_lv4 = score;
                    score_level4.innerHTML = score_lv4;
                }// -> cập nhật số điểm kỉ lục của level-4 lên giao diện
            }
            TIME_OUT_LEVEL_4 -= 10;
        }, TIME_OUT_LEVEL_4)

        keyBoardGame(); // -> sự kiện bàn phím cho level

        isRunLevel4 = true; // -> giúp đảm bảo hàm này chỉ được gọi một lần duy nhất trong suốt thời gian chơi game

    }
}

function runLevel5() {

    if (isRunLevel5 === false) {

        playDiv.style.display = 'none';
        bg_music.play();

        // Tạm thời ngăn chặn sự kiện click chuột
        canvas.style.pointerEvents = "none";

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
                if (score > score_lv5) {
                    score_lv5 = score;
                    score_level5.innerHTML = score_lv5;
                }// -> cập nhật số điểm kỉ lục của level-5 lên giao diện
            }

        }, TIME_OUT_LEVEL_5)

        keyBoardGame(); // -> sự kiện bàn phím cho level

        isRunLevel5 = true;
    }
}

function runLevel6() {

    if (isRunLevel6 === false) {

        playDiv.style.display = 'none';
        bg_music.play();

        // Tạm thời ngăn chặn sự kiện click chuột
        canvas.style.pointerEvents = "none";

        intervalLevel = setInterval(function () {

            snake.moveSnake2(); // -> cách di chuyển của con rắn ở level 6 giống cách di chuyển ở level 2
            if (snake.checkEatFood(food)) {
                score++;
                wall.drawWallRandom();
                wall.drawWallRandom();
                food.drawFoodLevel2(); // -> mồi mới được sinh ra sau khi ăn mồi cũ cũng giống ở level 2
                snake.growUp();
                let scoreElements = document.getElementsByClassName('score');
                for (let element of scoreElements) {
                    element.innerHTML = score;
                }
                if (score > score_lv6) {
                    score_lv6 = score;
                    score_level6.innerHTML = score_lv6;
                }
            }// -> cập nhật số điểm kỉ lục của level-6 lên giao diện

        }, TIME_OUT_LEVEL_6);

        keyBoardGameReverse(); // -> sự kiện bàn phím cho level
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

} // -> sự kiện bàn phím để chơi game ở tất cả các Level (trừ Level 6)

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




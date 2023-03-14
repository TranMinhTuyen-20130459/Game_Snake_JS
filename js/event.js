let bg_music = document.getElementById('bg-music'); // âm thanh nền của game
let gov_sound = document.getElementById('game-over-sound'); // âm thanh khi game kết thúc
let eat_food_sound = document.getElementById('eat-food-sound');  // âm thanh mỗi khi ăn mồi thành công

let black_color = 'rgb(10 10 10)';
let pink_color = '#a10f43';

// Lấy tất cả các thẻ div có class là level-game
let divsClass = document.getElementsByClassName('level-game');

// Duyệt qua từng thẻ div và gán hàm xử lí sự kiện click cho nó nếu giá trị của nó là Level 1,2,3,4,5,6
for (let div of divsClass) {

    let contentHTML = div.innerHTML;
    if (contentHTML == 'Level 1') {

        div.addEventListener("click", function () {

            resetCanvas();
            new GameSnakeLevel1();
            runLevel1();
            resetColor(black_color);
            changeColor(div, pink_color);
        })

    } else if (contentHTML == 'Level 2') {

        div.addEventListener("click", function () {

            resetCanvas();
            new GameSnakeLevel2();
            runLevel2();
            resetColor(black_color);
            changeColor(div, pink_color);
        })

    } else if (contentHTML == 'Level 3') {

        div.addEventListener("click", function () {

            resetCanvas();
            new GameSnakeLevel3();
            runLevel3()
            resetColor(black_color);
            changeColor(div, pink_color);
        })

    } else if (contentHTML == 'Level 4') {

        div.addEventListener("click", function () {
            resetCanvas();
            new GameSnakeLevel4();
            runLevel4();
            resetColor(black_color);
            changeColor(div, pink_color);
        })

    } else if (contentHTML == 'Level 5') {

        div.addEventListener("click", function () {

            resetCanvas();
            new GameSnakeLevel5();
            runLevel5();
            resetColor(black_color);
            changeColor(div, pink_color);
        })

    } else if (contentHTML == 'Level 6') {

        div.addEventListener("click", function () {
            resetCanvas();
            new GameSnakeLevel6();
            runLevel6();
            resetColor(black_color);
            changeColor(div, pink_color);
        })

    }

}

// Chọn ra phần tử có id là play-div
let playDiv = document.getElementById("play-div");

// thêm sự kiện cho phần tử có id là play-div
playDiv.addEventListener("click", function () {

    runLevel1();

});

function changeColor(element, nextColor) {

    element.style.backgroundColor = nextColor;

} // -> thay đổi màu nền của một phần tử

function resetColor(color) {

    for (let i = 0; i < divsClass.length; i++) {
        divsClass[i].style.backgroundColor = color;
    }

} // -> reset lại màu nền của tất cả các thẻ div có class là level-game

function resetCanvas() {

    clearInterval(intervalLevel);
    clearInterval(intervalDoor);
    clearInterval(intervalRemoveDoor);

    clearTimeout(timeOutRemoveDoor);

    context.fillStyle = COLOR_BACKGROUND;
    context.fillRect(0, 0, WIDTH_GAME, HEIGHT_GAME);

    isRunLevel1 = false;
    isRunLevel2 = false;
    isRunLevel3 = false;
    isRunLevel4 = false;
    isRunLevel5 = false;
    isRunLevel6 = false;

    TIME_OUT_LEVEL_1 = 175;
    TIME_OUT_LEVEL_2 = 150;
    TIME_OUT_LEVEL_3 = 150;
    TIME_OUT_LEVEL_4 = 150;
    TIME_OUT_LEVEL_5 = 125;
    TIME_OUT_LEVEL_6 = 200;

    gameOverLevel = false;
    arrWall = [];

    bg_music.load(); // -> trở lại âm thanh ban đầu
    gov_sound.load();

    score = 0;
    let scoreElements = document.getElementsByClassName('score');
    for (let element of scoreElements) {
        element.innerHTML = score;
    } // -> reset lại điểm

} // -> reset lại màn hình chơi game sau khi click vào một Level mới

function gameOver() {

    clearInterval(intervalLevel);
    clearInterval(intervalDoor);
    clearInterval(intervalRemoveDoor);

    clearTimeout(timeOutRemoveDoor);

    // xóa các pixel trong một hình chữ nhật bằng cách đặt màu pixel thành đen trong suốt rgba (0,0,0,0)
    context.clearRect(0, 0, WIDTH_GAME, HEIGHT_GAME);

    context.fillStyle = "green";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.font = "normal bold 50px serif";
    context.fillText("Game Over", WIDTH_GAME / 2, HEIGHT_GAME / 2);

    bg_music.pause();
    gov_sound.play();

}  // -> hàm này để xử lí các sự kiện sau khi kết thúc một level

window.addEventListener('load', function () {
    gameLevel = new GameSnakeLevel1();
    canvas.onclick = function () {
        runLevel1();
    }
}) // -> hàm này được gọi khi trang được load


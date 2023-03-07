let black_color = 'rgb(10 10 10)';
let pink_color = '#a10f43';

// Lấy tất cả các thẻ div có class là level-game
let divs = document.getElementsByClassName('level-game');

// Duyệt qua từng thẻ div và gán hàm xử lí sự kiện click cho nó nếu giá trị của nó là Level 1,2,3,4,5,6
for (let div of divs) {

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
            alert("Level 3");
            resetColor(black_color);
            changeColor(div, pink_color);
        })

    } else if (contentHTML == 'Level 4') {

        div.addEventListener("click", function () {
            alert("Level 4")
            resetColor(black_color);
            changeColor(div, pink_color);
        })

    } else if (contentHTML == 'Level 5') {

        div.addEventListener("click", function () {
            alert("Level 5")
            resetColor(black_color);
            changeColor(div, pink_color);
        })

    } else if (contentHTML == 'Level 6') {

        div.addEventListener("click", function () {
            alert("Level 6")
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

    for (let i = 0; i < divs.length; i++) {
        divs[i].style.backgroundColor = color;
    }

} // -> reset lại màu nền của tất cả các thẻ div có class là level-game

function resetCanvas() {

    clearInterval(intervalLevel);
    
    context.fillStyle = COLOR_BACKGROUND;
    context.fillRect(0, 0, WIDTH_GAME, HEIGHT_GAME);
    
    isRunLevel1 = false;
    isRunLevel2 = false;
    isRunLevel3 = false;
    isRunLevel4 = false;
    isRunLevel5 = false;
    isRunLevel6 = false;

    score = 0;
    let scoreElements = document.getElementsByClassName('score');
    for (let element of scoreElements) {
        element.innerHTML = score;
    }

} // -> reset lại màn hình chơi game sau khi click vào một Level mới

window.addEventListener('load', function () {
    gameLevel = new GameSnakeLevel1();
    canvas.onclick = function () {
        runLevel1();
    }
}) // -> hàm này được gọi khi trang được load


// Lấy tất cả các thẻ div có class là level-game
let divs = document.getElementsByClassName('level-game');

// Duyệt qua từng thẻ div và gán hàm xử lí sự kiện click cho nó nếu giá trị của nó là Level 1,2,3,4,5,6
for (let div of divs) {

    let contentHTML = div.innerHTML;
    if (contentHTML == 'Level 1') {

        div.addEventListener("click", function () {
            alert("Level 1")

        })

    } else if (contentHTML == 'Level 2') {


        div.addEventListener("click", function () {
            alert("Level 2")
        })

    } else if (contentHTML == 'Level 3') {

        div.addEventListener("click", function () {
            alert("Level 3")
        })

    } else if (contentHTML == 'Level 4') {

        div.addEventListener("click", function () {
            alert("Level 4")
        })

    } else if (contentHTML == 'Level 5') {

        div.addEventListener("click", function () {
            alert("Level 5")
        })

    } else if (contentHTML == 'Level 6') {

        div.addEventListener("click", function () {
            alert("Level 6")
        })

    }

}

// Chọn ra phần tử có id là play-div
let playDiv = document.getElementById("play-div");

// thêm sự kiện cho phần tử có id là play-div
playDiv.addEventListener("click", function () {

    playDiv.style.display = "none"; // -> ẩn phần tử
    runLevel1();

});
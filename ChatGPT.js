canvas.onclick = function (e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;
    if (isInsideButton(mouseX, mouseY)) {
        context.fillStyle = COLOR_BACKGROUND;
        context.fillRect(button.x, button.y, button.w, button.h);

    }
}  // Gán sự kiện onclick cho canvas

let button = {
    x: WIDTH_GAME / 3, // Tọa độ x của button
    y: HEIGHT_GAME / 2.5, // Tọa độ y của button
    w: 200, // Chiều rộng của button
    h: 50, // Chiều cao của button
    text: "Play", // Văn bản hiển thị trên button
}; // Tạo một đối tượng button
function drawButton() {
    // Vẽ hình chữ nhật cho button
    context.fillStyle = "blue"; // Màu nền của button
    context.fillRect(button.x, button.y, button.w, button.h); // Vị trí và kích thước của button

    // Vẽ văn bản cho button
    context.fillStyle = "white"; // Màu chữ của văn bản
    context.font = "30px Arial"; // Font chữ của văn bản
    let textWidth = context.measureText(button.text).width; // Đo chiều rộng của văn bản để căn giữa
    let textX = button.x + (button.w - textWidth) / 2; // Tọa độ x của văn bản để căn giữa trong hình chữ nhật
    let textY = button.y + (button.h + 30) / 2; // Tọa độ y của văn bản để căn giữa trong hình chữ nhật
    context.fillText(button.text, textX, textY);
}  // Hàm để vẽ button lên canvas

drawButton(); // Gọi hàm drawButton để vẽ button Play
function isInsideButton(x, y) {
    return x >= button.x && x <= button.x + button.w && y >= button.y && y <= button.y + button.h;
} // Hàm để kiểm tra xem tọa độ chuột có nằm trong khu vực của button hay không ?




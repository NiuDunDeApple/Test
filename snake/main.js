
// ================= 贪吃蛇游戏实现 =================
const gameCanvas = document.createElement('canvas');
const ctx = gameCanvas.getContext('2d');
document.body.prepend(gameCanvas);

// 游戏参数
const GRID_SIZE = 20;
const GAME_SIZE = 400;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 1, dy = 0;
let score = 0;
let gameLoop;

// 初始化画布
gameCanvas.width = GAME_SIZE;
gameCanvas.height = GAME_SIZE;
gameCanvas.style.border = '2px solid #333';

// 控制方向
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': if(dy === 0) { dx = 0; dy = -1 } break;
        case 'ArrowDown': if(dy === 0) { dx = 0; dy = 1 } break;
        case 'ArrowLeft': if(dx === 0) { dx = -1; dy = 0 } break;
        case 'ArrowRight': if(dx === 0) { dx = 1; dy = 0 } break;
    }
});

// 控制方向（修改部分）
let touchStartX = 0;
let touchStartY = 0;
const minSwipeDistance = 30; // 最小滑动识别距离

gameCanvas.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault(); // 阻止页面滚动
}, { passive: false });

gameCanvas.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) { // 水平滑动
        if (deltaX > minSwipeDistance && dx === 0) { // 右滑
            dx = 1;
            dy = 0;
            touchStartX = touch.clientX; // 重置起点避免连续触发
        } else if (deltaX < -minSwipeDistance && dx === 0) { // 左滑
            dx = -1;
            dy = 0;
            touchStartX = touch.clientX;
        }
    } else { // 垂直滑动
        if (deltaY > minSwipeDistance && dy === 0) { // 下滑
            dx = 0;
            dy = 1;
            touchStartY = touch.clientY;
        } else if (deltaY < -minSwipeDistance && dy === 0) { // 上滑
            dx = 0;
            dy = -1;
            touchStartY = touch.clientY;
        }
    }
    e.preventDefault();
}, { passive: false });

// 游戏主循环
function updateGame() {
    // 移动蛇头
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // 碰撞检测
    if (head.x < 0 || head.x >= GAME_SIZE/GRID_SIZE ||
        head.y < 0 || head.y >= GAME_SIZE/GRID_SIZE ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // 吃食物检测
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
    } else {
        snake.pop();
    }

    drawGame();
}

// 生成新食物
function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * (GAME_SIZE/GRID_SIZE)),
            y: Math.floor(Math.random() * (GAME_SIZE/GRID_SIZE))
        };
    } while(snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// 绘制游戏
function drawGame() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE);

    // 画蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE - 1,
            GRID_SIZE - 1
        );
    });

    // 画食物
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE/2,
        food.y * GRID_SIZE + GRID_SIZE/2,
        GRID_SIZE/2 - 1,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    alert(`Game Over! Score: ${score}`);
}

// 添加开始按钮
const startBtn = document.createElement('button');
startBtn.textContent = '开始游戏';
startBtn.style.display = 'block';
startBtn.style.margin = '10px 0';
document.body.prepend(startBtn);

startBtn.addEventListener('click', () => {
    clearInterval(gameLoop);
    snake = [{x: 10, y: 10}];
    score = 0;
    dx = 1; dy = 0;
    generateFood();
    gameLoop = setInterval(updateGame, 150);
});

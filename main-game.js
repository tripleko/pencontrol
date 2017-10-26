window.onload = function() {
let game = new Phaser.Game(800, 600, Phaser.CANVAS, 'container', { preload: preload, create: create, render: render });
let graphics;

let path = [];
let successCount = 0;
let streakCount = 0;
let startSquare, successText, streakText, statusText, status;
const PATHSIZE = 7;

function preload () {
    game.load.image('startSquare', '7x7.png');
    game.load.image('endSquare', '7x7end.png');
}

function create () {
    graphics = game.add.graphics(0,0);
    graphics.inputEnabled = true;

    graphics.events.onInputOver.add(onOnPath, this);
    graphics.events.onInputOut.add(onOffPath, this);

    game.input.mouse.capture = true;

    let style = { font: "25px Arial", fill: "#ffffff" };
    successText = game.add.text(330, 390, "Success: " + successCount, style);
    streakText = game.add.text(330, 360, "Streak: " + successCount, style);

    statusText = game.add.text(20, 20, "Begin when ready!", style);

    choosePath();
    drawPath(0xFE0E0E);

    startSquare = game.add.sprite(path[0].x, path[0].y, 'startSquare');
    endSquare = game.add.sprite(path[path.length-1].x, path[path.length-1].y, 'endSquare');
}

let isDrawing = false;
let offPath = true;

function render() {
    if (game.input.activePointer.leftButton.isDown) {
        if(isMouseOverStart() && !isDrawing) {
            isDrawing = true;
            offPath = false;
            statusText.text = "Now Running!"
        }
        else if(offPath && isDrawing) {
            isDrawing = false;
            statusText.text = "You went off path. :("
            streakCount = 0;
            streakText.text = "Streak: " + streakCount;
        }
        if(isMouseOverEnd() && isDrawing) {
            isDrawing = false;
            statusText.text = "Success!"
            successCount += 1;
            streakCount += 1;
            successText.text = "Success: " + successCount;
            streakText.text = "Streak: " + streakCount;
        }
    }
}

function isMouseOverStart() {
    if(game.input.activePointer.x >= startSquare.x &&
        game.input.activePointer.x <= startSquare.x + startSquare.width &&
        game.input.activePointer.y >= startSquare.y &&
        game.input.activePointer.y <= startSquare.y + startSquare.height) {
            return true;
        }
    return false;
}

function isMouseOverEnd() {
    if(game.input.activePointer.x >= endSquare.x &&
        game.input.activePointer.x <= endSquare.x + endSquare.width &&
        game.input.activePointer.y >= endSquare.y &&
        game.input.activePointer.y <= endSquare.y + endSquare.height) {
            return true;
        }
    return false;
}

function drawPath(fill) {
    graphics.clear();
    graphics.beginFill(fill);

    for(let i = 0; i < path.length; i++) {
        graphics.drawRect(path[i].x, path[i].y, PATHSIZE, PATHSIZE);
    }
}

function createPath(anchorPoints, segments) {
    path = [];

    let x = 1 / segments;

    for (let i = 0; i <= 1; i += x) {
        let px = game.math.catmullRomInterpolation(anchorPoints.x, i);
        let py = game.math.catmullRomInterpolation(anchorPoints.y, i);
        
        path.push({x: px, y: py});
    }
}

function choosePath() {
    switch(shapeType) {
        case 0:
            createPath({
                "x": [200, 400],
                "y": [200, 200]
            }, 500);
            break;
        case 1:
            createPath({
                "x": [200, 400],
                "y": [200, 300]
            }, 400);
            break;
        case 2:
            createPath({
                "x": [ 90, 183, 302],
                "y": [139, 286, 150]
            }, 400);
            break;
        case 3:
            createPath({
                "x": [ 90, 183, 402, 448],
                "y": [139, 286, 101, 210]
            }, 400);
            break;
        default:
            createStraightPath1(500);
            break;
    }
}

function onOffPath() {
    offPath = true;
    drawPath(0xFE0E0E);
}

function onOnPath() {
    drawPath(0xEC8722);
}
};

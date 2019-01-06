window.addEventListener('load', start);

var canvas, ctx, cw, ch;
var pins = ['*****.',
            '******',
            '**.***',
            '.*****',
            '****..',
            '.**.*.',];
var pinw = 10, pinh = 10;
var drawingLine = false, drawingFrom = {x: 0, y: 0};
var lines = [];

function start() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    drawPins();
    canvas.addEventListener('click', puzzleClick);
    canvas.addEventListener('mousemove', drawCanvas);
}

function drawPins() {
    cw = canvas.width, ch = canvas.height;
    for (let row = 0; row < pins.length; row++) {
        for (let col = 0; col < pins[row].length; col++) {
            let squarew = cw / pins[row].length;
            let squareh = ch / pins.length;
            let pinx = squarew*(0.5 + col) - pinw/2;
            let piny = squareh*(0.5 + row) - pinh/2;

            if (pins[row][col] === '*')
                ctx.fillRect(pinx, piny, pinw, pinh);
        }
    }
}

function drawCanvas(e) {
    ctx.clearRect(0, 0, cw, ch);

    drawPins();
    drawCompleteLines();
    if (drawingLine) {
        drawLine(e);
    }
}

function drawCompleteLines() {
    for (let line of lines) {
        console.log(line.fromX, line.fromY, line.endX, line.endY);
        ctx.beginPath();
        ctx.moveTo(line.fromX, line.fromY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();        
    }
}

function drawLine(e) {
    if (!drawingLine)
        return false;
    
    let {x, y} = getLocalMouseXY(e);

    ctx.beginPath();
    ctx.moveTo(drawingFrom.x, drawingFrom.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    return true;
}

function pinAtColRow(col, row) {
    if (pins[row][col] === '*')
        return true;
    return false;
}

function calcColRowfromXY(x, y) {
    let square = {
        w: cw / pins[0].length,
        h: ch / pins.length,
    }

    let col = Math.floor(x / square.w);
    let row = Math.floor(y / square.h);

    if (!pinAtColRow(col, row)) {
        return false;
    } else {
        return {col, row};
    }
}

function calcXYfromColRow(col, row) {
    let square = {
        w: cw / pins[0].length,
        h: ch / pins.length,
    }
    let x = square.w*(0.5 + col);
    let y = square.h*(0.5 + row);    

    return {x, y};
}

function getLocalMouseXY(event) {
    let rect = event.target.getBoundingClientRect();
    let x = Math.round(event.clientX - rect.left); //x position within the element.
    let y = Math.round(event.clientY - rect.top);

    return {x, y};
}

function puzzleClick(e) {
    let {x, y} = getLocalMouseXY(e);

    if (!calcColRowfromXY(x, y))
        return false;
        
    if (!drawingLine) {
        drawingLine = true;

        let {col, row} = calcColRowfromXY(x, y);
        drawingFrom.x = calcXYfromColRow(col, row).x;
        drawingFrom.y = calcXYfromColRow(col, row).y;
    } else {
        if (completeLine(x, y)) {
            drawCanvas(e);
        }
    }
}



function completeLine(x, y) {
    if (!calcColRowfromXY(x, y)) {
        //can't finish line in the empty square
        return false;
    }

    let {col, row} = calcColRowfromXY(x, y);
    let centerx = calcXYfromColRow(col, row).x;
    let centery = calcXYfromColRow(col, row).y;

    if (centerx === drawingFrom.x && centery === drawingFrom.y){
        //same square, can't finish the line
        return false;
    }

    lines.push({fromX: drawingFrom.x, fromY: drawingFrom.y, endX: centerx, endY: centery});
    drawingFrom.x = centerx;
    drawingFrom.y = centery;
    return true;
}
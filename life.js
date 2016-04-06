/*global $ */
"use strict";

var cellCount = $(".cell").length;
var width = $("tr").first().children(".cell").length;
var height = $("tr").length;

//NOTE(adam): 2d array representing cells in the grid
var grid = [];

//NOTE(adam): 1d arrays representing life of 2d grid (x + y * w)
var activeCellList = [];
var tempCellList = [];

var loopInterval;
var running = false;
var $gameSpeed = $("#gameSpeedDisplay");
var curSpeed = parseFloat($gameSpeed.text());


function get1dIndex(x, y) {
    return x + y * width;
}

function setCellLife(x, y, life) {
    var id = get1dIndex(x, y);
    tempCellList[id] = life;
}

function updateCells() {
    activeCellList = tempCellList.slice();
    $(".cell").each(function(c, cell) {
        var xPos = cell.cellIndex;
        var yPos = cell.parentElement.rowIndex;
        var $cell = $(cell);
        var alive = activeCellList[get1dIndex(xPos, yPos)];

        $cell.toggleClass("alive", alive);
    });
}

function getNeighborCount(x, y) {
    var count = 0;
    for(var yOff = -1; yOff !== 2; ++yOff) {
        if((y - yOff < 0) || (y + yOff >= height)) continue;
        for(var xOff = -1; xOff !== 2; ++xOff) {
            if((x - xOff < 0) || (x + xOff >= width)) continue;
            if(xOff === 0 && yOff === 0) continue;

            var id = get1dIndex(x + xOff, y + yOff);
            if(activeCellList[id]) ++count;
        }
    }
    return count;
}

function tick() {
    for(var y = 0; y != height; ++y) {
        for(var x = 0; x != width; ++x) {
            // < 2 dies
            // > 3 dies
            // 2 3 stay
            // = 3 life
            var id = get1dIndex(x, y);
            var neighbors = getNeighborCount(x, y);
            if(neighbors < 2 || neighbors > 3) {
                tempCellList[id] = false;
            } else if(neighbors === 2) {
                tempCellList[id] = activeCellList[id];
            } else {
                tempCellList[id] = true;
            }
        }
    }

    updateCells();
}

function startLoop() {
    loopInterval = setInterval(tick, 1000 / $gameSpeed.text());
    running = true;
    $("#gameRunButton").prop("value", "Stop");
}

function stopLoop() {
    clearInterval(loopInterval);
    running = false;
    $("#gameRunButton").prop("value", "Run");
}


//NOTE(adam): fill the grid array with references to the cells for easier access
$("tr").each(function(r, row) {
    var rowArr = [];
    $(row).children(".cell").each(function(c, cell) {
        rowArr.push(cell);
    });
    grid.push(rowArr);
});

//NOTE(adam): fill arrays with default false for "dead"
for(var i = 0; i != cellCount; ++i) {
    activeCellList.push(false);
    tempCellList.push(false);
}

$("#gameRunButton").prop("value", "Run");
$("#gameRunButton").click(function() {
    if(!running) {
        startLoop();
    } else {
        stopLoop();
    }
});

$("#gameSpeedUp").click(function() {
    curSpeed += 0.5;
    $gameSpeed.text(curSpeed);
    if(running) {
        stopLoop();
        startLoop();
    }
});

$("#gameSpeedDown").click(function() {
    if(curSpeed > 0.5) {
        curSpeed -= 0.5;
        $gameSpeed.text(curSpeed);
        if(running) {
            stopLoop();
            startLoop();
        }
    }
});

$(".cell").click(function() {
    $(this).toggleClass("alive");

    var xPos = this.cellIndex;
    var yPos = this.parentElement.rowIndex;
    setCellLife(xPos, yPos, $(this).hasClass("alive"));
    updateCells();
});


setCellLife(2, 4, true);
setCellLife(3, 4, true);
setCellLife(4, 4, true);
setCellLife(4, 3, true);
setCellLife(3, 2, true);
setCellLife(2, 7, true);
updateCells();


//alert(cellCount + "  " + width + "  " + height + "  " + activeCellList.length);

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
var curSpeed = 5.0;

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
    loopInterval = setInterval(tick, 1000 / curSpeed);
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

$("#gameLayoutPresets").prop("selectedIndex", -1);
$("#gameLayoutPresets").change(function() {
    tempCellList.fill(false);
    switch(this.value) {
        case "glider":
            setCellLife(2, 4, true);
            setCellLife(3, 4, true);
            setCellLife(4, 4, true);
            setCellLife(4, 3, true);
            setCellLife(3, 2, true);
            break;
        case "toad":
            setCellLife(11, 11, true);
            setCellLife(12, 11, true);
            setCellLife(13, 11, true);
            setCellLife(12, 12, true);
            setCellLife(13, 12, true);
            setCellLife(14, 12, true);
            break;
        case "pinwheel":
            setCellLife(10, 9, true);
            setCellLife(11, 9, true);
            setCellLife(12, 9, true);
            setCellLife(13, 9, true);

            setCellLife(9, 10, true);
            setCellLife(9, 11, true);
            setCellLife(9, 12, true);
            setCellLife(9, 13, true);

            setCellLife(14, 10, true);
            setCellLife(14, 11, true);
            setCellLife(14, 12, true);
            setCellLife(14, 13, true);

            setCellLife(10, 14, true);
            setCellLife(11, 14, true);
            setCellLife(12, 14, true);
            setCellLife(13, 14, true);

            setCellLife(12, 6, true);
            setCellLife(12, 7, true);
            setCellLife(13, 6, true);
            setCellLife(13, 7, true);

            setCellLife(6, 10, true);
            setCellLife(7, 10, true);
            setCellLife(6, 11, true);
            setCellLife(7, 11, true);

            setCellLife(16, 12, true);
            setCellLife(17, 12, true);
            setCellLife(16, 13, true);
            setCellLife(17, 13, true);

            setCellLife(10, 16, true);
            setCellLife(11, 16, true);
            setCellLife(10, 17, true);
            setCellLife(11, 17, true);

            setCellLife(12, 11, true);
            setCellLife(13, 12, true);
            setCellLife(11, 13, true);
            break;
    }
    updateCells();
});

$("#gameRunButton").click(function() {
    if(!running) {
        startLoop();
    } else {
        stopLoop();
    }
});

$("#gameClearButton").click(function() {
    tempCellList.fill(false);
    updateCells();
    $("#gameLayoutPresets").prop("selectedIndex", -1);
});

$("#gameSpeedDisplay").text(curSpeed.toFixed(1));
$("#gameSpeedRange").change(function() {
    curSpeed = parseFloat(this.value);
    $("#gameSpeedDisplay").text(curSpeed.toFixed(1));
    if(running) {
        stopLoop();
        startLoop();
    }
});

$(".cell").click(function() {
    $(this).toggleClass("alive");

    var xPos = this.cellIndex;
    var yPos = this.parentElement.rowIndex;
    setCellLife(xPos, yPos, $(this).hasClass("alive"));
    updateCells();
});

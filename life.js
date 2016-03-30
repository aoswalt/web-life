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


function get1dIndex(x, y) {
    return x + y * width;
}

function setCellLife(x, y, life) {
    var id = get1dIndex(x, y);
    tempCellList[id] = life;
}

function updateCells() {
    activeCellList = tempCellList.slice();
    $("tr").each(function(r, row) {
        var rowArr = [];
        $(row).children(".cell").each(function(c, cell) {
            var $cell = $(cell);
            var alive = activeCellList[get1dIndex(c, r)];

            if(alive && !$cell.hasClass("alive")) {
                $cell.addClass("alive");
            } else if(!alive) {
                $cell.removeClass("alive");
            }
        });
    });
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


setCellLife(4, 4, true);
setCellLife(2, 7, true);
updateCells();

//alert(cellCount + "  " + width + "  " + height + "  " + activeCellList.length);

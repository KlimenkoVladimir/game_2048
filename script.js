import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const field = document.getElementById("field");
let win;
const grid = new Grid(field);
grid.getRandomEmptyCell().linkTile(new Tile(field));
grid.getRandomEmptyCell().linkTile(new Tile(field));
setupInputOnce();

let interval;
let recordTime = JSON.parse(localStorage.getItem('recordTime')) || [];
let newRecord = ''

window.addEventListener("keydown", handleStartTime, {once: true});


function setupInputOnce() {
    if(typeof win !== 'undefined') {
        console.log('c')
    }else {
        window.addEventListener("keydown", handleInput, {once: true});
    }
}

async function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            if(!canMoveUp()) {
                setupInputOnce();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if(!canMoveDown()) {
                setupInputOnce();
                return;
            }
            await moveDown();
            break;
        case "ArrowLeft":
            if(!canMoveLeft()) {
                setupInputOnce();
                return;
            }
            await moveLeft()
            break;
        case "ArrowRight":
            if(!canMoveRight()) {
                setupInputOnce();
                return;
            }
            await moveRight()
            break;
        default:
            setupInputOnce();
            return;
    }


    const newTile = new Tile(field);
    grid.getRandomEmptyCell().linkTile(newTile);

    if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd()
        alert('lose')
    }

    isWin(grid.cells); 

    setupInputOnce();
}


async function moveUp() {
    await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
    await slideTiles(grid.cellsGroupedByReversedColumn)
}

async function moveLeft() {
    await slideTiles(grid.cellsGroupedByRow)
}

async function moveRight() {
    await slideTiles(grid.cellsGroupedByReversedRow)
}

async function slideTiles(groupedCells) {
    const promises = [];
    groupedCells.forEach(group => slideTilesInGroup(group, promises));

    await Promise.all(promises);

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles();
    })

}

function slideTilesInGroup(group, promises) {
    for (let i = 1; i < group.length; i++) {
       if (group[i].isEmpty()) {
        continue;
       }
       
       const cellWithTile = group[i];

       let targetCell;
       let j = i - 1;
       while (j>=0 && group[j].canAccept(cellWithTile.linkedTile)) {
            targetCell = group[j];
            j--;
       }

       if (!targetCell) {
        continue;
       }

       promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

       if (targetCell.isEmpty()){
        targetCell.linkTile(cellWithTile.linkedTile)
       } else {
        targetCell.linkTileForMerge(cellWithTile.linkedTile)
       }

       cellWithTile.unlinkTile();   
    }
}

function canMoveUp() {
    return canMove(grid.cellsGroupedByColumn);
}
function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColumn);
}
function canMoveLeft() {
    return canMove(grid.cellsGroupedByRow);
}
function canMoveRight() {
    return canMove(grid.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
    return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
    return group.some((cell, index) => {
        if(index === 0) {
            return false;
        }
        if(cell.isEmpty()) {
            return false;
        }

        const targetCell = group[index - 1];
        return targetCell.canAccept(cell.linkedTile);
    });
}

//Секундомер

let mil = 0;
let sec = 0;
let min =0;
const milBtn = document.getElementById("milisecond");
const secBtn = document.getElementById("second");
const minBtn = document.getElementById("minut");

function startTime() {
    if(mil < 10) {
        milBtn.innerHTML = '0' + mil;
    } else if(mil < 99) {
        milBtn.innerHTML = mil;
        
    }else if(mil > 99) {
        sec++;
        secBtn.innerHTML = '0' + sec;
        milBtn.innerHTML = '00';
        mil = 0;
        
    }
    if(sec > 9) {
        secBtn.innerHTML = sec;
    }
    if(sec > 59) {
        min++;
        minBtn.innerHTML = '0' + min
        secBtn.innerHTML = '00';
        sec = 0;
    }
    mil++;
}

function stopTime() {
    clearInterval(interval)
}

function handleStartTime(event) {
    if(event.key === 'ArrowUp' || 'ArrowDown' || 'ArrowLeft' || 'ArrowRight') {
        interval = setInterval(startTime, 10)
    }
}

function isWin(cells) {
    cells.forEach((cell) => {
        if (cell.linkedTile !== undefined && cell.linkedTile !== null && cell.linkedTile.value === 8) {
            win = 'defined';
            stopTime();
            //localStorage.setItem('recordTime', JSON.stringify(recordTime));
            let newTime = [min, sec, mil - 1];
            let recordTimeNum
            localStorage.setItem('newTime', JSON.stringify(newTime));
            if(localStorage.getItem('recordTime') === null) {
                recordTimeNum = 10000000000;
            } else {
                recordTimeNum = JSON.parse(localStorage.getItem('recordTime'))[0] * 60000 + JSON.parse(localStorage.getItem('recordTime'))[1] * 1000 + JSON.parse(localStorage.getItem('recordTime'))[2];
            }
            let newTimeNum = newTime[0] * 60000 + newTime[1] *  1000 + newTime[2];
            if(recordTimeNum > newTimeNum || recordTime === []) {
                recordTime = JSON.parse(localStorage.getItem('newTime'));
                console.log('new record');
                newRecord = 'New record!'
            }
            localStorage.setItem('recordTime', JSON.stringify(recordTime));
            let record = `${JSON.parse(localStorage.getItem('recordTime'))[0]}:${JSON.parse(localStorage.getItem('recordTime'))[1]}:${JSON.parse(localStorage.getItem('recordTime'))[2]}`;
            document.getElementById("record").innerHTML = `Record<br>${record}<br>${newRecord}`;
            fieldBackground();
        }
    });
}

function fieldBackground() {
    let winElement = document.createElement("div");
    winElement.setAttribute("id", "fieldBackground")
    field.appendChild(winElement);
    winElement.innerHTML = 'Win'

}

import { Cell } from "./cell.js";

const gridSize = 4
const gridCount = gridSize * gridSize

export class Grid{
    constructor(gridElement) {
        this.cells = [];
        for (let i = 0; i < gridCount; i++) {
            this.cells.push(
                new Cell(field, i % gridSize, Math.floor(i / gridSize))
            );
            
        }

        this.cellsGroupedByColumn = this.groupCellsByColumn();
        this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column => [...column].reverse());
        this.cellsGroupedByRow = this.groupCellsByRow();
        this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(column => [...column].reverse());
    }

    getRandomEmptyCell() {
        const emptyCells = this.cells.filter(cell => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length)
        return emptyCells[randomIndex]
    
    }

    groupCellsByColumn() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.x] = groupedCells[cell.x] || [];
            groupedCells[cell.x][cell.y] = cell;
            return groupedCells;
        }, [])
    }

    groupCellsByRow() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || [];
            groupedCells[cell.y][cell.x] = cell;
            return groupedCells;
        }, [])
    }
}
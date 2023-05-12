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
    }
}
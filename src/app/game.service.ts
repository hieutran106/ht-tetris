import { Injectable } from "@angular/core";
import { COLS, ROWS } from './constants';
import { IPiece } from './piece';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    /**
     * Check collision
     * @param p
     * @param board
     */
    valid(p: IPiece, board: number[][]): boolean {
        const rows = p.shape.length;
        const cols = p.shape[0].length;
        for (let row = 0; row < rows; row++)
            for (let col = 0; col < cols; col++) {
                const value = p.shape[row][col];
                // skip if empty cell
                if (value === 0) {
                    continue;
                }
                const x = p.x + col;
                const y = p.y + row;
                if (this.outsideWalls(x) || this.underFloor(y) || this.occupied(board, x, y)) {
                    return false;
                }
            }
        return true;
    }

    outsideWalls(x: number): boolean {
        const result = x < 0 || x >= COLS;
        if (result) {
            console.log(`Outside wall x=${x}`);
        }
        return result;
    }

    underFloor(y: number): boolean {
        const result = y >= ROWS;
        if (result) {
            console.log(`Under floor y=${ROWS}`);
        }
        return result;
    }

    occupied(board: number[][], col: number, row: number) {
        const result = board[row][col] !== 0;
        if (result) {
            console.log(`occupied board[x][y]= board[${col}][${row}] = ${board[col][row]}`);
        }
        return result;
    }

    /**
     * Matrix rotation by 90 degress - clockwise, by
     *  1 - Find the transpose of the matrix
     *  2 - Reverse every rows of the matrix
     * @param piece
     */
    rotate(piece: IPiece): IPiece {
        const rows = piece.shape.length;
        const cols = piece.shape[0].length;

        const shapeClone = Array.from({ length: rows }, () => Array(cols).fill(0));
        // 1 - Transpose the original matrix
        for (let row = 0; row < rows; row++)
            for (let col = 0; col < cols; col++) {
                shapeClone[row][col] = piece.shape[col][row]
            }

        // 2 - reverse each row
        shapeClone.forEach(row => row.reverse());
        return {
            x: piece.x,
            y: piece.y,
            color: piece.color,
            shape: shapeClone
        }
    }
}
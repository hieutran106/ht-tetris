export interface IPiece {
    // x, y - position on the board
    x: number;
    y: number;
    color: string;
    shape: number[][];
}

export class Piece implements IPiece {
    x: number;
    y: number;
    color: string;
    shape: number[][];
    constructor(private ctx: CanvasRenderingContext2D) {

    }

    spawn() {
        this.color = "blue";
        this.shape = [[2, 0, 0], [2, 2, 2], [0, 0, 0]];

        // position where the shape spawns
        this.x = 3;
        this.y = 0;
    }

    draw() {
        const rows = this.shape.length;
        const cols = this.shape[0].length;
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++) {
                const value = this.shape[i][j];
                if (value > 0) {
                    this.ctx.fillStyle = this.color;

                    const currentX = this.x + j;
                    const currentY = this.y + i;

                    this.ctx.fillRect(currentX, currentY, 1, 1);
                }
            }
    }

    /**
     * Move current piece to position x, y
     * @param p
     */
    move(p: IPiece) {
        this.x = p.x;
        this.y = p.y;
        this.shape = p.shape;
    }
}
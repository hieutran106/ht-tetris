import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { COLS, BLOCK_SIZE, ROWS, KEY } from "../constants";
import { GameService } from '../game.service';
import { IPiece, Piece } from '../piece';

@Component({
  selector: 'game-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @ViewChild("board", { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  points: number;
  lines: number;
  level: number;

  board: number[][];
  piece: Piece;

  moves = {
    [KEY.LEFT]: (p: IPiece) => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p: IPiece) => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: (p: IPiece) => ({ ...p, y: p.y + 1 })
  }

  /**
   * Listen to keyboard event
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.moves[event.key]) {
      // If the event.key exist in our moves, stop the event from bubbling
      event.preventDefault();
      // get the next state of the piece
      const p = this.moves[event.key](this.piece);
      if (this.service.valid(p, this.board)) {
        this.piece.move(p);
        // clear the old position
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // draw the new position
        this.piece.draw();
      }


    }
  }

  constructor(private service: GameService) { }

  ngOnInit(): void {
    this.initBoard();
  }

  initBoard() {
    // Get the 2D context
    this.ctx = this.canvas.nativeElement.getContext("2d");

    // calculate size of canvas from constants
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  play() {
    this.board = this.getEmptyBoard();
    this.piece = new Piece(this.ctx);
    this.piece.spawn();
    this.piece.draw();
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }
}

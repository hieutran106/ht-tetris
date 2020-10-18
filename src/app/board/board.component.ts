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
    [KEY.DOWN]: (p: IPiece) => ({ ...p, y: p.y + 1 }),
    [KEY.SPACE]: (p: IPiece) => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: (p: IPiece) => this.service.rotate(p)
  }

  time = { start: 0, elapsed: 0, level: 1000 };
  requestId: number;
  /**
   * Listen to keyboard event
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.moves[event.code]) {
      // If the event.key exist in our moves, stop the event from bubbling
      event.preventDefault();
      // get the next state of the piece
      let p = this.moves[event.code](this.piece);

      if (event.code === KEY.SPACE) {
        // Hard drop, drops the tetromino until it collides with something
        while (this.service.valid(p, this.board)) {
          this.piece.move(p);
          p = this.moves[KEY.DOWN](this.piece);
        }


        this.draw();
      } else if (this.service.valid(p, this.board)) {
        this.piece.move(p);
        this.draw();
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

    this.animate();
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  /**
   * Draw the board game
   */
  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.piece.draw();
    this.drawBoard();
  }

  /**
   * Draw the game board
   */
  private drawBoard() {

  }

  private animate(now: number = 0) {
    console.log(this.time);
    this.time.elapsed = now - this.time.start;
    // If elapsed time has passed time for current level, drop the piece

    if (this.time.elapsed > this.time.level) {
      this.time.start = now;
      if (!this.drop()) {
        console.log('Game over');
      }
    }

    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  private drop(): boolean {
    let p = this.moves[KEY.DOWN](this.piece);
    if (this.service.valid(p, this.board)) {
      this.piece.move(p);
      return true;
    } else {
      console.log('Cannot move');
      return false;
    }
  }
}

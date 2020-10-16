import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COLS, BLOCK_SIZE, ROWS } from "../constants";
import { Piece } from '../piece';

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

  constructor() { }

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
    const piece = new Piece(this.ctx);
    piece.spawn();
    piece.draw();
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }
}

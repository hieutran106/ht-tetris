import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COLS, BLOCK_SIZE, ROWS } from "../constants";

@Component({
  selector: 'game-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {

  @ViewChild("board", { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  points: number;
  lines: number;
  level: number;

  constructor() { }

  ngOnInit(): void {
  }

  initBoard() {
    // Get the 2D context
    this.ctx = this.canvas.nativeElement.getContext("2d");

    // calculate size of canvas from constants
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
  }

  play() {

  }
}

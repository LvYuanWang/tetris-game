import { SquareGroup } from "../SquareGroup";
import { GameStatus, GameViewer } from "../types";
import { SquarePageViewer } from "./SquarePageViewer";
import $ from 'jquery';
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

export class GamePageViewer implements GameViewer {
    private nextDom = $('#next');
    private panelDom = $('#panel');
    private startTextDom = $('#start_text');
    private scoreDom = $('#scores');
    private deleteLineDom = $('#deleteLine');
    private deleteLine = 0;
    private maxScoreDom = $('#max_scores');

    // 键盘按钮元素
    private pauseBtnDom = $('#pauseBtn');
    private renewBtnDom = $('#renewBtn');
    private directlydownBtnDom = $('#ctl_squ_directlyDown');
    private leftBtnDom = $('#left_mobile_btn');
    private rightBtnDom = $('#right_mobile_btn');
    private rotateBtnDom = $('#rotate_mobile_btn');
    private bottomBtnDom = $('#bottom_mobile_btn');


    showDeleteLine(lines: number): void {
        this.deleteLine += lines;
        this.deleteLineDom.text(this.deleteLine.toString())
    }

    showScore(score: number): void {
        this.scoreDom.text(score.toString())
    }

    gameOver(): void {
        this.startTextDom.text('游戏结束')
    }

    init(game: Game): void {
        this.startTextDom.text('未开始')
        this.scoreDom.text('0')
        this.deleteLineDom.text('0')
        this.maxScoreDom.text(window.localStorage.getItem('maxScore') || '0');
        this.nextDom.css({
            width: GameConfig.nextSize.width * PageConfig.SquareSize.width,
            height: GameConfig.nextSize.height * PageConfig.SquareSize.height,
            gridTemplateColumns: `repeat(auto-fill, ${PageConfig.SquareSize.width}px)`
        })
        this.panelDom.css({
            width: GameConfig.panelSize.width * PageConfig.SquareSize.width,
            height: GameConfig.panelSize.height * PageConfig.SquareSize.height,
            gridTemplateColumns: `repeat(auto-fill, ${PageConfig.SquareSize.width}px)`
        })
        this.initContainer();
        this.keyEvent(game);
        this.btnClickEvent(game);
    }

    showNext(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            sq.viewer = new SquarePageViewer(sq, $('#next'));
        })
    }

    switch(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            sq.viewer?.remove();
            sq.viewer = new SquarePageViewer(sq, $('#panel'));
        })
    }

    private initContainer() {
        for (let i = 0; i < GameConfig.panelSize.height; i++) {
            for (let j = 0; j < GameConfig.panelSize.width; j++) {
                $('<div>').addClass('square bg-block').appendTo(this.panelDom);
            }
        }
        for (let i = 0; i < GameConfig.nextSize.height; i++) {
            for (let j = 0; j < GameConfig.nextSize.width; j++) {
                $('<div>').addClass('square bg-block').appendTo(this.nextDom);
            }
        }
    }

    private keyEvent(game: Game) {
        $(document).on('keydown', e => {
            switch (e.code) {
                case "Enter":
                    this.pauseBtnDom.addClass('click_btn');
                    if (game.gameStatus === GameStatus.over) {
                        return;
                    }
                    game.gameStatus === GameStatus.playing ? (game.pause(), this.startTextDom.text('暂停')) : (game.start(), this.startTextDom.text('进行中'));
                    break;
                case "ArrowLeft":
                    this.leftBtnDom.addClass('click_btn');
                    game.controlLeft();
                    break;
                case "ArrowRight":
                    this.rightBtnDom.addClass('click_btn');
                    game.controlRight();
                    break;
                case "ArrowDown":
                    this.bottomBtnDom.addClass('click_btn');
                    game.controlDown();
                    break;
                case "ArrowUp":
                    this.rotateBtnDom.addClass('click_btn');
                    game.controlRotate();
                    break;
                case "Space":
                    this.directlydownBtnDom.addClass('click_btn');
                    game.controlDirectlyDown();
                    break;
                case "KeyR":
                    this.renewBtnDom.addClass('click_btn');
                    game.startAgain();
                    this.startTextDom.text('进行中');
                    this.deleteLine = 0;
                    this.deleteLineDom.text('0');
                    this.maxScoreDom.text(window.localStorage.getItem('maxScore') || '0');
                    break;
                default:
                    break;
            }
        })
        $(document).on('keyup', e => {
            switch (e.code) {
                case "Enter":
                    this.pauseBtnDom.removeClass('click_btn');
                    break;
                case "ArrowLeft":
                    this.leftBtnDom.removeClass('click_btn');
                    break;
                case "ArrowRight":
                    this.rightBtnDom.removeClass('click_btn');
                    break;
                case "ArrowDown":
                    this.bottomBtnDom.removeClass('click_btn');
                    break;
                case "ArrowUp":
                    this.rotateBtnDom.removeClass('click_btn');
                    break;
                case "Space":
                    this.directlydownBtnDom.removeClass('click_btn');
                    break;
                case "KeyR":
                    this.renewBtnDom.removeClass('click_btn');
                    break;
                default:
                    break;
            }
        })
    }

    private btnClickEvent(game: Game) {
        this.pauseBtnDom.on('mousedown', () => {
            this.pauseBtnDom.addClass('click_btn');
            if (game.gameStatus === GameStatus.over) {
                return;
            }
            game.gameStatus === GameStatus.playing ? (game.pause(), this.startTextDom.text('暂停')) : (game.start(), this.startTextDom.text('进行中'));
            this.pauseBtnDom.on('mouseup', () => {
                this.pauseBtnDom.removeClass('click_btn');
            })
        })
        this.renewBtnDom.on('mousedown', () => {
            this.renewBtnDom.addClass('click_btn');
            game.startAgain();
            this.startTextDom.text('进行中');
            this.deleteLine = 0;
            this.deleteLineDom.text('0');
            this.maxScoreDom.text(window.localStorage.getItem('maxScore') || '0');
            this.renewBtnDom.on('mouseup', () => {
                this.renewBtnDom.removeClass('click_btn');
            })
        })
        this.directlydownBtnDom.on('mousedown', () => {
            this.directlydownBtnDom.addClass('click_btn');
            game.controlDirectlyDown();
            this.directlydownBtnDom.on('mouseup', () => {
                this.directlydownBtnDom.removeClass('click_btn');
            })
        })
        this.leftBtnDom.on('mousedown', () => {
            this.leftBtnDom.addClass('click_btn');
            game.controlLeft();
            this.leftBtnDom.on('mouseup', () => {
                this.leftBtnDom.removeClass('click_btn');
            })
        })
        this.rightBtnDom.on('mousedown', () => {
            this.rightBtnDom.addClass('click_btn');
            game.controlRight();
            this.rightBtnDom.on('mouseup', () => {
                this.rightBtnDom.removeClass('click_btn');
            })
        })
        this.rotateBtnDom.on('mousedown', () => {
            this.rotateBtnDom.addClass('click_btn');
            game.controlRotate();
            this.rotateBtnDom.on('mouseup', () => {
                this.rotateBtnDom.removeClass('click_btn');
            })
        })
        this.bottomBtnDom.on('mousedown', () => {
            this.bottomBtnDom.addClass('click_btn');
            game.controlDown();
            this.bottomBtnDom.on('mouseup', () => {
                this.bottomBtnDom.removeClass('click_btn');
            })
        })
    }
}
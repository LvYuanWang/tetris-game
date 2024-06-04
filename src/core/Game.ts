import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRules } from "./TerisRules";
import { GameStatus, GameViewer, MoveDirection } from "./types";

export class Game {
    // 游戏状态
    private _gameStatus: GameStatus;
    // 当前玩家操作的方块
    private _curTeris?: SquareGroup;
    // 下一个方块
    private _nextTeris: SquareGroup;
    // 定时器
    private _timer?: number;
    // 自动下落的间隔时间
    private _duration: number;
    // 当前在面板中已存在的方块
    private _exsits: Square[] = [];
    // 积分
    private _score: number = 0;

    constructor(private _viewer: GameViewer) {
        this._duration = 1000;
        this._gameStatus = GameStatus.init;
        this._nextTeris = createTeris({ x: 0, y: 0 }); // 此代码只是为了让ts不报错, 实际上在startAgain()方法中已经初始化了
        this.createNextTeris();
        this._viewer.init(this);
    }

    get gameStatus() {
        return this._gameStatus;
    }

    get score() {
        return this._score;
    }

    set score(val) {
        this._score = val;
        this._viewer.showScore(val);
        // pop()!: 返回数组的最后一个元素, 如果数组为空则返回undefined(感叹号表示不为空)
        const level = GameConfig.levels.filter(it => it.score <= val).pop();
        level && level.duration !== this._duration && (this._duration = level.duration, this._timer && (clearInterval(this._timer), this._timer = undefined, this.autoDrop()));
        // if (level.duration !== this._duration) {
        //     this._duration = level.duration;
        //     this._timer && (clearInterval(this._timer), this._timer = undefined, this.autoDrop());
        // }
    }

    /**
     * 游戏开始
     */
    start() {
        if (this._gameStatus === GameStatus.playing) {
            return;
        }
        this._gameStatus = GameStatus.playing;
        if (!this._curTeris) {
            this.switchTeris();
        }
        this.autoDrop();
    }

    /**
     * 游戏暂停
     */
    pause() {
        if (this._gameStatus === GameStatus.playing) {
            this._gameStatus = GameStatus.pause;
            clearInterval(this._timer);
            this._timer = undefined;
        }
    }

    /**
     * 重新开始游戏
     */
    startAgain() {
        this._exsits.forEach(sq => sq.viewer?.remove());
        this._exsits = [];
        this._gameStatus = GameStatus.init;
        this._nextTeris.squares.forEach(sq => sq.viewer?.remove());
        this._curTeris?.squares.forEach(sq => sq.viewer?.remove());
        this.createNextTeris();
        this._curTeris = undefined;
        this.score = 0;
        this.start();
    }

    /**
     * 创建下一个方块
     */
    private createNextTeris() {
        this._nextTeris = createTeris({ x: 0, y: 0 });
        this.resetNextTerisCenterPoint(GameConfig.nextSize.width, this._nextTeris);
        this._viewer.showNext(this._nextTeris);
    }

    controlLeft() {
        if (this._gameStatus === GameStatus.playing) {
            TerisRules.move(this._curTeris!, MoveDirection.left, this._exsits);
        }
    }

    controlRight() {
        if (this._gameStatus === GameStatus.playing) {
            TerisRules.move(this._curTeris!, MoveDirection.right, this._exsits);
        }
    }

    controlDown() {
        if (this._gameStatus === GameStatus.playing) {
            if (!TerisRules.move(this._curTeris!, MoveDirection.down, this._exsits)) {
                this.reachBottom();
            }
        }
    }

    controlDirectlyDown() {
        if (this._gameStatus === GameStatus.playing) {
            TerisRules.MoveDirectly(this._curTeris!, MoveDirection.down, this._exsits);
            this.reachBottom();
        }
    }

    controlRotate() {
        if (this._gameStatus === GameStatus.playing) {
            TerisRules.rotate(this._curTeris!, this._exsits);
        }
    }

    /**
     * 切换方块
     */
    private switchTeris() {
        this._curTeris = this._nextTeris;
        this.resetCurTerisCenterPoint(GameConfig.panelSize.width, this._curTeris);
        this.createNextTeris();
        this._viewer.switch(this._curTeris);
    }

    /**
     * 当前方块自由下落
     */
    private autoDrop() {
        if (this._timer || this._gameStatus !== GameStatus.playing) {
            return;
        }
        this._timer = setInterval(() => {
            if (this._curTeris) {
                if (!TerisRules.move(this._curTeris!, MoveDirection.down, this._exsits)) {
                    this.reachBottom();
                }
            }
        }, this._duration);
    }

    /**
     * 重新根据容器的逻辑宽度,设置当前方块组的x和y坐标,使其居中
     * @param width 容器的逻辑宽度
     * @param teris 方块组对象
     */
    private resetCurTerisCenterPoint(width: number, teris: SquareGroup) {
        const x = (Math.ceil(width / 2) - 1) + Math.floor(Math.random() * [Math.floor(width / 3), -Math.floor(width / 3)][Math.floor(Math.random() * 2)]);
        const y = -1;
        teris.centerPoint = { x, y };
    }

    /**
     * 重新根据容器的逻辑宽度,设置下一个方块组的x和y坐标,使其居中
     * @param width 容器的逻辑宽度
     * @param teris 方块组对象
     */
    private resetNextTerisCenterPoint(width: number, teris: SquareGroup) {
        const x = Math.ceil(width / 2) - 1;
        const y = 0;
        teris.centerPoint = { x, y };
        if (teris.squares.some(sq => sq.point.y < 0)) {
            teris.centerPoint = { x, y: y + 1 };
        }
    }

    /**
     * 到底部之后的操作
     */
    private reachBottom() {
        this._exsits.push(...this._curTeris!.squares);
        const num = TerisRules.deleteSquares(this._exsits);
        // 增加积分
        this.addScore(num);
        // 判断游戏是否结束
        if (this._curTeris?.squares.some(sq => sq.point.y === 0)) {
            // 判断是否创造了新的最高分, 如果是则保存到localStorage
            window.localStorage.getItem('maxScore') ? this.score > Number(window.localStorage.getItem('maxScore')) && window.localStorage.setItem('maxScore', this.score.toString()) : window.localStorage.setItem('maxScore', this.score.toString());
            this._viewer.gameOver();
            this._curTeris?.squares.forEach(sq => sq.point.y < 0 && (sq.viewer?.remove()));
            this._gameStatus = GameStatus.over;
            clearInterval(this._timer);
            this._timer = undefined;
            return;
        } else {
            this.switchTeris();
        }
    }

    /**
     * 增加积分
     * @param num 消除的行数
     */
    private addScore(num: number) {
        num > 0 && (this.score += GameConfig.score[num - 1], this._viewer.showDeleteLine(num));
    }
}
import { Game } from "./Game"
import { SquareGroup } from "./SquareGroup"

export interface Point {
    readonly x: number   // 逻辑坐标x
    readonly y: number   // 逻辑坐标y
}

export interface IViewer {
    /**
     * 显示
     */
    show(): void

    /**
     * 移除,不再显示
     */
    remove(): void
}

/**
 * 小方块形状
 */
export type Shape = Point[]

/**
 * 小方块移动的方向
 */
export enum MoveDirection {
    down,
    left,
    right
}

/**
 * 游戏状态
 */
export enum GameStatus {
    init,  // 未开始
    playing, // 进行中
    pause, // 暂停
    over // 游戏结束
}

export interface GameViewer {
    /**
     * 
     * @param teris 下一个方块对象
     */
    showNext(teris: SquareGroup): void;

    /**
     * 
     * @param teris 切换的方块对象
     */
    switch(teris: SquareGroup): void;

    /**
     * 初始化游戏界面
     * @param game 游戏对象
     */
    init(game: Game): void;

    /**
     * 游戏结束
     */
    gameOver(): void;

    /**
     * 显示分数
     * @param score 分数
     */
    showScore(score: number): void;

    /**
     * 显示消除的行数
     * @param lines 消除的行数
     */
    showDeleteLine(lines: number): void;
}
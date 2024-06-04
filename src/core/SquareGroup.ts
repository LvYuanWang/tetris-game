import { Square } from "./Square";
import { Point, Shape } from "./types";

/**
 * 组合方块
 */
export class SquareGroup {
    private _squares: readonly Square[];

    public get squares() {
        return this._squares;
    }

    public get shape() {
        return this._shape;
    }

    public get centerPoint() {
        return this._centerPoint;
    }

    public set centerPoint(p) {
        this._centerPoint = p;
        // 当中心方块位置改变时重新绘制其他组合方块
        this.setSquarePoints();
    }

    /**
     * 根据中心点坐标,重新计算所有小方块的坐标
     */
    private setSquarePoints() {
        this._shape.forEach((p, i) => {
            this._squares[i].point = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y
            }
        })
    }

    constructor(
        private _shape: Shape,
        private _centerPoint: Point,
    ) {
        const arr: Square[] = [];
        // 根据形状和颜色，创建小方块
        this._shape.forEach(p => {
            const sq = new Square();
            arr.push(sq);
        })
        this._squares = arr;
        this.setSquarePoints();
    }

    // 推导出旋转后的形状(旋转的本质就是得到一个新的形状)
    /*
    顺时针: 
    初始:              顺时针转1下:             顺时针转2下:         顺时针转3下: 
    C                    D                       B
    D A       ->       B A C        ->           A D          ->     C A B
    B                                            C                     D

    初始: A: {x: 0, y: 0}   B: {x: 0, y: 1}   C: {x: 0, y: -1}   D: {x: -1, y: 0}
    转一: A: {x: 0, y: 0}   B: {x: -1, y: 0}   C: {x: 1, y: 0}   D: {x: 0, y: -1}
    转二: A: {x: 0, y: 0}   B: {x: 0, y: -1}   C: {x: 0, y: 1}   D: {x: 1, y: 0}
    转三: A: {x: 0, y: 0}   B: {x: 1, y: 0}   C: {x: -1, y: 0}   D: {x: 0, y: 1}

    总结: 顺时针旋转后的 x = -y, y = x
    由此可知: 逆时针旋转 x = y, y = -x
    */

    /**
     * 是否是顺时针旋转
     */
    protected isClock = true;

    /**
     * 根据旋转的方向,计算出旋转后的形状
     * @returns 旋转后的形状
     */
    afterRotateShape(): Shape {
        if (this.isClock) {
            return this._shape.map(p => {
                const newP: Point = {
                    x: -p.y,
                    y: p.x
                }
                return newP;
            })
        } else {
            return this._shape.map(p => {
                const newP: Point = {
                    x: p.y,
                    y: -p.x
                }
                return newP;
            })
        }
    }

    /**
     * 旋转
     */
    rotate() {
        const newShape = this.afterRotateShape();
        this._shape = newShape;
        this.setSquarePoints();
    }
}
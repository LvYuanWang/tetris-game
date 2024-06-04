import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { MoveDirection, Point, Shape } from "./types";

function isPoint(obj: any): obj is Point {
    return obj.x !== undefined;
}

/**
 * 该类中提供各种函数, 用于判断游戏中的各种规则
 */
export class TerisRules {
    /**
     * 根据形状坐标和目标坐标, 判断是否能移动到目标位置
     */
    static canIMove(shape: Shape, targetPoint: Point, exsits: Square[]): Boolean {
        const targetSquarePoints: Point[] = shape.map(it => {
            return {
                x: it.x + targetPoint.x,
                y: it.y + targetPoint.y
            }
        })
        const isMove = targetSquarePoints.some(p => {
            // 为什么要减1? 因为我们的坐标是从0开始的
            // return p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y < 0 || p.y > GameConfig.panelSize.height - 1
            return p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y > GameConfig.panelSize.height - 1
        })

        // 判断是否与已有的方块有重叠
        return isMove ? false : !targetSquarePoints.some(p => exsits.some(sq => sq.point.x === p.x && sq.point.y === p.y));
    }

    /**
     * 是否能移动到目标位置, 如果可以移动, 则移动
     * @param shape 组合的方块
     * @param targetPointOrMoveDirection 方块移动的目标或者移动的方向
     * @returns 
     */
    static move(shape: SquareGroup, targetPointOrMoveDirection: Point, exsits: Square[]): Boolean;
    static move(shape: SquareGroup, targetPointOrMoveDirection: MoveDirection, exsits: Square[]): Boolean;
    static move(shape: SquareGroup, targetPointOrMoveDirection: Point | MoveDirection, exsits: Square[]): Boolean {
        if (isPoint(targetPointOrMoveDirection)) {
            if (this.canIMove(shape.shape, targetPointOrMoveDirection, exsits)) {
                shape.centerPoint = targetPointOrMoveDirection;
                return true;
            }
            return false;
        } else {
            let targetPoint: Point;
            switch (targetPointOrMoveDirection) {
                case MoveDirection.down:
                    targetPoint = {
                        x: shape.centerPoint.x,
                        y: shape.centerPoint.y + 1
                    }
                    break;
                case MoveDirection.left:
                    targetPoint = {
                        x: shape.centerPoint.x - 1,
                        y: shape.centerPoint.y
                    }
                    break;
                default:
                    targetPoint = {
                        x: shape.centerPoint.x + 1,
                        y: shape.centerPoint.y
                    }
                    break;
            }
            return this.move(shape, targetPoint, exsits);
        }
    }

    /**
     * 将当前的方块移动到目标的终点
     * @param shape 组合的方块
     * @param direction 移动的方向
     */
    static MoveDirectly(shape: SquareGroup, direction: MoveDirection, exsits: Square[]) {
        while (this.move(shape, direction, exsits)) { }
    }

    /**
     * 判断该位置是否能旋转,如果能,则旋转
     * @param shape 组合方块
     */
    static rotate(shape: SquareGroup, exsits: Square[]): Boolean {
        const afterRotateShape = shape.afterRotateShape();
        if (this.canIMove(afterRotateShape, shape.centerPoint, exsits)) {
            shape.rotate();
            return true;
        }
        return false;
    }

    /**
     * 消除方块
     * @param exsits 当前面板中的所有方块
     * @returns 消除的行数
     */
    static deleteSquares(exsits: Square[]): number {
        // 获取当前面板中方块所有的y坐标
        const ys = exsits.map(sq => sq.point.y);
        const maxY = Math.max(...ys);
        const minY = Math.min(...ys);
        let num = 0;
        for (let y = minY; y <= maxY; y++) {
            if (this.deleteLine(exsits, y)) {
                num++;
            }
        }
        return num;
    }

    /**
     * 消除一行
     * @param exsits 当前面板中的所有方块
     * @param y 方块中的y坐标
     */
    private static deleteLine(exsits: Square[], y: number): Boolean {
        const sameYs = exsits.filter(sq => sq.point.y === y);
        if (sameYs.length === GameConfig.panelSize.width) {
            /* 在这里有个bug,发生事件尚不知,以后再解决 */
            // console.log(sameYs);
            // console.log('消除一行方块')
            // return false;
            sameYs.forEach(sq => {
                // 从界面上移除
                sq.viewer?.remove();
                // 从exists数组中移除该方块
                const index = exsits.indexOf(sq);
                exsits.splice(index, 1);
            })
            // 改变界面其他方块的y坐标
            exsits.filter(sq => sq.point.y < y).forEach(sq => {
                sq.point = {
                    x: sq.point.x,
                    y: sq.point.y + 1
                }
            })
            return true;
        }
        return false;
    }
}
import { SquareGroup } from "./SquareGroup";
import { Point, Shape } from "./types";
import { getRandom } from "./utils";

export class OShape extends SquareGroup {
    constructor(_centerPoint: Point) {
        super([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], _centerPoint)
    }

    afterRotateShape(): Shape {
        return this.shape;
    }
}

export class IShape extends SquareGroup {
    constructor(_centerPoint: Point) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], _centerPoint)
    }

    rotate() {
        super.rotate();
        this.isClock = !this.isClock;
    }
}

export class SShape extends SquareGroup {
    constructor(_centerPoint: Point) {
        super([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }], _centerPoint)
    }

    rotate() {
        super.rotate();
        this.isClock = !this.isClock;
    }
}

export class ZShape extends SquareGroup {
    constructor(_centerPoint: Point) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], _centerPoint)
    }

    rotate() {
        super.rotate();
        this.isClock = !this.isClock;
    }
}

export class LShape extends SquareGroup {
    constructor(_centerPoint: Point) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }], _centerPoint)
    }
}

export class JShape extends SquareGroup {
    constructor(_centerPoint: Point) {
        super([{ x: -1, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }], _centerPoint)
    }
}

export class TShape extends SquareGroup {
    constructor(_centerPoint: Point) {
        super([{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }], _centerPoint)
    }
}

export const shapes = [OShape, IShape, SShape, ZShape, LShape, JShape, TShape];

/**
 * 随机产生一个俄罗斯方块(颜色随机,形状随机)
 * @param centerPoint 
 */
export function createTeris(centerPoint: Point) {
    const index = getRandom(0, shapes.length);
    const shape = shapes[index];
    return new shape(centerPoint);
}
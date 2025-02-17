import { IViewer, Point } from "./types";

/**
 * 小方块
 */
export class Square {
    private _point: Point = { x: 0, y: 0 };

    // 属性: 显示者
    private _viewer?: IViewer

    public get viewer() {
        return this._viewer;
    }

    public set viewer(v) {
        this._viewer = v;
        if (v) {
            v.show();
        }
    }

    public get point() {
        return this._point;
    }

    public set point(val) {
        this._point = val;
        // 完成显示
        if (this._viewer) {
            this._viewer.show();
        }
    }
}
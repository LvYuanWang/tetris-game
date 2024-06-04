import { Square } from "../Square";
import { IViewer } from "../types";
import $ from "jquery";
import PageConfig from "./PageConfig";

/**
 * 小方块的显示和删除
 */
export class SquarePageViewer implements IViewer {
    private dom?: JQuery<HTMLElement>;
    private isRemove: boolean = false;  // 是否已经被移除

    show(): void {
        if (this.isRemove) {
            return;
        }
        if (!this.dom) {
            this.dom = $('<div>').addClass('square cur-block').css({
                width: PageConfig.SquareSize.width,
                height: PageConfig.SquareSize.height,
            }).appendTo(this.container)
        }
        this.dom.css({
            left: this.square.point.x * PageConfig.SquareSize.width,
            top: this.square.point.y * PageConfig.SquareSize.height,
        })
    }

    remove(): void {
        if (this.dom && !this.isRemove) {
            this.dom.remove();
            this.isRemove = true;
        }
    }

    constructor(
        private square: Square,
        private container: JQuery<HTMLElement>
    ) { }
}
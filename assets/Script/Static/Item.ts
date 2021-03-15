import { Rect } from './Quadtree';

const { ccclass } = cc._decorator;

@ccclass
export default class Item extends cc.Component implements Rect {
    public width: number;

    public height: number;

    public x: number;

    public y: number;

    public init(rect: Rect) {
        this.width = rect.width;
        this.height = rect.height;
        this.x = rect.x;
        this.y = rect.y;
        this.node.setPosition(rect.x + rect.width / 2, rect.y + rect.height / 2);
        this.node.setContentSize(rect.width, rect.height);
    }

    public changeWhite() {
        this.node.color = cc.Color.WHITE;
    }

    public changeBlue() {
        this.node.color = cc.Color.BLUE;
    }
}

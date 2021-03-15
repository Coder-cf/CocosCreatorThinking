import BezierMovething from './BezierMovething';

const { ccclass, property } = cc._decorator;

const SAVE = 4; // 保留几位小数

type PointLike = {
    x: number;
    y: number;
};

export type Output = {
    start: PointLike;
    control1: PointLike;
    control2?: PointLike;
    end: PointLike;
};

@ccclass
export default class BezierItem extends cc.Component {
    @property(cc.Node)
    controlNode2: cc.Node = null;

    @property(cc.Node)
    controlNode1: cc.Node = null;

    @property(cc.Node)
    startNode: cc.Node = null;

    @property(cc.Node)
    endNode: cc.Node = null;

    @property(cc.Graphics)
    graphics: cc.Graphics = null;

    @property([cc.Label])
    labels: cc.Label[] = [];

    private isThree = true;

    private myGraColor: cc.Color = null;

    start() {
        this.node.on(BezierMovething.MOVE_ONE, this.draw, this);
    }

    public init(position: cc.Vec2, isThree: boolean, index: number, color: cc.Color) {
        this.isThree = isThree;
        // 设置初始位置
        this.startNode.setPosition(0, 0);
        this.controlNode1.setPosition(50, 50);
        this.controlNode2.setPosition(100, 50);
        this.endNode.setPosition(150, 0);

        this.controlNode2.active = isThree;
        this.node.setPosition(position);
        this.myGraColor = color;
        this.renderLabels(index);
        this.draw();
    }

    private renderLabels(index: number) {
        this.labels.forEach((item) => {
            item.string = `${index}`;
        });
    }

    public initFour(first: cc.Vec2, control1: cc.Vec2, end: cc.Vec2, control2: cc.Vec2, index: number) {
        if (control2) {
            this.isThree = true;
            this.controlNode2.active = true;
            this.controlNode2.setPosition(control2);
        } else {
            this.isThree = false;
            this.controlNode2.active = false;
        }
        this.startNode.setPosition(first);
        this.controlNode1.setPosition(control1);
        this.endNode.setPosition(end);
        this.node.setPosition(cc.Vec2.ZERO);
        this.renderLabels(index);
        this.draw();
    }

    public draw() {
        this.graphics.clear();
        this.graphics.strokeColor = this.myGraColor;
        this.graphics.lineWidth = 3;
        this.graphics.moveTo(this.startNode.x, this.startNode.y);
        if (this.isThree) {
            this.graphics.bezierCurveTo(
                this.controlNode1.x,
                this.controlNode1.y,
                this.controlNode2.x,
                this.controlNode2.y,
                this.endNode.x,
                this.endNode.y
            );
        } else {
            this.graphics.quadraticCurveTo(this.controlNode1.x, this.controlNode1.y, this.endNode.x, this.endNode.y);
        }
        this.graphics.stroke();
    }

    public getEndNodePosition() {
        return this.endNode.getPosition();
    }

    public getOutputObj(): Output {
        const parentNode = this.node.parent.parent.parent;

        const startPoint = this.startNode.getPosition();

        const startPosition: cc.Vec2 = parentNode.convertToNodeSpaceAR(
            this.startNode.convertToWorldSpaceAR(cc.Vec2.ZERO)
        );

        const control1Position: cc.Vec2 = startPosition.add(this.controlNode1.getPosition().sub(startPoint));

        const endPosition: cc.Vec2 = startPosition.add(this.endNode.getPosition().sub(startPoint));

        const obj: Output = {
            start: { x: this.transform(startPosition.x), y: this.transform(startPosition.y) },
            control1: { x: this.transform(control1Position.x), y: this.transform(control1Position.y) },
            end: { x: this.transform(endPosition.x), y: this.transform(endPosition.y) },
        };
        if (this.isThree) {
            const control2Position: cc.Vec2 = startPosition.add(this.controlNode2.getPosition().sub(startPoint));
            obj.control2 = { x: this.transform(control2Position.x), y: this.transform(control2Position.y) };
        }
        return obj;
    }

    private transform(num: number) {
        const bate = 10 ** SAVE;
        return Math.round(num * bate) / bate;
    }
}

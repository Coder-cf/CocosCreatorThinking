import BezierItem, { Output } from './BezierItem';

const { ccclass, property, executeInEditMode } = cc._decorator;

const SPECIAL = ',';

@ccclass
@executeInEditMode
export default class BezierManager extends cc.Component {
    @property({ type: cc.Node, tooltip: '单个贝塞尔节点' })
    prefabNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: '可移动节点' })
    touchNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: '可移动节点' })
    points: cc.Node = null;

    @property({ type: cc.EditBox, tooltip: '可移动节点' })
    editbox: cc.EditBox = null;

    private isThree = true; // 是三阶贝塞尔

    private nextIndex = 0; // 下一个的索引

    private myGraColor: cc.Color = cc.Color.BLACK;

    start() {
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            this.touchNode.setPosition(this.node.convertToNodeSpaceAR(event.getLocation()));
        });
        this.editbox.node.on('editing-did-ended', () => {
            const text = this.editbox.string;
            const list = text.split(SPECIAL);
            if (list.length === 3) {
                const R = Number(list[0]);
                const G = Number(list[1]);
                const B = Number(list[2]);
                if (
                    !Number.isNaN(R) &&
                    R <= 255 &&
                    R >= 0 &&
                    !Number.isNaN(G) &&
                    G <= 255 &&
                    G >= 0 &&
                    !Number.isNaN(B) &&
                    B <= 255 &&
                    B >= 0
                ) {
                    this.myGraColor.setR(R);
                    this.myGraColor.setG(G);
                    this.myGraColor.setB(B);
                    this.points.children.forEach((node) => {
                        node.getComponent(BezierItem).draw();
                    });
                } else {
                    this.transformColor();
                }
            } else {
                this.transformColor();
            }
        });
    }

    private transformColor() {
        const color = this.myGraColor;
        this.editbox.string = `${color.r}${SPECIAL}${color.g}${SPECIAL}${color.b}`;
    }

    public changeType() {
        this.isThree = !this.isThree;
    }

    public itemClick(id, cus: string) {
        switch (cus) {
            case '+':
                // eslint-disable-next-line no-case-declarations
                let node: cc.Node = null;
                node = cc.instantiate(this.prefabNode);
                node.active = true;
                this.points.addChild(node);
                node.getComponent(BezierItem).init(
                    this.getLastNodePosition(),
                    this.isThree,
                    this.nextIndex++,
                    this.myGraColor
                );
                break;

            case '-':
                // eslint-disable-next-line no-case-declarations
                const list = this.points.children;
                if (list && list.length) {
                    this.nextIndex--;
                    list[list.length - 1].parent = null;
                }
                break;
            case 'out':
                cc.log(this.getJsonStr());
                break;
        }
    }

    private getLastNodePosition() {
        const list = this.points.children;
        let result = cc.Vec2.ZERO;
        if (this.nextIndex && list && list.length) {
            const node = list[this.nextIndex - 1];
            result = node
                .getComponent(BezierItem)
                .getEndNodePosition()
                .add(node.getPosition());
        }
        return result;
    }

    public getJsonStr(): string {
        const result = [];
        const list = this.points.children;
        for (let i = 0, j = this.nextIndex; i < j; i++) {
            result.push(list[i].getComponent(BezierItem).getOutputObj());
        }
        return JSON.stringify(result, null, '\t');
    }

    public createNodeByList(list: Array<Output>) {
        this.node.removeAllChildren();
        this.nextIndex = list.length;
        list.forEach((item, index) => {
            const node = cc.instantiate(this.prefabNode);
            node.getComponent(BezierItem).initFour(item.start, item.control1, item.end, item.control2, index);
            this.node.addChild(node);
        });
    }
}

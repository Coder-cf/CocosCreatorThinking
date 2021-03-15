import Item from './Item';
import Quadtree from './Quadtree';

const { ccclass, property } = cc._decorator;

/**
 * 动态测试类
 * @class Static
 * @extends {cc.Component}
 */
@ccclass
export default class Static extends cc.Component {
    @property(cc.Graphics)
    graphy: cc.Graphics = null;

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Node)
    itemsNode: cc.Node = null;

    private myTree: Quadtree<Item> = null;

    private hasFirst = true;

    private moveNode: cc.Node = null;

    start() {
        this.node.on('touchmove', this.touchmove, this);
        const { width, height } = this.graphy.node;
        this.myTree = new Quadtree({
            x: this.graphy.node.x - width / 2,
            y: this.graphy.node.y - height / 2,
            width,
            height,
        });
        this.graphy.strokeColor = cc.Color.RED;
    }

    private touchmove(event: cc.Event.EventTouch) {
        const world = event.getLocation();
        if (this.hasFirst) {
            this.hasFirst = false;
            this.moveNode = cc.instantiate(this.prefab);
            this.node.addChild(this.moveNode);
            this.moveNode.setContentSize(10, 10);
        }
        this.moveNode.setPosition(this.node.convertToNodeSpaceAR(world));
    }

    public buttonAction(event, cus: string) {
        switch (cus) {
            case '0':
                this.randomOne();
                break;

            case '1':
                for (let i = 0; i < 10; i++) {
                    this.randomOne();
                }
                break;

            case '2':
                this.myTree.clear();
                this.itemsNode.removeAllChildren();
                break;

            default:
                break;
        }
    }

    private randomOne() {
        const node = cc.instantiate(this.prefab);
        this.itemsNode.addChild(node);
        const com = node.getComponent(Item);
        com.init({
            x: Math.random() * this.node.width - this.node.width / 2,
            y: Math.random() * this.node.height - this.node.height / 2,
            width: Math.random() * 100 + 1,
            height: Math.random() * 100 + 1,
        });
        this.myTree.insert(com);
    }

    private drawTree(tree: Quadtree<Item>) {
        const list = tree.getMyNodes();
        if (list.length) {
            const { x, y, width, height } = tree.getMyBound();
            const ctx: cc.Graphics = this.graphy;
            ctx.moveTo(x, y + height / 2);
            ctx.lineTo(x + width, y + height / 2);
            ctx.moveTo(x + width / 2, y + height);
            ctx.lineTo(x + width / 2, y);
            ctx.stroke();
            list.forEach((treeItem) => {
                this.drawTree(treeItem);
            });
        }
        tree.getMyObjects().forEach((obj) => {
            obj.changeWhite();
        });
    }

    update() {
        this.graphy.clear();
        this.drawTree(this.myTree);
        const node = this.moveNode;
        if (!node) return;
        const list = this.myTree.retrieve({
            x: node.x - node.width / 2,
            y: node.y - node.height / 2,
            width: node.width,
            height: node.height,
        });
        list.forEach((item) => {
            item.changeBlue();
        });
    }
}

const { ccclass } = cc._decorator;

const TEM_INDEX = 1;

@ccclass
export default class BezierMovething extends cc.Component {
    public static MOVE_ONE = 'MOVE_ONE';

    start() {
        this.registered();
    }

    private registered() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchend, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchend, this);
    }

    private unRegister() {
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);
    }

    private touchstart(event: cc.Event.EventTouch) {
        this.node.scale *= 1.1;
        this.node.zIndex = TEM_INDEX;
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(event.getLocation()));
        this.fetchOneEvent();
    }

    private touchmove(event: cc.Event.EventTouch) {
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(event.getLocation()));
        this.fetchOneEvent();
    }

    private touchend(event: cc.Event.EventTouch) {
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(event.getLocation()));
        this.fetchOneEvent();
        this.node.scale = 1;
        this.node.zIndex = 0;
    }

    private fetchOneEvent() {
        const event = new cc.Event.EventCustom(BezierMovething.MOVE_ONE, true);
        this.node.dispatchEvent(event);
    }
}

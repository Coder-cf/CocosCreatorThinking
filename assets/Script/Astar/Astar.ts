import MoveMap, { Item } from './Map';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Astar extends cc.Component {
    private openList: Array<Item> = [];

    private closeList: Array<Item> = [];

    private currentMap: MoveMap = null;

    /**
     * 是否支持对角线
     */
    private isAllow = false;

    /**
     * 单线消耗
     *
     * @private
     */
    private nomalCost = 10;

    public setMap(map: MoveMap) {
        this.currentMap = map;
    }

     getH(node) {
        return Math.abs(node.x - this.currentMap.lastNode.x) + Math.abs(node.y - this.currentMap.lastNode.y);
    }
}

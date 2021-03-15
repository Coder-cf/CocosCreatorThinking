export interface Rect {
    width: number;
    height: number;
    /**
     * @type {number} 左下角x轴坐标
     */
    x: number;
    /**
     * @type {number} 左下角y轴坐标
     */
    y: number;
}

export default class Quadtree<T extends Rect> {
    private static readonly maxLevel = 5;

    private static readonly maxObjects = 10;

    private readonly bounds: Rect = null;

    private level: number = 0;

    private nodes: Array<Quadtree<T>> = [];

    private objects: Array<T> = [];

    public constructor(rect: Rect, level: number = 0) {
        this.bounds = rect;
        this.level = level;
    }

    /**
     * 分割四叉树
     */
    private split() {
        const { x, y } = this.bounds;
        const level = this.level + 1;
        const width = this.bounds.width / 2;
        const height = this.bounds.height / 2;
        this.nodes.push(
            new Quadtree({ x: x + width, y, width, height }, level),
            new Quadtree({ x, y, width, height }, level),
            new Quadtree({ x, y: y + height, width, height }, level),
            new Quadtree({ x: x + width, y: y + height, width, height }, level)
        );
    }

    /**
     * 根据包围盒获取在当前四叉树中的象限数组
     * @param {Rect} { x, y, width, height }
     * @return {*}  {Array<number>}
     */
    private getIndex({ x, y, width, height }: Rect): Array<number> {
        const indexes = [];
        const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
        const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

        const startIsNorth = y < horizontalMidpoint;
        const startIsWest = x < verticalMidpoint;
        const endIsEast = x + width > verticalMidpoint;
        const endIsSouth = y + height > horizontalMidpoint;

        // top-right quad
        if (startIsNorth && endIsEast) {
            indexes.push(0);
        }

        // top-left quad
        if (startIsWest && startIsNorth) {
            indexes.push(1);
        }

        // bottom-left quad
        if (startIsWest && endIsSouth) {
            indexes.push(2);
        }

        // bottom-right quad
        if (endIsEast && endIsSouth) {
            indexes.push(3);
        }

        return indexes;
    }

    /**
     * 清空四叉树
     */
    public clear() {
        this.objects.length = 0;

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes.length) {
                this.nodes[i].clear();
            }
        }

        this.nodes.length = 0;
    }

    /**
     * 向四叉树中加入T
     * @param {T} rect
     * 修复完全不在包围盒里也计算进去的问题
     */
    public insert(rect: T) {
        if (
            rect.x + rect.width < this.bounds.x ||
            rect.x > this.bounds.x + this.bounds.width ||
            rect.y + rect.height < this.bounds.y ||
            rect.y > this.bounds.y + this.bounds.height
        )
            return;
        if (this.nodes.length) {
            const list = this.getIndex(rect);
            for (let i = 0, j = list.length; i < j; i++) {
                this.nodes[list[i]].insert(rect);
            }
            return;
        }
        this.objects.push(rect);
        if (this.objects.length > Quadtree.maxObjects && this.level < Quadtree.maxLevel) {
            if (!this.nodes.length) {
                this.split();
            }
            for (let i = 0, j = this.objects.length; i < j; i++) {
                const item = this.objects[i];
                const nums = this.getIndex(item);
                for (let k = 0, m = nums.length; k < m; k++) {
                    this.nodes[nums[k]].insert(item);
                }
            }
            this.objects.length = 0;
        }
    }

    /**
     * 查找可能与指定包围盒碰撞的所有T
     * @param {Rect} rect
     */
    public retrieve(rect: Rect) {
        let returnObjects = this.objects;
        if (this.nodes.length) {
            const list = this.getIndex(rect);
            for (let i = 0, j = list.length; i < j; i++) {
                returnObjects = returnObjects.concat(this.nodes[list[i]].retrieve(rect));
            }
        }
        returnObjects = returnObjects.filter((item, index) => {
            return returnObjects.indexOf(item) >= index;
        });
        return returnObjects;
    }

    // 以下为测试时需要暴露的接口

    public getMyNodes() {
        return this.nodes;
    }

    public getMyBound() {
        return this.bounds;
    }

    public getMyObjects() {
        return this.objects;
    }
}

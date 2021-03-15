/* eslint-disable max-classes-per-file */
export class Item {
    private x = 0;

    private y = 0;

    private isUnable = false;

    private parnet: Item = null;

    private f = 0;

    private g = 0;

    private h = 0;

    public constructor(x: number, y: number, isUnable: boolean) {
        this.x = x;
        this.y = y;
        this.isUnable = isUnable;
    }
}

enum Types {
    Empty = 0,
    End = 2,
    Start = 1,
    Unable = -1,
    Move = 3,
}

export default class MoveMap {
    private config: Array<Array<number>> = null;

    private firstNode: Item = null;

    private lastNode: Item = null;

    private map: Map<string, Item> = null;

    private row = 0;

    private column = 0;

    public init(config: Array<Array<number>>) {
        this.config = config;
        this.map = new Map();
        this.row = this.config.length;
        this.column = this.config[0].length;

        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.column; j++) {
                const num = this.config[i][j];
                const node = new Item(j, i, num === Types.Unable);
                if (num === Types.Start) this.firstNode = node;
                if (num === Types.End) this.lastNode = node;
                this.setNodeById(j, i, node);
            }
        }
    }

    private getNodeById(x: number, y: number) {
        return this.map.get(`${x}-${y}`);
    }

    private setNodeById(x: number, y: number, node: Item) {
        this.map.set(`${x}-${y}`, node);
    }
}

export class MazeCreator {
    // https://algoful.com/Archive/Algorithm/MazeExtend

    #startCells = [];
    #currentWallCells = [];

    constructor(row, column) {
        this.mazeData = this.#init2DArray(row, column);

        // 外周を壁にする
        this.mazeData.forEach((elm, y) => {
            elm.forEach((isWall, x) => {
                if (x === 0 || y === 0 || x === column - 1 || y === row - 1) {
                    this.mazeData[y][x] = 1;
                }
                else if (x % 2 === 0 && y % 2 === 0) {
                    this.#startCells.push([x, y]);
                    console.log(this.#startCells);
                }
            });
        });

        while (this.#startCells.length > 0) {
            const index = Math.floor(Math.random() * this.#startCells.length);
            const cell = this.#startCells[index];
            const x = cell[0];
            const y = cell[1];
            this.#startCells.splice(index, 1);

            if (this.mazeData[y][x] === 0) {
                this.#currentWallCells = [];
                this.#extendWall(x, y);
            }
        }

        return this.mazeData;
    }


    #extendWall(x, y) {
        console.log(x, y);
    };


    #setWall() {

    };


    #init2DArray(m, n, val = 0) {
        return Array.from(new Array(m), () => new Array(n).fill(val));
    };

}
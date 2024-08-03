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
                } else {
                    // this.mazeData[y][x] = 0;
                    
                    if (x % 2 === 0 && y % 2 === 0) {
                        this.#startCells.push([x, y]);
                    }

                }
            });
        });

        console.log("開始候補セル", this.#startCells);



        while (this.#startCells.length > 0) {
            const index = Math.floor(Math.random() * (this.#startCells.length - 1));
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
        console.log(x, y, "を起点に開始します");

        const directions = [];

        if (this.mazeData[y - 1][x] === 0 && !this.#isCurrentWall(x, y - 2)) {
            directions.push("Up");
        }
        if (this.mazeData[y][x + 1] === 0 && !this.#isCurrentWall(x + 2, y)) {
            directions.push("Right");
        }
        if (this.mazeData[y + 1][x] === 0 && !this.#isCurrentWall(x, y + 2)) {
            directions.push("Down");
        }
        if (this.mazeData[y][x - 1] === 0 && !this.#isCurrentWall(x - 2, y)) {
            directions.push("Left");
        }


        console.log("directions", directions);

        if (directions.length > 0) {
            this.#setWall(x, y);

            let isPath = false;
            const dirIndex = Math.floor(Math.random() * (directions.length - 1));


            console.log("抽選結果", dirIndex, directions[dirIndex], "を選びました")

            switch (directions[dirIndex]) {
                case "Up":
                    isPath = this.mazeData[y - 2, x] === 0;
                    this.#setWall(x, --y);
                    this.#setWall(x, --y);
                    break;
                case "Right":
                    isPath = this.mazeData[y, x + 2] === 0;
                    this.#setWall(++x, y);
                    this.#setWall(++x, y);
                    break;
                case "Down":
                    isPath = this.mazeData[y + 2, x] === 0;
                    this.#setWall(x, ++y);
                    this.#setWall(x, ++y);
                    break;
                case "Left":
                    isPath = this.mazeData[y, x - 2] === 0;
                    this.#setWall(--x, y);
                    this.#setWall(--x, y);
                    break;
            }


            console.log("既存の壁に接続できているか", isPath);
            if (isPath) {
                console.log("一度もここ呼ばれてなくない？")
                this.#extendWall(x, y);
            }


        } else {
            const beforeCell = this.#currentWallCells.pop();
            console.log("巻き戻します", beforeCell);
            // this.#extendWall(beforeCell[0], beforeCell[1]);
        }

        // console.log(x, y);
    };


    #setWall(x, y) {
        console.log(x, y, "を壁にします");
        this.mazeData[y][x] = 1;

        if (x % 2 === 0 && y % 2 === 0) {
            this.#currentWallCells.push([x, y]);
            // console.log(this.#currentWallCells);
        }
    };


    #isCurrentWall(x, y) {
        // return this.#currentWallCells.includes([x, y]);
        console.log(x, y, "は建設中の壁か", this.#currentWallCells.filter(elm => elm[0] === x && elm[1] === y).length > 0);
        return this.#currentWallCells.filter(elm => elm[0] === x && elm[1] === y).length > 0;
        // return true;
    }


    #init2DArray(m, n, val = 0) {
        return Array.from(new Array(m), () => new Array(n).fill(val));
    };

}
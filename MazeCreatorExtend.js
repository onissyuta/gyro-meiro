export class MazeCreatorExtend {
    constructor(width, height) {
        if (width < 5 || height < 5) throw new Error('Width and height must be at least 5.');
        if (width % 2 === 0) width++;
        if (height % 2 === 0) height++;

        this.width = width;
        this.height = height;
        this.maze = Array.from({ length: width }, () => Array(height).fill(0));
        this.startCells = [];
        this.currentWallCells = [];
        this.random = Math.random;

        // Initialize maze with walls and paths
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
                    this.maze[x][y] = MazeCreatorExtend.WALL;
                } else {
                    this.maze[x][y] = MazeCreatorExtend.PATH;
                    if (x % 2 === 0 && y % 2 === 0) {
                        this.startCells.push({ x, y });
                    }
                }
            }
        }
    }

    createMaze() {
        while (this.startCells.length > 0) {
            const index = Math.floor(this.random() * this.startCells.length);
            const cell = this.startCells[index];
            this.startCells.splice(index, 1);

            const { x, y } = cell;

            if (this.maze[x][y] === MazeCreatorExtend.PATH) {
                this.currentWallCells = [];
                this.extendWall(x, y);
            }
        }
        return this.maze;
    }

    extendWall(x, y) {
        const directions = [];
        if (this.maze[x][y - 1] === MazeCreatorExtend.PATH && !this.isCurrentWall(x, y - 2)) directions.push('Up');
        if (this.maze[x + 1][y] === MazeCreatorExtend.PATH && !this.isCurrentWall(x + 2, y)) directions.push('Right');
        if (this.maze[x][y + 1] === MazeCreatorExtend.PATH && !this.isCurrentWall(x, y + 2)) directions.push('Down');
        if (this.maze[x - 1][y] === MazeCreatorExtend.PATH && !this.isCurrentWall(x - 2, y)) directions.push('Left');

        if (directions.length > 0) {
            this.setWall(x, y);

            let isPath = false;
            const dir = directions[Math.floor(this.random() * directions.length)];
            switch (dir) {
                case 'Up':
                    isPath = (this.maze[x][y - 2] === MazeCreatorExtend.PATH);
                    this.setWall(x, --y);
                    this.setWall(x, --y);
                    break;
                case 'Right':
                    isPath = (this.maze[x + 2][y] === MazeCreatorExtend.PATH);
                    this.setWall(++x, y);
                    this.setWall(++x, y);
                    break;
                case 'Down':
                    isPath = (this.maze[x][y + 2] === MazeCreatorExtend.PATH);
                    this.setWall(x, ++y);
                    this.setWall(x, ++y);
                    break;
                case 'Left':
                    isPath = (this.maze[x - 2][y] === MazeCreatorExtend.PATH);
                    this.setWall(--x, y);
                    this.setWall(--x, y);
                    break;
            }
            if (isPath) {
                this.extendWall(x, y);
            }
        } else {
            const beforeCell = this.currentWallCells.pop();
            if (beforeCell) {
                this.extendWall(beforeCell.x, beforeCell.y);
            }
        }
    }

    setWall(x, y) {
        this.maze[x][y] = MazeCreatorExtend.WALL;
        if (x % 2 === 0 && y % 2 === 0) {
            this.currentWallCells.push({ x, y });
        }
    }

    isCurrentWall(x, y) {
        return this.currentWallCells.some(cell => cell.x === x && cell.y === y);
    }

    static debugPrint(maze) {
        console.log(`Width: ${maze.length}`);
        console.log(`Height: ${maze[0].length}`);
        for (let y = 0; y < maze[0].length; y++) {
            let line = '';
            for (let x = 0; x < maze.length; x++) {
                line += maze[x][y] === MazeCreatorExtend.WALL ? '■' : ' ';
            }
            console.log(line);
        }
    }
}

MazeCreatorExtend.PATH = 0;
MazeCreatorExtend.WALL = 1;
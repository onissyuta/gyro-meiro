import * as PIXI from 'pixi.js';
import {MazeCreator} from './MazeCreator.js'

const app = new PIXI.Application({width: 600, height: 600, backgroundColor: 0xffffff});
document.body.appendChild(app.view);



const drawWall = (x, y, column, row) => {
    const wallWidth = app.view.width / column;
    const wallHeight = app.view.height / row;

    const wall = new PIXI.Graphics();
    wall.lineStyle(0);
    wall.beginFill(0x000000);
    wall.drawRect(wallWidth * x,  wallHeight * y, wallWidth, wallHeight);
    wall.endFill();

    app.stage.addChild(wall);
};



document.getElementById('start').addEventListener('click', event => {
    let column, row;

    switch (document.getElementById('levelSelector').value) {
        case 'easy':
            column = 7;
            row = 7;
            break;
        case 'normal':
            column = 21;
            row = 21;
            break;
        case 'hard':
            column = 49;
            row = 49;
            break;
        default:
            column, row = 21;
            break;
    }
    console.log(column, row);

    const maze = new MazeCreator(column, row);

    /*
    const maze = [
        [1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1],
        [1,0,1,0,1,1,1],
        [1,0,1,0,0,0,1],
        [1,0,1,1,1,0,1],
        [1,0,1,0,0,0,1],
        [1,1,1,1,1,1,1],
    ];
    */
    if(app.stage.children.length) {
        app.stage.children.length = 0;
    }

    maze.forEach((elm, y) => {
        elm.forEach((isWall, x) => {
            if(isWall) {
                drawWall(x, y, column, row);
            }
        });
    });
});







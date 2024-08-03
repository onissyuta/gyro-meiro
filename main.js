import * as PIXI from 'pixi.js';
import { MazeCreatorExtend } from './MazeCreatorExtend.js'

const app = new PIXI.Application({ width: 820, height: 820, backgroundColor: 0xffffff });
document.body.appendChild(app.view);



const createWall = (x, y) => {
    const wallWidth = app.view.width / column;
    const wallHeight = app.view.height / row;

    const wall = new PIXI.Graphics();
    wall.lineStyle(0);
    wall.beginFill(0x000000);
    wall.drawRect(0, 0, wallWidth, wallHeight);
    wall.endFill();

    wall.eventMode = 'static';
    wall.position.set(wallWidth * x, wallHeight * y);

    return wall;
};



// document.getElementById('start').addEventListener('click', event => {
//     let column, row;

//     switch (document.getElementById('levelSelector').value) {
//         case 'easy':
//             column = 7;
//             row = 7;
//             break;
//         case 'normal':
//             column = 21;
//             row = 21;
//             break;
//         case 'hard':
//             column = 49;
//             row = 49;
//             break;
//         default:
//             column, row = 21;
//             break;
//     }
//     console.log(column, row);

//     const maze = new MazeCreator(column, row);

//     /*
//     const maze = [
//         [1,1,1,1,1,1,1],
//         [1,0,0,0,0,0,1],
//         [1,0,1,0,1,1,1],
//         [1,0,1,0,0,0,1],
//         [1,0,1,1,1,0,1],
//         [1,0,1,0,0,0,1],
//         [1,1,1,1,1,1,1],
//     ];
//     */
//     if (app.stage.children.length) {
//         app.stage.children.length = 0;
//     }

//     maze.forEach((elm, y) => {
//         elm.forEach((isWall, x) => {
//             if (isWall) {
//                 drawWall(x, y, column, row);
//             }
//         });
//     });
// });



let column = 41;
let row = 41;

// const maze = new MazeCreator(column, row);

const mazeCreator = new MazeCreatorExtend(column, row);
const maze = mazeCreator.createMaze();

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

const wallContainer = new PIXI.Container();
maze.forEach((elm, y) => {
    elm.forEach((isWall, x) => {
        if (isWall) {
            wallContainer.addChild(createWall(x, y));
        }
    });
});
app.stage.addChild(wallContainer);

const player = new PIXI.Graphics();
player.beginFill(0xff0000);
player.drawCircle(0, 0, 6);
player.endFill();
player.position.set(32, 32);
player.eventMode = 'static';
app.stage.addChild(player);


console.log(player.x);
console.log(player.position.y);
console.log(player.width);
console.log(player.height);


// 現在の移動方向
let currentMove = '';

// イベントリスナー登録
window.addEventListener("keydown", event => {
    switch (event.key) {
        case 'ArrowRight':
            currentMove = 'walkRight';
            break;
        case 'ArrowLeft':
            currentMove = 'walkLeft';
            break;
        case 'ArrowDown':
            currentMove = 'walkDown';
            break;
        case 'ArrowUp':
            currentMove = 'walkUp';
            break;
        case ' ':
            currentMove = 'fly';
            break;
    }
});
window.addEventListener("keyup", () => {
    currentMove = '';
});


// 軸平行境界矩形
// (AABB: Axis-Aligned bounding Box）
// を用いた当たり判定
const testAABB = (bounds1, bounds2) => {
    return bounds1.x <= bounds2.x + bounds2.width
        && bounds2.x <= bounds1.x + bounds1.width
        && bounds1.y <= bounds2.y + bounds2.height
        && bounds2.y <= bounds1.y + bounds1.height
    
}


const startText = new PIXI.Text("S");
startText.x = 20;
startText.y = 20;
app.stage.addChild(startText);

const goalText = new PIXI.Text("G");
goalText.x = app.view.width - 40;
goalText.y = app.view.height - 45;
app.stage.addChild(goalText);


app.ticker.add(() => {
    const newBounds = {
        // x: player.x - (player.width / 2),
        // y: player.y - (player.height / 2),
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
    };


    const delta = 2;
    switch (currentMove) {
        case 'walkLeft': newBounds.x -= delta; break;
        case 'walkRight': newBounds.x += delta; break;
        case 'walkUp': newBounds.y -= delta; break;
        case 'walkDown': newBounds.y += delta; break;
        default: break;
    }
    // console.log(newBounds);

    let hitTest = false;

    wallContainer.children.forEach(wall => {
        const hitTest = testAABB(newBounds, { x: wall.x, y: wall.y, width: wall.width, height: wall.height });

        if (hitTest) {
            wall.x += 10;
            // player.x = newBounds.x;
            // player.y = newBounds.y;
        }

        player.x = newBounds.x;
        player.y = newBounds.y;
    });




    // const hitTest = testAABB(newBounds, { x: 200, y: 200, width: 160, height: 160 });
    // if (!hitTest) {

    // }

    // console.log(currentMove)

});

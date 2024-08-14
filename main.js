import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { MazeCreatorExtend } from './MazeCreatorExtend.js'





let x = 0
let y = 0;
function handleOrientation(event) {
    x = event.beta; // In degree in the range [-180,180)
    y = event.gamma; // In degree in the range [-90,90)
  
    // Because we don't want to have the device upside down
    // We constrain the x value to the range [-90,90]
    if (x > 90) {
      x = 90;
    }
    if (x < -90) {
      x = -90;
    }
  
    output.textContent = `beta: ${x}\n`;
    output.textContent += `gamma: ${y}\n`;
  }
  
window.addEventListener("deviceorientation", handleOrientation);



const app = new PIXI.Application({ width: 400, height: 400, backgroundColor: 0xffffff });
document.body.appendChild(app.view);


const createWall = (x, y) => {
    const wallWidth = app.view.width / column;
    const wallHeight = app.view.height / row;

    const wall = new PIXI.Graphics();
    wall.lineStyle(0, 0x00ff00);
    wall.beginFill(0xffffff);
    wall.drawRect(0, 0, wallWidth, wallHeight);
    wall.endFill();
    wall.tint = 0x0000ff;

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



let column = 21;
let row = 21;

// const maze = new MazeCreator(column, row);

const mazeCreator = new MazeCreatorExtend(column, row);
const maze = mazeCreator.createMaze();

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
// player.drawCircle(0, 0, 6);
player.drawRect(0, 0, 10, 10);
player.endFill();
player.position.set((app.view.width / column) * 1 + 2, (app.view.height / row) * 1 + 2);
player.eventMode = 'static';
app.stage.addChild(player);



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

    
    const delta = 1;
    switch (currentMove) {
        case 'walkLeft': newBounds.x -= delta; break;
        case 'walkRight': newBounds.x += delta; break;
        case 'walkUp': newBounds.y -= delta; break;
        case 'walkDown': newBounds.y += delta; break;
        default: break;
    }


    if(x !== null && y !== null){
        newBounds.x += y * 0.1;
        newBounds.y += x * 0.1;
        console.log(x, y);
        console.log(newBounds);
    }

    
    let hitTest;
    let number;
    let direction;
    for(let i = 0; i < wallContainer.children.length; i++) {
        const wallBounds = {
            x: wallContainer.children[i].x,
            y: wallContainer.children[i].y,
            width: wallContainer.children[i].width,
            height: wallContainer.children[i].height
        };

        hitTest = testAABB(newBounds, wallBounds);

        if(hitTest){
            number = i;
            
            if(newBounds.x + newBounds.width > wallBounds.x){
                direction = 'right';
            } else if(newBounds.x + newBounds.width < wallBounds.x) {
                direction = 'left';
            } else if(newBounds.y + newBounds.height > wallBounds.y) {
                direction = 'bottom';
            } else if(newBounds.y + newBounds.height < wallBounds.y) {
                direction = 'top';
            }
            break;
        }
    }

    if(!hitTest){
        player.x = newBounds.x;
        player.y = newBounds.y;
    } else {
        wallContainer.children[number].tint = 0x00ff00;
        

    }

    output2.textContent = `direction: ${direction}\n`;

});


const output = document.querySelector(".output");
const output2 = document.querySelector(".output2");




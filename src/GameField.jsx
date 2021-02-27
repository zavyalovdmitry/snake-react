import React from 'react';

import './GameField.css';

export default class GameField extends React.Component {
    constructor() {
        super();

        this.state = {
            style: "\\1F357",
            // field legend:
            // 0 - empty
            // 1 - snake
            // 2 - food
            // 3 - obstacle
            // 4 - pieces
            // 5 - boomplace
            //-----------------
            // -x+  - horizontally
            // -
            // y    - vertically
            // +
            foodList: [2, 11, 12, 13, 14, 15, 16, 17, 18 ,19],
            fieldX: 10,
            fieldY: 10,
            fieldXxY: [],
            snake: [],
            obstaclesArr: [],
            snakeSpeed: 300,        
            foodTimer: 5000,       
            obstacleInt: 7000,
            noObstacleInt: 11000,
            direction: 'x+',
            gameIsRunning: false,   
            snakeTimer: null,       
            obstacleTimer: null,
            noObstacleTimer: null,
            hiScore: 0,       
            score: 0,
            obstacles: true,
            obstaclesDisap: true,
            noWalls: true
        };
    }

    componentDidMount() {
        this.gameTableInit();
        document.addEventListener('keydown', this.changeDirection);
    }

    changeDirection = (e) => {
        let {direction} = this.state;
        // eslint-disable-next-line
        switch (e.code) {
            case 'ArrowLeft': 
            case 'KeyA':
                if (direction !== 'x+') {
                    direction = 'x-'
                }
                break;
            case 'ArrowUp': 
            case 'KeyW':
                if (direction !== 'y-') {
                    direction = 'y+'
                }
                break;
            case 'ArrowRight':
            case 'KeyD':
                if (direction !== 'x-') {
                    direction = 'x+'
                }
                break;
            case 'ArrowDown': 
            case 'KeyS':
                if (direction !== 'y+') {
                    direction = 'y-'
                }
                break;
        }
        this.setState({direction: direction});
    }

    gameTableInit = () => {
        let arr = [[]];
        let arrSn = [];
        for(let y = 0; y < this.state.fieldY; y++) {
            arr.push([]);
            for(let x = 0; x < this.state.fieldX; x++) {
                arr[y].push(0);
            }
        }
        let y = Math.floor(this.state.fieldY / 2);
        let x = Math.floor(this.state.fieldX / 2);
        arr[y][x] = arr[y][x + 1] = 1;                
        this.setState({fieldXxY: arr});
        arrSn.push(`${y}-${x}`, `${y}-${x + 1}`)
        this.setState({snake: arrSn});
    }

    snakeDraw =() => {
        let arr = this.state.fieldXxY.map((item) => {
            const i = item;
            return (
                i.map((subitem) => {
                    return (
                        subitem === 1 ? 0 : subitem
                    )
                })
            )
        })
        arr = arr.map((item, index) => {
            return (
                item.map((subitem, i) => {
                    return (
                        this.state.snake.includes(`${index.toString()}-${i.toString()}`) ? 1 : subitem
                    )
                })
            )
        })
        this.setState({fieldXxY: arr});
    }

    startGame = () => {
        this.gameTableInit();
        this.setState({score: 0});
        this.setState({hiScore: this.state.hiScore < this.state.score ? this.state.score : this.state.hiScore})
        this.setState({direction: 'x+'})
        this.setState({gameIsRunning: true});
        this.setState({snakeTimer: setInterval(this.move, this.state.snakeSpeed)});
        setTimeout(this.createFood, this.state.foodTimer);
        if (this.state.obstacles) {
            this.setState({obstacleTimer: setInterval(this.createObstacle, this.state.obstacleInt)});
        }
        if (this.state.obstaclesDisap) {
            this.setState({noObstacleTimer: setInterval(this.deleteObstacle, this.state.noObstacleInt)});
        }
    }

    createFood = () => {
        this.createFoodOrObstacle(this.state.foodList[Math.floor(Math.random() * this.state.foodList.length)]);
        // this.setState({snakeSpeed: this.state.snakeSpeed - 1});
        // this.setState({snakeTimer: setInterval(this.move, this.state.snakeSpeed)});
    }

    createObstacle = () => {
        this.createFoodOrObstacle(3);
    }

    deleteObstacle = () => {
        let {obstaclesArr, fieldXxY} = this.state;
        let i = Math.floor(Math.random() * obstaclesArr.length);
        fieldXxY[obstaclesArr[i].split('-')[0]][obstaclesArr[i].split('-')[1]] = 0;
        obstaclesArr.splice(i, 1);
        this.setState({obstaclesArr: obstaclesArr});
        this.setState({fieldXxY: fieldXxY});
    }

    createFoodOrObstacle = (item) => {
        let arr = this.state.fieldXxY;
        while (1) { 
            var food_x = Math.floor(Math.random() * this.state.fieldX);
            var food_y = Math.floor(Math.random() * this.state.fieldY);
            if (arr[food_y][food_x] === 0) {
                arr[food_y][food_x] = item;
                break;
            }
        }
        if (item === 3) {
            this.setState({obstaclesArr: [...this.state.obstaclesArr, `${food_y}-${food_x}`]});
        }
        this.setState({fieldXxY: arr});
    }

    fieldNumber = (coord) => {
        let [y, x] = [...coord.split('-')];
        return (this.state.fieldXxY[+y][+x]);
    }

    move = () => {
        let {direction, snake, noWalls} = this.state;
        let head = snake[snake.length - 1].split('-');
        let headNew = '';
        let newx = head[1];
        let newy = head[0];
        // eslint-disable-next-line
        switch (direction) {
            case 'x-':
                newx = parseInt(head[1]) - 1;
                break;
            case 'x+':
                newx = parseInt(head[1]) + 1;
                break;
            case 'y+':
                newy = parseInt(head[0]) - 1;
                break;
            case 'y-':
                newy = parseInt(head[0]) + 1;
                break;
        }
        if (newx > (this.state.fieldX - 1) || 
            newx < 0 ||
            newy > (this.state.fieldY - 1) || 
            newy < 0) {
                if (noWalls) {
                    if (newx > this.state.fieldX - 1) {newx = 0};
                    if (newx < 0) {newx = this.state.fieldX - 1};
                    if (newy > this.state.fieldY - 1) {newy = 0};
                    if (newy < 0) {newy = this.state.fieldY - 1};
                } else {
                    this.finishTheGame();
                }
        } 
        headNew = `${newy}-${newx}`;
        if (snake.includes(headNew)) {
            this.finishTheGame();
        }
        let arr = snake;
        arr.push(headNew);
        this.setState({snake: arr})
        if (this.fieldNumber(headNew) === 3) {
            this.boom(headNew);
            // setTimeout(this.finishTheGame(), 500);
            this.finishTheGame();
        }
        // if (this.fieldNumber(headNew) in this.state.foodList) {
        if (this.state.foodList.includes(this.fieldNumber(headNew))) {
            // this.createFood(this.state.foodList[Math.floor(Math.random() * this.state.foodList.length)]);
            this.createFood();
            this.setState({score: this.state.score + 1});
        } else if (this.state.gameIsRunning) {
            snake.splice(0, 1);
            this.setState({snake: snake});
            this.snakeDraw();
        }
    }

    boom = (boom) => {
        let arr = this.state.fieldXxY;
        let x = +boom.split('-')[1];
        let y = +boom.split('-')[0];
        arr[y][x] = 5;
        this.setState({fieldXxY: arr});
        // console.log(this.state.fieldXxY)
        let i = 1;
        
        let arr2 = this.state.fieldXxY;
        while (i < this.state.snake.length) { 
            var food_x = Math.floor(Math.random() * this.state.fieldX);
            var food_y = Math.floor(Math.random() * this.state.fieldY);
            if (arr2[food_y][food_x] === 0) {
                arr2[food_y][food_x] = 4;
                // break;
            }
            i++;
        }

        arr2 = this.state.fieldXxY.map((item) => {
            const i = item;
            return (
                i.map((subitem) => {
                    return (
                        subitem === 1 ? 0 : subitem
                    )
                })
            )
        })
        this.setState({fieldXxY: arr2});
    }

    finishTheGame = () => {
        this.setState({gameIsRunning: false});
        clearInterval(this.state.snakeTimer);
        clearInterval(this.state.obstacleTimer);
        clearInterval(this.state.noObstacleTimer);
        // alert('Вы проиграли! Ваш результат: ' + this.state.snake.length);
    }

    fieldSizeChanged = (e) => {
        this.setState({fieldX: +e.target.value.split('x')[0]});
        this.setState({fieldY: +e.target.value.split('x')[1]});
        // this.gameTableInit();
        // this.forceUpdate();
        // this.render();
    }

    render() {
        return <div className='game'>
            <div className='snake-field'>
                <table className='game-table' id={`table-${this.state.fieldX}x${this.state.fieldY}`}>
                    <tbody>
                    {
                        this.state.fieldXxY.map((item, index) => {
                            return (
                                <tr key={`r-${index}`} className={`game-table-row row-${index}`}>
                                    {
                                        item.map((subitem, i) => {
                                            return (
                                                <td key={`c-${i}`} 
                                                    className={`game-table-cell 
                                                    cell-${index}-${i} 
                                                    game-table-cell-status-${subitem}`}
                                                    // css-data={this.state.style}
                                                ></td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
            <span>Hi-Score: {this.state.hiScore}</span>
            <span>Score: {this.state.score}</span>
            <button onClick={this.startGame}>Start</button>
            <div>
                <select className="form-select" onChange={this.fieldSizeChanged}>
                    {/* <option defaultValue>Field size</option> */}
                    <option value="10x10">10x10</option>
                    <option value="15x15">15x15</option>
                    <option value="20x20">20x20</option>
                </select>


                <label value='Walls'>
                    {/* <checkbox></checkbox> */}
                </label>
                <label value='Obbstacles'>
                    {/* <checkbox></checkbox> */}
                </label>
                <label value='Obstacles disappearing'>
                    {/* <checkbox></checkbox> */}
                </label>
                <label value='Snake speed increasing'>
                    {/* <checkbox></checkbox> */}
                </label>
                <label value='Snake speed'>
                    {/* <checkbox></checkbox> */}
                </label>
            </div>
        </div>
    }
}

// elements styles

// animations
// every 10 points
// loose

// head picture

// music
// sounds


// start button
// new game
// pause button
// fullscreen 
// autoplay

// field size
// walls check
// obstacles check
// obstaclesdisapp check
// snake speed
// snake speed increase

// music on/off + rate
// sounds

// records table - 10

// game saving while reload

// backend
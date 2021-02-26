import React from 'react';
// import ReactDOM from 'react-dom';

import './GameField.css';

export default class GameField extends React.Component {
    constructor() {
        super();

        this.state = {
            // field legend:
            // 0 - empty
            // 1 - snake
            // 2 - food
            // 3 - obstacle
            //-----------------
            // -x+  - horizontally
            // -
            // y    - vertically
            // +
            fieldX: 20,
            fieldY: 20,
            fieldXxY: [],
            snake: [],
            snakeSpeed: 300,        // Интервал между перемещениями змейки
            foodTimer: 5000,        // Таймер для еды
            obstacleTimer: 7000,
            noObstacleTimer: 8000,

            direction: 'x+',

            gameIsRunning: false,  // Запущена ли игра
            snakeTimer: null,           // Таймер змейки
            obstacleTimer: null,
            noObstacleTimer: null,
            score: 0,              // Результат
            obstacles: false,
            obstaclesDisap: false,
            noWalls: true
        };
    }

    componentDidMount() {
        this.gameTableInit();
        document.addEventListener('keydown', this.changeDirection);
    }

    changeDirection = (e) => {
        // console.log(e);
        let {direction} = this.state;
    
        switch (e.code) {
            case 'ArrowLeft': // Клавиша влево
                if (direction !== 'x+') {
                    direction = 'x-'
                }
                break;
            case 'ArrowUp': // Клавиша вверх
                if (direction !== 'y-') {
                    direction = 'y+'
                }
                break;
            case 'ArrowRight': // Клавиша вправо
                if (direction !== 'x-') {
                    direction = 'x+'
                }
                break;
            case 'ArrowDown': // Клавиша вниз
                if (direction !== 'y+') {
                    direction = 'y-'
                }
                break;
        }
        this.setState({direction: direction});
        console.log(direction);
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
        arr[y][x] = arr[y][x + 1] = 1;                  // snake start

        this.setState({fieldXxY: arr});

        arrSn.push(`${y}-${x}`, `${y}-${x + 1}`)
        this.setState({snake: arrSn});
    }

    snakeDraw =() => {
        // this.state.fieldXxY.map((val, i) => {
        //     val = 1 ? 0 : val
        // });

        // this.state.fieldXxY.map((val, i) => {
        //     val = 1 ? 0 : val
        // });
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
        // console.log(arr)

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
        // console.log(this.state.fieldXxY);
    }

    startGame = () => {
        this.setState({gameIsRunning: true});
        // // respawn();//создали змейку

        this.setState({snakeTimer: setInterval(this.move, this.state.snakeSpeed)});//каждые 200мс запускаем функцию move
        setTimeout(this.createFood, this.state.foodTimer);
        // if (obstacles) {
        //     obstacle_timer = setInterval(createObstacle, obstacleTimer);
        // }
        // if (obstaclesDisap) {
        //     no_obstacle_timer = setInterval(deleteObstacle, noObstacleTimer);
        // }
        // setTimeout(createFood, foodTimer);
    }

    // handleKeyPress = (event) => {
    //     if(event.key === 'Enter'){
    //       console.log('enter press here! ')
    //     }
    // }

    createFood = () => {

        let arr = this.state.fieldXxY;

        // let i = 0, j = 0;
    
        while (1) { //пока еду не создали
    //         // рандом
            var food_x = Math.floor(Math.random() * this.state.fieldX);
            var food_y = Math.floor(Math.random() * this.state.fieldY);
    
    //         var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x)[0];
    //         var food_cell_classes = food_cell.getAttribute('class').split(' ');
    
    //         // проверка на змейку
            if (arr[food_y][food_x] === 0) {
                arr[food_y][food_x] = 2;
                break;
            }
            // arr[food_y][food_x] = arr[food_y][food_x] === 0 ? 2 : arr[food_y][food_x];
    //         if (!food_cell_classes.includes('snake-unit') &&
    //             !food_cell_classes.includes('obstacle-unit')) {
    //             var classes = '';
    //             for (var i = 0; i < food_cell_classes.length; i++) {
    //                 classes += food_cell_classes[i] + ' ';
    //             }
    // console.log(food_x, food_y, arr[food_y][food_x])
    // console.log(arr.includes(2))
    //             food_cell.setAttribute('class', classes + newUnitClass);
    //             foodCreated = true;
    //         }
        }
        this.setState({fieldXxY: arr});
    }

    fieldNumber = (coord) => {
        let [y, x] = [...coord.split('-')];
        // let n = this.state.fieldXxY[y][x];
        // console.log(this.state.fieldXxY[y][x])
        return (this.state.fieldXxY[+y][+x]);

    }

    move = () => {
        let {direction, snake, noWalls} = this.state;
        
        // Сборка классов
        // var snake_head_classes = snake[snake.length - 1].getAttribute('class').split(' ');
    
        // Сдвиг головы
        // var new_unit;
        // var snake_coords = snake_head_classes[1].split('-');//преобразовали строку в массив
        // var coord_y = parseInt(snake_coords[1]);
        // var coord_x = parseInt(snake_coords[2]);
        let head = snake[snake.length - 1].split('-');
        let headNew = '';

        switch (direction) {
            case 'x-':
                headNew = `${head[0]}-${parseInt(head[1]) - 1}`;
                break;
            case 'x+':
                headNew = `${head[0]}-${parseInt(head[1]) + 1}`;
                break;
            case 'y+':
                headNew = `${parseInt(head[0]) - 1}-${head[1]}`;
                break;
            case 'y-':
                headNew = `${parseInt(head[0]) + 1}-${head[1]}`;
                break;
        }
// console.log(headNew);
        // snake itsalf
        if (snake.includes(headNew)) {
            this.finishTheGame();
        }

        // Определяем новую точку
        if (direction === 'x-') {
            
            if (head[1] === '0' && this.state.noWalls) {
                snake.push(`${head[0]}-19`);
            } else {
                snake.push(`${head[0]}-${parseInt(head[1]) - 1}`);
            }
        //     coord_x = (noWalls && coord_x == 0) ? 20 : coord_x;
        //     new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x - 1))[0];
        }
        else if (direction === 'x+') {
            
            if (head[1] === '19' && this.state.noWalls) {
                snake.push(`${head[0]}-0`);
            }
            else {
                snake.push(`${head[0]}-${parseInt(head[1]) + 1}`);
            }
        //     coord_x = (noWalls && coord_x == 19) ? -1 : coord_x;
        //     new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x + 1))[0];

        }
        else if (direction === 'y+') {
            
            if (head[0] === '0' && this.state.noWalls) {
                snake.push(`19-${head[1]}`);
            }
            else {
                snake.push(`${parseInt(head[0]) - 1}-${head[1]}`);
            }
        //     coord_y = (noWalls && coord_y == 0) ? 20 : coord_y;
        //     new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + (coord_x))[0];
        }
        else if (direction === 'y-') {
            
            if (head[0] === '19' && this.state.noWalls) {
                snake.push(`0-${head[1]}`);
            }
            else {
                snake.push(`${parseInt(head[0]) + 1}-${head[1]}`);
            }
        //     coord_y = (noWalls && coord_y == 19) ? -1 : coord_y;
        //     new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + (coord_x))[0];
        }
        
        

        // wall
        // if (!noWalls && ) {

        // }
        // obstacle
        if (this.fieldNumber(headNew) === 3) {
            this.finishTheGame();
        }
        // food
        if (this.fieldNumber(headNew) === 2) {
            this.createFood();
        } else {
            snake.splice(0, 1);
            this.setState({snake: snake});
            this.snakeDraw();
        }

        // не в себя
        // не в стену
        // не в преп-е
        // в еду

        // Проверки
        // 1) new_unit не часть змейки
        // 2) Змейка не ушла за границу поля
        //console.log(new_unit);
        // if (!isSnakeUnit(new_unit)
        //     && new_unit !== undefined
        //     && !isObstacleUnit(new_unit)) {
        //     // Добавление новой части змейки
        //     new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        //     snake.push(new_unit);
    
        //     // Проверяем, надо ли убрать хвост
    
        //     if (!haveFood(new_unit)) {
        //         // Находим хвост
        //         var removed = snake.splice(0, 1)[0];
        //         var classes = removed.getAttribute('class').split(' ');
    
        //         // удаляем хвост
        //         removed.setAttribute('class', classes[0] + ' ' + classes[1]);
        //     } else {
    
        //     }
        // }

        // else {
            
        // }
        
        

        // arr.push('13-7');

        // console.log(arr);
    }

    finishTheGame = () => {
        this.setState({gameIsRunning: false});
        clearInterval(this.state.snakeTimer);
        // clearInterval(obstacle_timer);
        alert('Вы проиграли! Ваш результат: ' + this.state.snake.length);
    }

    render() {
        return <>
        <div className='snake-field'>
            <table className='game-table'>
                <tbody>
                {
                    this.state.fieldXxY.map((item, index) => {
                        return (
                            <tr key={`r-${index}`} className={`game-table-row row-${index}`}>
                                {
                                    item.map((subitem, i) => {
                                        return (
                                            <td key={`c-${i}`} className={`game-table-cell cell-${index}-${i} game-table-cell-status-${subitem}`}></td>
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
        <button onClick={this.startGame}>Start</button>
        </>
    }
}
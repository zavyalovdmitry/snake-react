import React from 'react';

import '../styles/GameField.css';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Collapse from 'react-bootstrap/Collapse';

import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

export default class GameField extends React.Component {
    constructor() {
        super();

        this.state = {
            foodList: [2, 11, 12, 13, 14, 15, 16, 17, 18 ,19],
            fieldX: 15,
            fieldY: 15,
            fieldXxY: [],
            snake: [],
            obstaclesArr: [],
            snakeSpeedInit: 300,     
            snakeSpeed: 0,   
            foodTimer: 1000,       
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
            noWalls: true,

            radioValue: '15x15',
            settingsOpen: false,

            audioExp: null,
            audioBut: null,
            audioEat: null,
            audioPunch: null,
            audioBomb: null,
            audioFood: null,
            audioStart: null,
            audioLose: null,

            speedSetting: 50,
            isPaused: true,
            isSound: true,

            gameIsOver: false,
            autoPlayIsRunning: false,
            autoplayTimer: null,
            autoplayInt: 100,
            FSmodeOn: false,

            autoPlayStartInt: 3000

        };
    }

    componentDidMount() {
        
        this.gameTableInit();
        document.addEventListener('keydown', this.changeDirection);
        document.getElementById("game-table").addEventListener('dblclick', this.goFullscreen);
        
        this.setState({audioStart: document.getElementsByClassName("audio-start")[0]});
        this.setState({audioExp: document.getElementsByClassName("audio-element")[0]});
        this.setState({audioBut: document.getElementsByClassName("audio-button")[0]});
        this.setState({audioEat: document.getElementsByClassName("audio-eat")[0]});
        this.setState({audioPunch: document.getElementsByClassName("audio-punch")[0]});
        this.setState({audioBomb: document.getElementsByClassName("audio-bomb")[0]});
        this.setState({audioFood: document.getElementsByClassName("audio-food")[0]});
        this.setState({audioLose: document.getElementsByClassName("audio-lose")[0]});

        document.getElementById("game-table").style.border = this.state.noWalls ? 'none' : '5px solid red';
        //autoplaystart
        // setTimeout(
        //     () => {
        //         this.startGame();
        //         this.setState({autoplayTimer: setInterval(this.autoplay, this.state.autoplayInt)});
        //     }
        //     , this.state.autoPlayStartInt);
    }

    goFullscreen = () => {
        this.props.fullscreen();
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
        arr.pop();            
        this.setState({fieldXxY: arr});
        arrSn.push(`${y}-${x}`, `${y}-${x + 1}`)
        this.setState({snake: arrSn});
        this.setState({snakeSpeed: this.state.snakeSpeedInit})
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

    playSound = (sound) => {
        if (this.state.isSound) {
            sound.play();
        }
    }

    startGame = () => {
        if (!this.state.autoPlayIsRunning) {
            this.playSound(this.state.audioBut);
            this.playSound(this.state.audioStart);

            this.finishTheGame();

            this.setState({settingsOpen: false});
            this.setState({gameIsOver: false});
            this.setState({score: 0});
            this.setState({hiScore: this.state.hiScore < this.state.score ? this.state.score : this.state.hiScore})
            this.setState({gameIsRunning: true});
            this.setState((prevState) => ({ isPaused: true }));
        }
        
        this.gameTableInit();
        this.setState({direction: 'x+'})

        setTimeout(this.createFood, this.state.foodTimer);

        this.setState({snakeTimer: setInterval(this.move, this.state.snakeSpeed)});        
        if (this.state.obstacles) {
            this.setState({obstacleTimer: setInterval(this.createObstacle, this.state.obstacleInt)});
        }
        if (this.state.obstaclesDisap) {
            this.setState({noObstacleTimer: setInterval(this.deleteObstacle, this.state.noObstacleInt)});
        }

        if (this.state.autoPlayIsRunning) {
            this.setState({autoplayTimer: setInterval(this.autoplay, this.state.autoplayInt)});
        }
    }

    autoplay = () => {
        let fieldXxY = this.state.fieldXxY;
        let food = [];
        let snake = [+this.state.snake[this.state.snake.length - 1].split('-')[0], +this.state.snake[this.state.snake.length - 1].split('-')[1]]

        for (let y = 0; y < this.state.fieldY; y++) {
            for (let x = 0; x < this.state.fieldX; x++) {
                if (this.state.foodList.includes(fieldXxY[y][x])) {
                    food = [];
                    food.push(y, x);
                }
            }
        }
        // eslint-disable-next-line
        switch(this.state.direction) {
            case 'x+':
                if (food[1] <= snake[1]) {
                    if (food[0] > snake[0]) {
                        this.setState({direction: 'y-'})
                    } else 
                        {
                        this.setState({direction: 'y+'})
                    }
                }
                break;
            case 'x-':
                if (food[1] >= snake[1]) {
                    if (food[0] < snake[0]) {
                        this.setState({direction: 'y+'})
                    } else 
                        {
                        this.setState({direction: 'y-'})
                    }
                }
                break;
            case 'y+':
                if (food[0] >= snake[0]) {
                    if (food[1] > snake[1]) {
                        this.setState({direction: 'x+'})
                    } else 
                        {
                        this.setState({direction: 'x-'})
                    }
                }
                break;
            case 'y-':
                if (food[0] <= snake[0]) {
                    if (food[1] > snake[1]) {
                        this.setState({direction: 'x+'})
                    } else 
                        {
                        this.setState({direction: 'x-'})
                    }
                }
                break;
        }

    }

    createFood = () => {
        this.playSound(this.state.audioFood);
        this.createFoodOrObstacle(this.state.foodList[Math.floor(Math.random() * this.state.foodList.length)]);
    }

    createObstacle = () => {
        this.playSound(this.state.audioBomb);
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
                    this.playSound(this.state.audioPunch);
                    this.finishTheGame();
                    setTimeout(this.finAudio, 2000);
                }
        } 
        headNew = `${newy}-${newx}`;
        if (snake.includes(headNew)) {
            this.playSound(this.state.audioPunch);
            this.finishTheGame();
            setTimeout(this.finAudio, 2000);
        }
        let arr = snake;
        arr.push(headNew);
        this.setState({snake: arr})
        if (this.fieldNumber(headNew) === 3) {
            this.boom(headNew);
            this.finishTheGame();
            setTimeout(this.finAudio, 2000);
        }
        if (this.state.foodList.includes(this.fieldNumber(headNew))) {
            this.playSound(this.state.audioEat);
            setTimeout(this.createFood, this.state.foodTimer);
            if (this.state.gameIsRunning) {
                this.setState({score: this.state.score + 1});
            }
        } else if (this.state.gameIsRunning || this.state.autoPlayIsRunning) {
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
        let i = 1;
        
        this.playSound(this.state.audioExp);

        let arr2 = this.state.fieldXxY;
        while (i < this.state.snake.length) { 
            var food_x = Math.floor(Math.random() * this.state.fieldX);
            var food_y = Math.floor(Math.random() * this.state.fieldY);
            if (arr2[food_y][food_x] === 0) {
                arr2[food_y][food_x] = 4;
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
        let arr = this.state.fieldXxY.map((item) => {
            const i = item;
            return (
                i.map((subitem) => {
                    return (
                        subitem === 1 ? 4 : subitem
                    )
                })
            )
        })
        this.setState({fieldXxY: arr});
        
        this.setState({gameIsRunning: false});
        this.setState({gameIsOver: true});

        clearInterval(this.state.snakeTimer);
        clearInterval(this.state.obstacleTimer);
        clearInterval(this.state.noObstacleTimer);
    }

    finAudio = () => {
        this.playSound(this.state.audioLose);
    }

    fieldSizeChanged = (e) => {
        this.setState({fieldX: +e.target.value.split('x')[0]});
        this.setState({fieldY: +e.target.value.split('x')[1]});
    }

    soundCheckHandler = (e) => {
        if (!this.state.isSound) {
            this.playSound(this.state.audioBut);
        }
        this.setState({isSound: e})
    }

    wallsCheckHandler = (e) => {
        this.playSound(this.state.audioBut);
        document.getElementById("game-table").style.border = e ?'5px solid red' : 'none';
        this.setState({noWalls: !e});
    }

    obstaclesCheckHandler = (e) => {
        this.playSound(this.state.audioBut);
        this.setState({obstacles: e})
        if (!e) {
            this.setState({obstaclesDisap: e})
        }
    }

    obstaclesDisapCheckHandler = (e) => {
        this.playSound(this.state.audioBut);
        this.setState({obstaclesDisap: e})
    }

    obstaclesDisappCheckHandler = (e) => {
        this.setState({obstaclesDisap: !e.target.value})
    }

    setRadioValue = (e) => {
        this.playSound(this.state.audioBut);
        this.setState({radioValue: e})
        console.log(e);
        this.setState({fieldX: +e.split('x')[0]});
        this.setState({fieldY: +e.split('x')[1]});
    }

    setSnakeSpeed = (e) => {
        let s = this.state.snakeSpeedInit - (e - 50) * this.state.snakeSpeedInit / 100;
        
        this.setState({snakeSpeed: s})
        this.setState({speedSetting: e});
    }

    settingsOpen = () => {
        this.playSound(this.state.audioBut);
        this.setState({settingsOpen: !this.state.settingsOpen})
    }

    pauseGame = () => {
        this.playSound(this.state.audioBut);
        if(this.state.isPaused) {
            clearInterval(this.state.snakeTimer);
            clearInterval(this.state.obstacleTimer);
            clearInterval(this.state.noObstacleTimer);
            console.log('paused')

        } else {
            this.setState({snakeTimer: setInterval(this.move, this.state.snakeSpeed)});        
            if (this.state.obstacles) {
                this.setState({obstacleTimer: setInterval(this.createObstacle, this.state.obstacleInt)});
            }
            if (this.state.obstaclesDisap) {
                this.setState({noObstacleTimer: setInterval(this.deleteObstacle, this.state.noObstacleInt)});
            }
        }

        this.setState((prevState) => ({ isPaused: !prevState.isPaused }));
    }

    // startAutoplay = () => {
    //         this.setState({autoPlayIsRunning: true});
    //         this.startGame();
    // }

    startGameClick = () => {
        // // this.setState({autoPlayIsRunning: false});
        // clearInterval(this.state.autoplayTimer);
        // this.setState((prevState) => ({ autoPlayIsRunning: !prevState.autoPlayIsRunning }));
        
        this.setState({gameIsRunning: true});
        this.startGame();
    }

    render() {
        const radios = [
            { name: '10x10', value: '10x10' },
            { name: '15x15', value: '15x15' },
            { name: '20x20', value: '20x20' },
          ];

        return <div className='game'>
            <div className='snake-field'>
                <table className={`game-table${this.state.gameIsOver ? '-over' : ''}`} id={`game-table`}>
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
            <div className={this.state.FSmodeOn ? 'scores-white' : 'scores-black'}>
                <span>Hi-Score: {this.state.hiScore}</span><br></br>
                <span>Score: {this.state.score}</span>
            </div> 
            <div className="game-btns">
                <Button variant="dark" onClick={this.startGameClick} className="mb-2">New Game</Button>
                <Button variant="dark" onClick={this.pauseGame} className="mb-2" disabled={!this.state.gameIsRunning}>{!this.state.isPaused ? 'Resume' : 'Pause'}</Button>
            </div>

            <Button
                onClick={() => this.settingsOpen()}
                aria-controls="example-collapse-text"
                aria-expanded={this.state.settingsOpen}
                variant="dark"
                className="mb-2"
            >
                Settings
            </Button>
            <Collapse in={this.state.settingsOpen} id="settingsGroup">
                <div id="collapse-settings" className="settingsGroup mb-2">
                
                    <ButtonGroup toggle className="mb-2">
                        {radios.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            type="radio"
                            variant="dark"
                            name="radio"
                            value={radio.value}
                            checked={this.state.radioValue === radio.value}
                            onChange={(e) => this.setRadioValue(e.currentTarget.value)}
                        >
                            {radio.name}
                        </ToggleButton>
                        ))}
                    </ButtonGroup>

                    <span>Speed</span>
                    <RangeSlider
                        value={this.state.speedSetting}
                        onChange={e => this.setSnakeSpeed(e.target.value)}
                    />

                    <ButtonGroup toggle className="mb-2">
                        <ToggleButton
                        type="checkbox"
                        variant="dark"
                        checked={this.state.isSound}
                        value="1"
                        onChange={(e) => this.soundCheckHandler(e.currentTarget.checked)}
                        >
                        Sound
                        </ToggleButton>
                    </ButtonGroup>

                    <ButtonGroup toggle className="mb-2">
                        <ToggleButton
                        type="checkbox"
                        variant="dark"
                        checked={!this.state.noWalls}
                        value="1"
                        onChange={(e) => this.wallsCheckHandler(e.currentTarget.checked)}
                        >
                        Walls
                        </ToggleButton>
                    </ButtonGroup>

                    <ButtonGroup toggle className="mb-2">
                        <ToggleButton
                        type="checkbox"
                        variant="dark"
                        checked={this.state.obstacles}
                        value="1"
                        onChange={(e) => this.obstaclesCheckHandler(e.currentTarget.checked)}
                        >
                        Obstacles
                        </ToggleButton>
                    </ButtonGroup>

                    <ButtonGroup toggle className="mb-2">
                        <ToggleButton
                        type="checkbox"
                        variant="dark"
                        checked={this.state.obstaclesDisap}
                        value="1"
                        onChange={(e) => this.obstaclesDisapCheckHandler(e.currentTarget.checked)}
                        >
                        Obstacles disappearing
                        </ToggleButton>
                    </ButtonGroup>

                    <audio className="audio-start">
                        <source src="battle.mp3"></source>
                    </audio>
                    <audio className="audio-element">
                        <source src="explosion.mp3"></source>
                    </audio>
                    <audio className="audio-button">
                        <source src="button.mp3"></source>
                    </audio>
                    <audio className="audio-eat">
                        <source src="eat.mp3"></source>
                    </audio>
                    <audio className="audio-punch">
                        <source src="punch.mp3"></source>
                    </audio>
                    <audio className="audio-bomb">
                        <source src="bomb.mp3"></source>
                    </audio>
                    <audio className="audio-food">
                        <source src="food.mp3"></source>
                    </audio>
                    <audio className="audio-lose">
                        <source src="lose.wav"></source>
                    </audio>
                </div>
            </Collapse>
        </div>
    }
}
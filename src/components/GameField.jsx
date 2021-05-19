import React from 'react';
import PropTypes from 'prop-types';

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
      foodList: [2, 11, 12, 13, 14, 15, 16, 17, 18, 19],
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
      // autoPlayIsRunning: false,
      // autoplayTimer: null,
      // autoplayInt: 100,
      FSmodeOn: false

      // autoPlayStartInt: 3000
    };
  }

  componentDidMount() {
    const { noWalls } = this.state;

    this.gameTableInit();
    document.addEventListener('keydown', this.changeDirection);
    document.getElementById('game-table').addEventListener('dblclick', this.goFullscreen);

    this.setState({ audioStart: document.getElementsByClassName('audio-start')[0] });
    this.setState({ audioExp: document.getElementsByClassName('audio-element')[0] });
    this.setState({ audioBut: document.getElementsByClassName('audio-button')[0] });
    this.setState({ audioEat: document.getElementsByClassName('audio-eat')[0] });
    this.setState({ audioPunch: document.getElementsByClassName('audio-punch')[0] });
    this.setState({ audioBomb: document.getElementsByClassName('audio-bomb')[0] });
    this.setState({ audioFood: document.getElementsByClassName('audio-food')[0] });
    this.setState({ audioLose: document.getElementsByClassName('audio-lose')[0] });

    document.getElementById('game-table').style.border = noWalls ? 'none' : '5px solid red';

    // autoplaystart
    // setTimeout(
    //   () => {
    //     this.startGame();
    //     this.setState({autoplayTimer: setInterval(this.autoplay, this.state.autoplayInt)});
    //   }
    //   , this.state.autoPlayStartInt);
  }

  goFullscreen = () => {
    const { fullscreen } = this.props;

    fullscreen();
  };

  changeDirection = (e) => {
    let { direction } = this.state;
    // eslint-disable-next-line
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        if (direction !== 'x+') {
          direction = 'x-';
        }
        break;
      case 'ArrowUp':
      case 'KeyW':
        if (direction !== 'y-') {
          direction = 'y+';
        }
        break;
      case 'ArrowRight':
      case 'KeyD':
        if (direction !== 'x-') {
          direction = 'x+';
        }
        break;
      case 'ArrowDown':
      case 'KeyS':
        if (direction !== 'y+') {
          direction = 'y-';
        }
        break;
    }
    this.setState({ direction });
  };

  gameTableInit = () => {
    const { fieldX, fieldY, snakeSpeedInit } = this.state;

    const arr = [[]];
    const arrSn = [];

    for (let y = 0; y < fieldY; y += 1) {
      arr.push([]);
      for (let x = 0; x < fieldX; x += 1) {
        arr[y].push(0);
      }
    }

    const y = Math.floor(fieldY / 2);
    const x = Math.floor(fieldX / 2);

    arr[y][x] = 1;
    arr[y][x + 1] = 1;

    arr.pop();
    this.setState({ fieldXxY: arr });
    arrSn.push(`${y}-${x}`, `${y}-${x + 1}`);
    this.setState({ snake: arrSn });
    this.setState({ snakeSpeed: snakeSpeedInit });
  };

  snakeDraw = () => {
    const { fieldXxY, snake } = this.state;

    let arr = fieldXxY.map((item) => item.map((subitem) => (subitem === 1 ? 0 : subitem)));
    arr = arr.map((item, index) =>
      item.map((subitem, i) =>
        snake.includes(`${index.toString()}-${i.toString()}`) ? 1 : subitem
      )
    );
    this.setState({ fieldXxY: arr });
  };

  playSound = (sound) => {
    const { isSound } = this.state;

    if (isSound) {
      sound.play();
    }
  };

  startGame = () => {
    const {
      autoPlayIsRunning,
      audioBut,
      audioStart,
      hiScore,
      score,
      foodTimer,
      snakeSpeed,
      obstacles,
      obstacleInt,
      obstaclesDisap,
      noObstacleInt
      // autoplayInt
    } = this.state;

    if (!autoPlayIsRunning) {
      this.playSound(audioBut);
      this.playSound(audioStart);

      this.finishTheGame();

      this.setState({ settingsOpen: false });
      this.setState({ gameIsOver: false });
      this.setState({ score: 0 });
      this.setState({ hiScore: hiScore < score ? score : hiScore });
      this.setState({ gameIsRunning: true });
      this.setState({ isPaused: true });
    }

    this.gameTableInit();
    this.setState({ direction: 'x+' });

    setTimeout(this.createFood, foodTimer);

    this.setState({ snakeTimer: setInterval(this.move, snakeSpeed) });
    if (obstacles) {
      this.setState({ obstacleTimer: setInterval(this.createObstacle, obstacleInt) });
    }
    if (obstaclesDisap) {
      this.setState({ noObstacleTimer: setInterval(this.deleteObstacle, noObstacleInt) });
    }

    // if (autoPlayIsRunning) {
    //   this.setState({ autoplayTimer: setInterval(this.autoplay, autoplayInt) });
    // }
  };

  // autoplay = () => {
  //   const { state } = this.state;
  //   // const { fieldXxY } = this.state;
  //   let food = [];
  //   const snake = [
  //     +state.snake[state.snake.length - 1].split('-')[0],
  //     +state.snake[state.snake.length - 1].split('-')[1]
  //   ];

  //   for (let y = 0; y < state.fieldY; y += 1) {
  //     for (let x = 0; x < state.fieldX; x += 1) {
  //       if (state.foodList.includes(state.fieldXxY[y][x])) {
  //         food = [];
  //         food.push(y, x);
  //       }
  //     }
  //   }
  //   // eslint-disable-next-line
  //   switch(state.direction) {
  //     case 'x+':
  //       if (food[1] <= snake[1]) {
  //         if (food[0] > snake[0]) {
  //           this.setState({ direction: 'y-' });
  //         } else {
  //           this.setState({ direction: 'y+' });
  //         }
  //       }
  //       break;
  //     case 'x-':
  //       if (food[1] >= snake[1]) {
  //         if (food[0] < snake[0]) {
  //           this.setState({ direction: 'y+' });
  //         } else {
  //           this.setState({ direction: 'y-' });
  //         }
  //       }
  //       break;
  //     case 'y+':
  //       if (food[0] >= snake[0]) {
  //         if (food[1] > snake[1]) {
  //           this.setState({ direction: 'x+' });
  //         } else {
  //           this.setState({ direction: 'x-' });
  //         }
  //       }
  //       break;
  //     case 'y-':
  //       if (food[0] <= snake[0]) {
  //         if (food[1] > snake[1]) {
  //           this.setState({ direction: 'x+' });
  //         } else {
  //           this.setState({ direction: 'x-' });
  //         }
  //       }
  //       break;
  //   }
  // };

  createFood = () => {
    const { audioFood, foodList } = this.state;

    this.playSound(audioFood);
    this.createFoodOrObstacle(foodList[Math.floor(Math.random() * foodList.length)]);
  };

  createObstacle = () => {
    const { audioBomb } = this.state;

    this.playSound(audioBomb);
    this.createFoodOrObstacle(3);
  };

  deleteObstacle = () => {
    const { obstaclesArr: obstaclesArrNew, fieldXxY: fieldXxYNew } = this.state;
    const i = Math.floor(Math.random() * obstaclesArrNew.length);

    fieldXxYNew[obstaclesArrNew[i].split('-')[0]][obstaclesArrNew[i].split('-')[1]] = 0;
    obstaclesArrNew.splice(i, 1);

    this.setState({ obstaclesArr: obstaclesArrNew });
    this.setState({ fieldXxY: fieldXxYNew });
  };

  createFoodOrObstacle = (item) => {
    const { fieldX, fieldY, fieldXxY, obstaclesArr } = this.state;
    const arr = fieldXxY;
    let foodX = 0;
    let foodY = 0;

    while (1) {
      foodX = Math.floor(Math.random() * fieldX);
      foodY = Math.floor(Math.random() * fieldY);
      if (arr[foodY][foodX] === 0) {
        arr[foodY][foodX] = item;
        break;
      }
    }
    if (item === 3) {
      this.setState({ obstaclesArr: [...obstaclesArr, `${foodY}-${foodX}`] });
    }
    this.setState({ fieldXxY: arr });
  };

  fieldNumber = (coord) => {
    const { fieldXxY } = this.state;

    const [y, x] = [...coord.split('-')];

    return fieldXxY[+y][+x];
  };

  move = () => {
    const {
      snake,
      direction,
      fieldX,
      fieldY,
      noWalls,
      audioPunch,
      foodList,
      audioEat,
      foodTimer,
      gameIsRunning,
      score,
      autoPlayIsRunning
    } = this.state;

    const head = snake[snake.length - 1].split('-');
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
    if (newx > fieldX - 1 || newx < 0 || newy > fieldY - 1 || newy < 0) {
      if (noWalls) {
        if (newx > fieldX - 1) {
          newx = 0;
        }
        if (newx < 0) {
          newx = fieldX - 1;
        }
        if (newy > fieldY - 1) {
          newy = 0;
        }
        if (newy < 0) {
          newy = fieldY - 1;
        }
      } else {
        this.playSound(audioPunch);
        this.finishTheGame();
        setTimeout(this.finAudio, 2000);
        return null;
      }
    }
    headNew = `${newy}-${newx}`;
    if (snake.includes(headNew)) {
      this.playSound(audioPunch);
      this.finishTheGame();
      setTimeout(this.finAudio, 2000);
      return null;
    }
    const arr = snake;
    arr.push(headNew);
    this.setState({ snake: arr });
    if (this.fieldNumber(headNew) === 3) {
      this.boom(headNew);
      this.finishTheGame();
      setTimeout(this.finAudio, 2000);
    } else if (foodList.includes(this.fieldNumber(headNew))) {
      this.playSound(audioEat);
      setTimeout(this.createFood, foodTimer);
      if (gameIsRunning) {
        this.setState({ score: score + 1 });
      }
    } else if (gameIsRunning || autoPlayIsRunning) {
      snake.splice(0, 1);
      this.setState({ snake });
      this.snakeDraw();
    }
  };

  boom = (boom) => {
    const { fieldXxY: fieldXxYNew, audioExp, snake, fieldX, fieldY } = this.state;

    const x = +boom.split('-')[1];
    const y = +boom.split('-')[0];
    fieldXxYNew[y][x] = 5;
    let i = 1;
    let foodX = 0;
    let foodY = 0;

    this.playSound(audioExp);

    while (i < snake.length) {
      foodX = Math.floor(Math.random() * fieldX);
      foodY = Math.floor(Math.random() * fieldY);
      if (fieldXxYNew[foodY][foodX] === 0) {
        fieldXxYNew[foodY][foodX] = 4;
      }
      i += 1;
    }
    this.setState({
      fieldXxY: fieldXxYNew.map((item) => item.map((subitem) => (subitem === 1 ? 0 : subitem)))
    });
  };

  finishTheGame = () => {
    const { fieldXxY: fieldXxYNew, snakeTimer, obstacleTimer, noObstacleTimer } = this.state;

    this.setState({
      fieldXxY: fieldXxYNew.map((item) => item.map((subitem) => (subitem === 1 ? 4 : subitem)))
    });

    this.setState({ gameIsRunning: false });
    this.setState({ gameIsOver: true });

    clearInterval(snakeTimer);
    clearInterval(obstacleTimer);
    clearInterval(noObstacleTimer);
  };

  finAudio = () => {
    const { audioLose } = this.state;

    this.playSound(audioLose);
  };

  fieldSizeChanged = (e) => {
    this.setState({ fieldX: +e.target.value.split('x')[0] });
    this.setState({ fieldY: +e.target.value.split('x')[1] });
  };

  soundCheckHandler = (e) => {
    const { isSound, audioBut } = this.state;

    if (!isSound) {
      this.playSound(audioBut);
    }
    this.setState({ isSound: e });
  };

  wallsCheckHandler = (e) => {
    const { audioBut } = this.state;

    this.playSound(audioBut);
    document.getElementById('game-table').style.border = e ? '5px solid red' : 'none';
    this.setState({ noWalls: !e });
  };

  obstaclesCheckHandler = (e) => {
    const { audioBut } = this.state;

    this.playSound(audioBut);
    this.setState({ obstacles: e });
    if (!e) {
      this.setState({ obstaclesDisap: e });
    }
  };

  obstaclesDisapCheckHandler = (e) => {
    const { audioBut } = this.state;

    this.playSound(audioBut);
    this.setState({ obstaclesDisap: e });
  };

  obstaclesDisappCheckHandler = (e) => {
    this.setState({ obstaclesDisap: !e.target.value });
  };

  setRadioValue = (e) => {
    const { audioBut } = this.state;

    this.playSound(audioBut);
    this.setState({ radioValue: e });
    this.setState({ fieldX: +e.split('x')[0] });
    this.setState({ fieldY: +e.split('x')[1] });
  };

  setSnakeSpeed = (e) => {
    const { snakeSpeedInit } = this.state;
    const s = snakeSpeedInit - ((e - 50) * snakeSpeedInit) / 100;

    this.setState({ snakeSpeed: s });
    this.setState({ speedSetting: e });
  };

  settingsOpen = () => {
    const { audioBut, settingsOpen } = this.state;

    this.playSound(audioBut);
    this.setState({ settingsOpen: !settingsOpen });
  };

  pauseGame = () => {
    const {
      audioBut,
      isPaused,
      snakeTimer,
      obstacleTimer,
      noObstacleTimer,
      snakeSpeed,
      obstacles,
      obstacleInt,
      obstaclesDisap,
      noObstacleInt
    } = this.state;

    this.playSound(audioBut);
    if (isPaused) {
      clearInterval(snakeTimer);
      clearInterval(obstacleTimer);
      clearInterval(noObstacleTimer);
    } else {
      this.setState({ snakeTimer: setInterval(this.move, snakeSpeed) });
      if (obstacles) {
        this.setState({ obstacleTimer: setInterval(this.createObstacle, obstacleInt) });
      }
      if (obstaclesDisap) {
        this.setState({ noObstacleTimer: setInterval(this.deleteObstacle, noObstacleInt) });
      }
    }

    this.setState((prevState) => ({ isPaused: !prevState.isPaused }));
  };

  // startAutoplay = () => {
  //     this.setState({autoPlayIsRunning: true});
  //     this.startGame();
  // }

  startGameClick = () => {
    // // this.setState({autoPlayIsRunning: false});
    // clearInterval(this.state.autoplayTimer);
    // this.setState((prevState) => ({ autoPlayIsRunning: !prevState.autoPlayIsRunning }));

    this.setState({ gameIsRunning: true });
    this.startGame();
  };

  render() {
    const {
      gameIsOver,
      fieldXxY,
      FSmodeOn,
      hiScore,
      score,
      gameIsRunning,
      isPaused,
      settingsOpen,
      radioValue,
      speedSetting,
      isSound,
      noWalls,
      obstacles,
      obstaclesDisap
    } = this.state;

    const radios = [
      { name: '10x10', value: '10x10' },
      { name: '15x15', value: '15x15' },
      { name: '20x20', value: '20x20' }
    ];

    return (
      <div className="game">
        <div className="snake-field">
          <table className={`game-table${gameIsOver ? '-over' : ''}`} id="game-table">
            <tbody>
              {fieldXxY.map((item, index) => (
                <tr key={`r-${index}`} className={`game-table-row row-${index}`}>
                  {item.map((subitem, i) => (
                    <td
                      key={`c-${i}`}
                      className={`game-table-cell 
                      cell-${index}-${i} 
                      game-table-cell-status-${subitem}`}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={FSmodeOn ? 'scores-white' : 'scores-black'}>
          <span>Hi-Score: {hiScore}</span>
          <br />
          <span>Score: {score}</span>
        </div>
        <div className="game-btns">
          <Button variant="outline-dark" onClick={this.startGameClick} className="mb-2">
            New Game
          </Button>
          <Button
            variant="outline-dark"
            onClick={this.pauseGame}
            className="mb-2"
            disabled={!gameIsRunning}
          >
            {!isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>

        <Button
          onClick={() => this.settingsOpen()}
          aria-controls="example-collapse-text"
          aria-expanded={settingsOpen}
          variant="outline-dark"
          className="mb-2"
        >
          Settings
        </Button>
        <Collapse in={settingsOpen} id="settingsGroup">
          <div id="collapse-settings" className="settingsGroup mb-2">
            <ButtonGroup toggle className="mb-2">
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="outline-dark"
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => this.setRadioValue(e.currentTarget.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>

            <span>Speed</span>
            <RangeSlider
              value={speedSetting}
              onChange={(e) => this.setSnakeSpeed(e.target.value)}
            />

            <ButtonGroup toggle className="mb-2">
              <ToggleButton
                type="checkbox"
                variant="outline-dark"
                checked={isSound}
                value="1"
                onChange={(e) => this.soundCheckHandler(e.currentTarget.checked)}
              >
                Sound
              </ToggleButton>
            </ButtonGroup>

            <ButtonGroup toggle className="mb-2">
              <ToggleButton
                type="checkbox"
                variant="outline-dark"
                checked={!noWalls}
                value="1"
                onChange={(e) => this.wallsCheckHandler(e.currentTarget.checked)}
              >
                Walls
              </ToggleButton>
            </ButtonGroup>

            <ButtonGroup toggle className="mb-2">
              <ToggleButton
                type="checkbox"
                variant="outline-dark"
                checked={obstacles}
                value="1"
                onChange={(e) => this.obstaclesCheckHandler(e.currentTarget.checked)}
              >
                Obstacles
              </ToggleButton>
            </ButtonGroup>

            <ButtonGroup toggle className="mb-2">
              <ToggleButton
                type="checkbox"
                variant="outline-dark"
                checked={obstaclesDisap}
                value="1"
                onChange={(e) => this.obstaclesDisapCheckHandler(e.currentTarget.checked)}
              >
                Obstacles disappearing
              </ToggleButton>
            </ButtonGroup>

            <audio className="audio-start">
              <source src="battle.mp3" />
              <track kind="captions" label="battle" />
            </audio>
            <audio className="audio-element">
              <source src="explosion.mp3" />
              <track kind="captions" label="explosion" />
            </audio>
            <audio className="audio-button">
              <source src="button.mp3" />
              <track kind="captions" label="button" />
            </audio>
            <audio className="audio-eat">
              <source src="eat.mp3" />
              <track kind="captions" label="eat" />
            </audio>
            <audio className="audio-punch">
              <source src="punch.mp3" />
              <track kind="captions" label="punch" />
            </audio>
            <audio className="audio-bomb">
              <source src="bomb.mp3" />
              <track kind="captions" label="bomb" />
            </audio>
            <audio className="audio-food">
              <source src="food.mp3" />
              <track kind="captions" label="food" />
            </audio>
            <audio className="audio-lose">
              <source src="lose.wav" />
              <track kind="captions" label="lose" />
            </audio>
          </div>
        </Collapse>
      </div>
    );
  }
}

GameField.propTypes = {
  fullscreen: PropTypes.func
};

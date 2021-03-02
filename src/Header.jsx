import React from 'react';

import './Header.css';

export default class Header extends React.Component {
    render() {
        return <div className='header'>
            <h1>Snake Game</h1>
            <span>Use the arrow keys or W/A/S/D to play</span><br></br>
            <span>Double click the game field to go fullscreen</span>
        </div>
    }
}

// logo
// title
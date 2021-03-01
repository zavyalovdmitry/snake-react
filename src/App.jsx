// import logo from './logo.svg';
// import React, { useRef, useState, useCallback } from "react";
import React from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import './App.css';

import Header from './Header.jsx';
import GameField from './GameField.jsx';
// import Interface from './Interface.jsx';
import Footer from './Footer.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const handle = useFullScreenHandle();
  // let fullScreenRef = useRef(null);
  // let [fullScreenMode, setfullScreenMode] = useState(false);

  // let fullScreenToggler = () => {
  //   setfullScreenMode(!fullScreenMode);
  // }

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Header />
        <FullScreen handle={handle} className='FS'>
          
          <GameField />
        </FullScreen>
        {/* <Interface /> */}
        <button onClick={handle.enter}>
          Enter fullscreen
        </button>
      <Footer />
    </div>
  );
}

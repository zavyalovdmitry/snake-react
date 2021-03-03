import React, {useState} from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import '../styles/App.css';

import Header from './Header.jsx';
import GameField from './GameField.jsx';
import Footer from './Footer.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const handle = useFullScreenHandle();
  const [fsMode, fsModeSet] = useState(false);

  return (
    <div className="App">
      <Header />
        <FullScreen handle={handle} className='FS'>
          <GameField fsMode={fsMode} fullscreen={handle.enter}/>
        </FullScreen>
      <Footer />
    </div>
  );
}

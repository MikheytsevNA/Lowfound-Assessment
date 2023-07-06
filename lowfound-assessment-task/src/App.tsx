import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './normalize.css';
import { Header } from './blocks/header/header';
import { Chat } from './blocks/chat/chat';
import { Login } from './blocks/login/login';

function App() {
  const [screen, setScreen] = useState('chat');

  return (
    <>
      <Header screen-state={screen} quit-function={setScreen}></Header>
      <main>{screen === 'login' ? <Login enter-function={setScreen}></Login> : <Chat></Chat>}</main>
    </>
  );
}

export default App;

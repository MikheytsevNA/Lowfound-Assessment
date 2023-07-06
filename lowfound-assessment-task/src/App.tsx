import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './normalize.css';
import { Header } from './blocks/header/header';
import { Chat } from './blocks/chat/chat';
import { Login } from './blocks/login/login';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header></Header>
      <main>
        <Login></Login>
        <Chat></Chat>
      </main>
    </>
  );
}

export default App;

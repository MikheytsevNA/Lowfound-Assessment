import { Header } from './blocks/header/header';
import { Chat } from './blocks/chat/chat';
import { Login } from './blocks/login/login';

export function App() {
  return (
    <>
      <Header screen-state="login"></Header>
      <main>
        <Login></Login>
      </main>
    </>
  );
}

export function AppChat() {
  return (
    <>
      <Header screen-state="chat"></Header>
      <main>
        <Chat></Chat>
      </main>
    </>
  );
}

import './header.css';

type ScreenProps = {
  'screen-state': string;
  'quit-function': React.Dispatch<React.SetStateAction<string>>;
};
export function Header(screenProps: ScreenProps) {
  return (
    <>
      <header className="header">
        <h2>Lowfound OpenAI API Chat</h2>
        {screenProps['screen-state'] === 'chat' ? (
          <div className="logout" onClick={() => screenProps['quit-function']('login')}>
            Logout
          </div>
        ) : (
          <></>
        )}
      </header>
    </>
  );
}

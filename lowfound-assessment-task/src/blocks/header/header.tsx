import './header.css';

type ScreenProps = {
  'screen-state': string;
};
export function Header(screenProps: ScreenProps) {
  return (
    <>
      <header className="header">
        <h2>Lowfound OpenAI API Chat</h2>
        {screenProps['screen-state'] === 'chat' ? (
          <a className="logout" href="http://localhost:8080/logout">
            Logout
          </a>
        ) : (
          <></>
        )}
      </header>
    </>
  );
}

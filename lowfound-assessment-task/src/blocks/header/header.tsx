import './header.css';
import { apiEndPoin } from '../../api';

type ScreenProps = {
  'screen-state': string;
};
export function Header(screenProps: ScreenProps) {
  return (
    <>
      <header className="header">
        <h2>Lowfound OpenAI API Chat</h2>
        {screenProps['screen-state'] === 'chat' ? (
          <a className="logout" href={`${apiEndPoin}/logout`}>
            Logout
          </a>
        ) : (
          <></>
        )}
      </header>
    </>
  );
}

import './login.css';
import LoginPicture from '../../assets/stanivanovpro_boy_and_girl_around_18_years_old_are_standing_ne_61bf74cb-a210-4014-9ebe-294de2e88b9a 1.png';

type LoginProps = { 'enter-function': React.Dispatch<React.SetStateAction<string>> };

export function Login(loginProps: LoginProps) {
  return (
    <>
      <div className="login">
        <img className="login__picture" src={LoginPicture} alt="login picture"></img>
        <div className="login__sign">
          <form className="login__sign_in sign-form" action="">
            <button
              type="submit"
              className="sign-form__button"
              onClick={() => loginProps['enter-function']('chat')}>
              Log in using Github
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

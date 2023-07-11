import './login.css';
import { apiEndPoin } from '../../api';
import LoginPicture from '../../assets/stanivanovpro_boy_and_girl_around_18_years_old_are_standing_ne_61bf74cb-a210-4014-9ebe-294de2e88b9a 1.png';

export function Login() {
  return (
    <>
      <div className="login">
        <img className="login__picture" src={LoginPicture} alt="login picture"></img>
        <div className="login__sign">
          <form className="login__sign_in sign-form" action="">
            <a type="submit" className="sign-form__button" href={`${apiEndPoin}/login`}>
              Log in using Github
            </a>
          </form>
        </div>
      </div>
    </>
  );
}

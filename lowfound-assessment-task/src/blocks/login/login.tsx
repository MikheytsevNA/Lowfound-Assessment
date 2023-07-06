import './login.css';
import LoginPicture from '../../assets/stanivanovpro_boy_and_girl_around_18_years_old_are_standing_ne_61bf74cb-a210-4014-9ebe-294de2e88b9a 1.png';

export function Login() {
  return (
    <>
      <div className="login">
        <img className="login__picture" src={LoginPicture} alt="login picture"></img>
        <div className="login__sign">
          <form className="login__sign_in sign-form" action="">
            <input type="text" className="sign-form__user" placeholder="Username" required />
            <input
              type="password"
              className="sign-form__password"
              placeholder="Password"
              required
            />
            <button type="submit" className="sign-form__button" disabled>
              Login
            </button>
          </form>
          <div className="login__sign_inter">or sign up if you don’t have an account yet</div>
          <form className="login__sign_up sign-form" action="">
            <input type="text" className="sign-form__user" placeholder="Username" required />
            <input
              type="password"
              className="sign-form__password"
              placeholder="Password"
              required
            />
            <button type="submit" className="sign-form__button" disabled>
              Sign up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

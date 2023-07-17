import './login.css';
import { apiEndPoint } from '../../api';
import LoginPicture from '../../assets/pic.png';
import React from 'react';

export function Login() {
  return (
    <>
      <div className="login">
        <img className="login__picture" src={LoginPicture} alt="login picture"></img>
        <div className="login__sign">
          <form className="login__sign_in sign-form" action="">
            <a type="submit" className="sign-form__button" href={`/login`}>
              Log in using Github
            </a>
          </form>
        </div>
      </div>
    </>
  );
}

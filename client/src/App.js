import React, {useContext, useEffect} from 'react';
import './App.css';
import LoginForm from "./components/LoginForm/LoginForm";
import {Context} from "./index";
import { observer } from 'mobx-react-lite';

const App = () => {
  const {store} = useContext(Context);

  useEffect(() => {
      if (localStorage.getItem('AccessJwt')) store.checkAuth();
      }, [])

  const clickLogOut = () => store.logout();

  const clickGetUsers = () => store.getUsers();

  if (store.isLoading) return <h1>Загрузка данных с сервера...</h1>

  if (!store.isAuth) return <LoginForm/>

  let users, isUser = false;

  if (store.users) {
    isUser = true
    users = store.users;
  }

  return (
      <div>
          {store.message === ""
              ? <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : "АВТОРИЗУЙТЕСЬ"}</h1>
              : <h1>{store.message}</h1>
          }
        <div>
          <button onClick={clickLogOut}>Выйти из аккаунта</button>
        </div>
        <div>
          <button onClick={clickGetUsers}>Получить список пользователей</button>
        </div>
        {isUser ? users.map(user => <div key={user.email}>{user.email}</div>) : null}
      </div>
  );
}

export default observer(App);
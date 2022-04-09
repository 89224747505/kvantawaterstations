import React, {useContext, useEffect} from 'react';
import './App.css';
import LoginForm from "./components/LoginForm/LoginForm";
import {Context} from "./index";
import { observer } from 'mobx-react-lite';
import SmsForm from "./components/SmsForm/SmsForm";
import Loading from "./components/Loading/Loading";
import MainComponent from "./components/MainComponent/MainComponent";

const App = () => {
  const {store} = useContext(Context);

  useEffect(() => {
      if (localStorage.getItem('AccessJwt')) store.checkAuth();
  }, [])

  if (store.isLoading && !store.isAuth) return <Loading/>
  if (store.isAuth) return <MainComponent/>
  if (!store.isSms) return <LoginForm/>
  else return <SmsForm/>
}

export default observer(App);
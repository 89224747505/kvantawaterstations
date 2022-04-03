import {makeAutoObservable} from "mobx";
import AuthService from "../services/authService";
import axios from "axios";
import {API_URL} from "../http";
import UserService from "../services/userService";

export default class Store {
    user = {};
    isAuth = false;
    isLoading = false;
    users = [];
    message = '';
    isSms = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setSms(bool) {
        this.isSms = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    setUsers(users) {
        this.users = users;
    }

    setMessage(message) {
        this.message = message;
    }

    async login(email, password, smsMessage) {
        try {
            this.setSms(false);
            this.setMessage("");
            const response = await AuthService.login(email, password, smsMessage);
            if (response.message) {
                this.setMessage(response.message);
                this.setAuth(false);
                return
            }
            if (response.status === 201) {
                this.setAuth(false);
                this.setSms(true);
                return
            }
            if (response.data.user.isActivated) {
                localStorage.setItem('AccessJwt', response.data.accessToken);
                this.setAuth(true);
                this.setUser(response.data.user);
            }else this.setMessage("Активируйте свой аккунт на почте")
        }
        catch (e) {
            console.log("Ошибка");
        }
    }

    async registration(email, password, phone) {
        try {
            const response = await AuthService.registration(email, password, phone);
            if (response.message) {
                this.setMessage(response.message);
                this.setAuth(false);
                return
            }
            this.setMessage("Активируйте свой аккунт на почте");
        }
        catch (e) {
            console.log("Ошибка");
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            if (response.message) {
                this.setMessage(response.message);
                this.setAuth(false);
                return
            }
            localStorage.removeItem('AccessJwt');
            this.setAuth(false);
            this.setUser({});
            this.setUsers([]);
            this.setMessage("");
        }
        catch (e) {
            console.log("Ошибка");
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials:true})
            if (response.message) {
                this.setMessage(response.message);
                this.setAuth(false);
                return
            }
            if (response.data.user.isActivated) {
                localStorage.setItem('AccessJwt', response.data.accessToken);
                this.setAuth(true);
                this.setUser(response.data.user);
            }else this.setMessage("Активируйте свой аккунт")
        }
        catch (e) {
            console.log("Ошибка");
        }
        finally {
            this.setLoading(false);
        }
    }

    async getUsers() {
        this.setLoading(true);
        try {
            const response = await UserService.fetchUsers();
            if (response.err === 403) {
                this.setMessage(response.message);
                return
            }
            this.setUsers(response.data);
        }
        catch (e) {
            console.log("Ошибка");
        }
        finally {
            this.setLoading(false);
        }

    }
}
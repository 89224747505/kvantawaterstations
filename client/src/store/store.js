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

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
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

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            if (response.message) {
                this.setMessage(response.message);
                this.setAuth(false);
                return
            }
            if (response.data.user.isActivated) {
                localStorage.setItem('jwt', response.data.accessToken);
                this.setAuth(true);
                this.setUser(response.data.user);
            }else this.setMessage("Активируйте свой аккунт")
        }
        catch (e) {
            console.log("Ошибка");
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password);
            if (response.message) {
                this.setMessage(response.message);
                this.setAuth(false);
                return
            }
            if (response.data.user.isActivated) {
                localStorage.setItem('jwt', response.data.accessToken);
                this.setAuth(true);
                this.setUser(response.data.user);
            }else this.setMessage("Активируйте свой аккунт");
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
            localStorage.removeItem('jwt');
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
                localStorage.setItem('jwt', response.data.accessToken);
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
            if (response.message) {
                this.setMessage(response.message);
                this.setAuth(false);
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
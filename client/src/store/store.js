import {makeAutoObservable} from "mobx";
import AuthService from "../services/authService";
import axios from "axios";
import {API_URL} from "../http";
import UserService from "../services/userService";

export default class Store {
    user;
    isAuth = false;
    isLoading = false;
    users;

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
    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response.data.accessToken);
            localStorage.setItem('jwt', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch (e) {
            console.log(e.response.data.message);
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response);
            localStorage.setItem('jwt', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch (e) {
            console.log(e.response.data.message);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            console.log(response);
            localStorage.removeItem('jwt');
            this.setAuth(false);
            this.setUser();
        }
        catch (e) {
            console.log(e.response.data.message);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials:true})
            console.log(response);
            localStorage.setItem('jwt', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }
        catch (e) {
            console.log(e.response.data.message);
        }
        finally {
            this.setLoading(false);
        }
    }

    async getUsers() {
        this.setLoading(true);
        try {
            const response = await UserService.fetchUsers();
            console.log(response.data);
            this.setUsers(response.data);
        }
        catch (e) {
            console.log(e.response.data.message);
        }
        finally {
            this.setLoading(false);
        }

    }
}
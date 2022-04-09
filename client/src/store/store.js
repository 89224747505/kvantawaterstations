import {makeAutoObservable, observable} from "mobx";
import AuthService from "../services/authService";
import axios from "axios";
import {API_URL} from "../http";
import UserService from "../services/userService";
import NodeService from "../services/nodeService";

export default class Store {
    isAdmin = false;
    isAuth = false;
    isLoading = false;
    isSms = false;

    isFormAdminProp = false;
    isFormCurrentNode = false;

    user = {};
    users = [];
    allNodes = [];

    message = '';
    candidateEmail = '';
    candidatePassword = '';
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    constructor() {
        makeAutoObservable(this);
    }

    //СЕТТЕРЫ//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    setAllNodes(nodes) {this.allNodes = nodes}
    setScreenWH(width, height) {this.screenWidth = width;this.screenHeight = height}
    setFormCurrentNode(bool) {this.isFormCurrentNode = bool;}
    setFormAdminProp(bool) {this.isFormAdminProp = bool;}
    setCandidate(email, password) {this.candidateEmail = email;this.candidatePassword = password;}
    setAuth(bool) {this.isAuth = bool;}
    setAdmin(bool) {this.isAdmin = bool;}
    setSms(bool) {this.isSms = bool;}
    setUser(user) {this.user = user;}
    setLoading(bool) {this.isLoading = bool;}
    setUsers(users) {this.users = users;}
    setMessage(message) {this.message = message;}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async getNodes () {
        try {
            return NodeService.getNodes();
        } catch (e) {
            console.log("Ошибка получения узлов", e);
        }
    }

    async addNewNode(nameNode, ipAddress, port) {
        try {
            return NodeService.addNode(nameNode,(port !== "") ? `${ipAddress}:${port}` : ipAddress)
        } catch (e){
            console.log("Ошибка добавления", e);
        }
    }

    async login(email, password, smsMessage) {
        try {
            return AuthService.login(email, password, smsMessage);
        } catch (e) {
            console.log("Ошибка логинизации", e);
        }
    }

    async registration(email, password, phone) {
        try {
            return AuthService.registration(email, password, phone);
        } catch (e) {
            console.log("Ошибка регистрации", e);
        }
    }

    async logout() {
        this.setLoading(true);
        try {
            const response = await AuthService.logout();
            if (response.message) {
                this.setMessage(response.message);
                this.setAuth(false);
                this.setAdmin(false);
                this.setLoading(false);
                return
            }
            localStorage.removeItem('AccessJwt');
            this.setAuth(false);
            this.setAdmin(false);
            this.setUser({});
            this.setUsers([]);
            this.setMessage("");
        } catch (e) {
            console.log("Ошибка выхода из аккаунта", e);
        } finally {
            this.setLoading(false);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            if (response.message) {
                this.setMessage(response.message);
                this.setAuth(false);
                this.setLoading(false);
                return
            }
            if (response.data.user.isActivated) {
                localStorage.setItem('AccessJwt', response.data.accessToken);
                this.setAuth(true);
                if (response.data.user.role === 'ADMIN') this.setAdmin(true);
                this.setUser(response.data.user);
            } else this.setMessage("Активируйте свой аккунт")
        } catch (e) {
            console.log("Ошибка поддтверждения авторизации", e);
        } finally {
            this.setLoading(false);
        }
    }

    async getUsers() {
        this.setLoading(true);
        try {
            const response = await UserService.fetchUsers();
            if (response.err === 403) {
                this.setMessage(response.message);
                this.setLoading(false);
                return
            }
            this.setUsers(response.data);
        } catch (e) {
            console.log("Ошибка получения всех пользователей", e);
        } finally {
            this.setLoading(false);
        }

    }
}
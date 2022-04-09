import $api from '../http';

export default class AuthService {

    static async login(email, password, smsMessage) { return $api.post('/login', {email, password, smsMessage}) }

    static async registration(email, password, phone) { return $api.post('/registration', {email, password, phone}) }

    static async logout() { return $api.post('/logout') }

    static async createNewProfileAdmin(email, phone, password, role, isActivated, allowFrames) {
        return $api.post('registration/admin', {email, phone, password, role, isActivated, allowFrames})}
}
import $api from '../http';

export default class UserService {
    static async fetchUsers() { return $api.get('/users') }
    static async deleteUser(id) { return $api.delete(`/user/${id}`) }
    static async updateUser(id, email, phone, password, role, isActivated, allowFrames) {
        return $api.put('/user/update', {id, email, phone, password, role, isActivated, allowFrames}) }
}
import $api from '../http';

export default class NodeService {
    static async addNode(nameNode, ipAddress) { return $api.post('/nodes/add', {nameNode, ipAddress}) }
    static async getNodes() { return $api.get('/nodes/allnodes') }
    static async deleteNode(id) { return $api.delete(`/nodes/delete/${id}`) }
}
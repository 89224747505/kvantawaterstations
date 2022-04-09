const {WaterNodes, User} = require("../models/models");
const ApiError = require("../exeptions/apiError");

class NodeService {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async addNode(nameNode, ipAddress) {
        //Ищем узел в БД с таким же ip адресом
        const candidate = await WaterNodes.findOne({where:{ipAddress}});

        //Если найден узел с таким IP адресом, то выдать ошибку добавления узла
        if (candidate) throw ApiError.BadRequest(`Узел с IP:${ipAddress} уже существует`);

        //Создаем новый узел
        const node = await WaterNodes.create({nameNode, ipAddress});

        return node;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteNode(id) {
        //Ищем узел в БД с таким же ip адресом
        const candidate = await WaterNodes.findOne({where:{id}});

        //Если не найден узел с таким id, то выдать ошибку удаления узла
        if (!candidate) throw ApiError.BadRequest(`Узел с id - ${id} не найден в БД`);

        if (candidate) {
            await candidate.destroy();
            return {status: 1, message: "Узел удален из БД"}
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async getNode(id) {
        //Ищем узел в БД с таким же ip адресом
        const candidate = await WaterNodes.findOne({where: {id}});

        //Если не найден узел с таким id, то выдать ошибку поиска узла
        if (!candidate) throw ApiError.BadRequest(`Узел с id - ${id} не найден в БД`);

        if (candidate) return {status:1, id:candidate.id, nameNode:candidate.nameNode, ipAddress:candidate.ipAddress};
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async getNodes() {
        let queryParams = {
            where: {},
            order: [ [ 'id', 'ASC' ] ]
        };
        const nodes = await WaterNodes.findAll(queryParams);

        const responseNodes = [];

        for (let item of nodes)
            responseNodes.push({
                id:item.dataValues.id,
                nameNode:item.dataValues.nameNode,
                ipAddress:item.dataValues.ipAddress
            })

        return responseNodes;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

module.exports = new NodeService();
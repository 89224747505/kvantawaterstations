const NodeService = require("../service/nodeService");

class NodeController {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async addNode(req, res, next) {
        try {
            //Дастаем данные из тела запроса
            const {nameNode, ipAddress} = req.body;

            //Добавляем новый узел водоподготовки в БД через сервис
            const nodeData = await NodeService.addNode(nameNode, ipAddress);

            //Отправляем ответ присланный из NodeService
            return res.status(200).json(nodeData);

        } catch (e) {
            //Прокидываем ошибку в милдвар ошибок
            next(e);
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteNode(req, res, next) {
        try {
            //Достаем из строки параметров /nodes/delete/:id - id и помещаем ее в константу idNode
            const idNode = req.params.id;

            //Передаем данные idNode в сервис по удалению узлов из БД
            const nodeData = await NodeService.deleteNode(idNode);

            //Отправляем ответ присланный из NodeService
            return res.status(200).json(nodeData);
        } catch (e) {
            //Прокидываем ошибку в милдвар ошибок
            next(e);
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async getNode(req, res, next) {
        try {
            //Достаем из строки параметров /nodes/:id - id и помещаем ее в константу idNode
            const idNode = req.params.id;

            //Передаем данные idNode в сервис по поиску узла из БД
            const nodeData = await NodeService.getNode(idNode);

            //Отправляем ответ присланный из NodeService
            return res.status(200).json(nodeData);
        } catch (e) {
            //Прокидываем ошибку в милдвар ошибок
            next(e);
        }
    }

    async getNodes(req, res, next) {
        try {
            //Получаем из сервиса по поиску узлов все узлы из БД
            const nodeData = await NodeService.getNodes();

            //Отправляем ответ присланный из NodeService
            return res.status(200).json(nodeData);
        } catch (e) {
            //Прокидываем ошибку в милдвар ошибок
            next(e);
        }
    }

}

module.exports = new NodeController();
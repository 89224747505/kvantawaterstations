const Router = require('express');
const router = new Router();
const UserController = require('../controllers/userController');
const NodeController = require('../controllers/nodeController');
const {body} = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


router.post('/registration',body('email').isEmail(),
    body('password').isLength({min:4, max:32}), UserController.registration);
router.post('/registration/admin', authMiddleware, roleMiddleware(["ADMIN"]), UserController.createNewProfileAdmin);
router.post('/login',  UserController.login);
router.post('/logout',authMiddleware, UserController.logout);

router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);

router.get('/users', authMiddleware, roleMiddleware(["ADMIN"]), UserController.getUsers);
router.delete('/user/:id', authMiddleware, roleMiddleware(["ADMIN"]), UserController.deleteUser);
router.post('/access',authMiddleware, roleMiddleware(["ADMIN"]), UserController.accessForUsers);
router.put('/user/update', authMiddleware, roleMiddleware(["ADMIN"]), UserController.updateUser);

router.post('/nodes/add', authMiddleware, roleMiddleware(["ADMIN"]), NodeController.addNode);
router.delete('/nodes/delete/:id', authMiddleware, roleMiddleware(["ADMIN"]), NodeController.deleteNode)
router.get('/nodes/allnodes', authMiddleware, roleMiddleware(["ADMIN"]), NodeController.getNodes);
router.get('/nodes/:id', authMiddleware, roleMiddleware(["ADMIN", "USER"]), NodeController.getNode);

module.exports = router;
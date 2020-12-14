const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");

class UserController {

    async index(req, res) {
        let users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res) {
        let id = req.params.id;
        let user = await User.findById(id);

        if(user === undefined) {
            res.status(404);
            res.json({});
        } else {
            res.json(user);
        }
    }

    async create(req, res) {

        let { email, name, password } = req.body;

        let emailExists = await User.findEmail(email);

        if(emailExists) {
            res.status(406);
            res.json({error: "Esse e-mail já está cadastrado!"});
        }

        if(email !== undefined) {
            await User.new(email, name, password);
            res.status(200);
            res.send("Request OK!");
        } else {
            res.status(400);
            res.json({error: "O e-mail é inválido!"});
        }
    }

    async edit(req, res) {

        let { id, email, name, role } = req.body;
        let result = await User.update(id, email, name, role);

        if(result !== undefined) {
            if(result.status) {
                res.status(200);
                res.send("Ok!");
            } else {
                res.status(406);
                res.send(result.error);
            }
        } else {
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res) {
        let id =  req.params.id;
        let result = await User.delete(id);

        if(result.status) {
            res.status(200);
            res.send("Ok!");
        } else {
            res.status(406);
            res.send(result.error);
        }
    }

    async recoverPassword(req, res) {
        let email = req.body.email;
        let result = await PasswordToken.create(email);
        if(result.status) {
            res.status(200);
            res.send(String(result.token));
            // console.log(result.token);
            // NodeMailer.send(token);
        } else {
            res.status(406);
            res.send(result.error);
        }
    }
}

module.exports = new UserController();
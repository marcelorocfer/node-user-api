const User = require("../models/User");

class UserController {
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
}

module.exports = new UserController();
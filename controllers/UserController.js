class UserController {

    async index(req, res) {}

    async create(req, res) {

        let { email, name, password } = req.body;

        if(email === undefined) {
            await res.status(400);
            await res.json({ error: "O e-mail é inválido!" });
        }

        await res.status(200);
        await res.send("Request OK!");
    }
}

module.exports = new UserController();
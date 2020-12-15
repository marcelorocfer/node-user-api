const knex = require("../database/connection");
const User = require("./User");

class PasswordToken {
    async create(email) {
        let user = await User.findByEmail(email);
        if(user !== undefined) {
            try {
                let token = Date.now();
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token // Recomenda-se UUID
                }).table("password_tokens");
                return { status: true, token };
            } catch(error) {
                console.log(error);
                return { status: false, error };
            }
        } else {
            return { status: false, error: "O e-mail informado não existe na base de dados!" };
        }
    }

    async validate(token) {
        try {

            let result = await knex.select().where({ token }).table("password_tokens");

            if(result.length > 0) {

                let tk = result[0];

                if(tk.used) {
                    return { status: false };
                } else {
                    return { status: true, token: tk };
                }

            } else {
                return { status: false };
            }

        } catch(error) {
            console.log(error);
            return { status: false };
        }
    }

    async setUsed(token) {
        await knex.update({ used: 1 }).where({ token }).table("password_tokens");
    }
}

module.exports = new PasswordToken();
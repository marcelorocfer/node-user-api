const knex = require("../database/connection");
const User = require("./User");

class PasswordToken {
    async create(email) {
        let user =  await User.findByEmail(email);
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
            return { status: false, error: "O e-mail informado existe na base de dados!" };
        }
    }
}

module.exports = new PasswordToken();
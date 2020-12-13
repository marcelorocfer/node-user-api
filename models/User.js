const knex = require("../database/connection");
const bcrypt = require("bcrypt");

class User {

    async new(email, name, password) {
        try {
            let hash = await bcrypt.hash(password, 10);
            await knex.insert({ email, name, password: hash, role: 0 }).table("users");
        } catch(e) {
            console.log(e);
        }
    }

    async findEmail(email) {
        try {
            let result = await knex.select("*").from("users").where({ email });
            return result.length > 0;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

}

module.exports = new User();
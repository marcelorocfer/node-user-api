const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User {

    async findAll() {
        try {
            return await knex.select(["id", "name", "email", "role"]).table("users");
        } catch(e) {
            console.log(e);
            return [];
        }
    }

    async findById(id) {
        try {
            let result = await knex.select(["id", "name", "email", "role"]).where({ id }).table("users");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(e) {
            console.log(e);
            return undefined;
        }
    }

    async findByEmail(email) {
        try {
            let result = await knex.select(["id", "name", "email", "role"]).where({ email }).table("users");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch(e) {
            console.log(e);
            return undefined;
        }
    }

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

    async update(id, email, name, role) {

        let user = await this.findById(id);

        if(user !== undefined) {

            let editUser = {};
            
            if(email !== undefined && email !== user.email) {

                let result = await this.findEmail(email);

                if(!result) {
                    editUser.email = email;
                } else {
                    return { status: false, error: "O e-mail já está cadastrado!"};
                }
            }

            if(name !== undefined) {
                editUser.name = name;
            }

            if(role !== undefined) {
                editUser.role = role;
            }

            try {

                await knex.update(editUser).where({ id }).table("users");
                return { status: true };

            } catch(error) {
                return { status: false, error };
            }

        } else {
            return { status: false, error: "O usuário não existe!"};
        }
    }

    async delete(id) {
        let user = await this.findById(id);
        if(user !== undefined) {
            try {
                await knex.delete().where({ id }).table("users");
                return { status: true };
            } catch(error) {
                return { status: false, error };
            }
        } else {
            return { status: false, error: "O usuário não existe, portanto não pode ser deletado!" };
        }
    }

    async changePassword(newPassword, id, token) {
        let hash = await bcrypt.hash(newPassword, 10);
        await knex.update({ password: hash }).where({ id }).table("users");
        await PasswordToken.setUsed(token);
    }
}

module.exports = new User();
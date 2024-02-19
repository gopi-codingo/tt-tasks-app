const bcrypt = require("bcrypt");
const db = require("../db");
const APIError = require("../errors/APIError");
const jwtAuth = require('./jwt-auth');

class User {
    constructor() {}

    async signup(payload = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                
                const exists = await db.getQueryBuilder("users")
                .where({
                "email": payload.email,
                "is_deleted": false
                })
                .count();

                if ( exists > 0 ) throw new APIError(400, "Email Id exists");

                const userPayload = {
                    name       : payload.name,
                    email      : payload.email,
                    is_deleted : false,
                };

                const user     = await db.insertDoc("users", userPayload);
                const password = await this.generateSalt(payload.password);
                
                const authPayload = {
                    user_id: user.id,
                    password,
                    is_deleted: false,
                }
                const authentication = await db.insertDoc("authentication", authPayload);

                return resolve(user);
            } catch (e) {
                return reject(e);
            }
        });
    }

    async login({email, password}) {
        return new Promise(async (resolve, reject) => {
            try {
                const lastLoginAt = (new Date()).toISOString();
                const confirmUser = await this.getUser(email);
                
                if (!confirmUser) throw new APIError(400, "User not found");

                let userValid = await bcrypt.compare(password, confirmUser.password);
                if (!userValid) throw new APIError(401, 'Incorrect password.');
                
                let update = await db.updateDoc('users', confirmUser.user_id, { "last_logged_in": lastLoginAt });

                const response = await this.loginResponse(update, confirmUser);
                console.log(response);

                return resolve(response);
            } catch (e) {
                return reject(e);
            }
        });
    }

    async checkIfEmailExists(email) {
        const count = (await db.getQueryBuilder("users").where({ "email": email }).count().first()).count
        return Number(count) > 0;
    }
    
    async generateSalt(password) {
        let salt = await bcrypt.genSalt();
        return await bcrypt.hash(password.toString(), salt);
    }

    async getUser(username) {
        const confirmUserQuery = db.getQueryBuilder('authentication as a')
            .select('a.*')
            .where({ 'users.email': username })
            .leftJoin('users', function () {
                this.on('users.id', '=', 'a.user_id')
            }).first()

        const confirmUser = await db.executeQuery(confirmUserQuery)
        console.log(confirmUser)
        return confirmUser
    }
    
    async loginResponse(user, auth) {
        return new Promise(async (resolve, reject) => {
            try {
                delete auth["password"];

                const idToken      = jwtAuth.generateToken(user, process.env.JWT_KEY);
                const accessToken  = jwtAuth.generateToken(auth, process.env.JWT_KEY);
                const refreshToken = jwtAuth.generateToken(auth, process.env.JWT_KEY)
                const response = {
                    accessToken: accessToken,
                    idToken,
                    refreshToken,
                    user: user,
                }
                resolve(response)
            } catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = User;
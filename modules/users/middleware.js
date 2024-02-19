const jwtAuth = require('./jwt-auth');
const APIError = require('../errors/APIError');
const db = require('./../db');

async function authMiddleware(req, res, next) {
    const Authorization = req.header('Authorization');
    if (Authorization) {
        try {
            const values = Authorization.split(' ');
            if (values.length === 2) {
                const method = values[0];
                const token = values[1];
                if (!(method === 'Bearer')) new APIError(401, 'Unsupported Authentication');
                const payload = await jwtAuth.verifyToken(token,process.env.JWT_KEY);
                req.auth = payload;
            }
            else next(new APIError(401, 'Invalid access token provided'));
        } catch (e) {
            next(new APIError(401, 'Invalid access token provided'));
        }
    }
    else {
        next(new APIError(401, 'Access Token required to access the route'));
    }
    next();
}

async function idMiddleware(req, res, next) {
    const ID = req.header('ID');
    if (ID) {
        try {
            const payload = await jwtAuth.verifyToken(ID, process.env.JWT_KEY);
            req.user = payload;
            process.env.lang = req.lang;
        } catch (e) {
            next(new APIError(401, 'Invalid ID token provided'));
        }
    }
    else {
        next(new APIError(401, 'ID Token required to access the route'));
    }
    next();
}

module.exports = { authMiddleware, idMiddleware };
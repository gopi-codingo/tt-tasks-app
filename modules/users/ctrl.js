const { apiFmt } = require("../services/fmt");
const APIError = require("../errors/APIError");
const UserClient = require("./user");
const { body, validationResult } = require("express-validator");

const signup = async (req, res, next) => {
    try {
        validateRequest(req);
        const user = await (new UserClient()).signup(req.body);
        return res.send(apiFmt(user, "Success"));
    } catch (e) {
        return next(e);
    }
};

const login = async (req, res, next) => {
    try {
        validateRequest(req);
        const response = await (new UserClient()).login(req.body);
        return res.send(apiFmt(response, "Success"));
    } catch (e) {
        return next(e);
    }
};

function validate(method) {
    switch (method) {
        case 'signup': {
            return [
                body('name', 'name is a required field').exists().isString(),
                body('email', 'Invalid email').exists().isEmail().custom( async (value, { req }) => {
                    if ( await (new UserClient()).checkIfEmailExists(value) ) throw new Error("Email id exists")
                    return true;
                }),
                body('password', 'password is required').exists().isString(),
                body('confirm_password').exists().custom((value, { req }) => {
                    if (value !== req.body.confirm_password) throw new Error("Password does not match");
                    return true;
                }).isString(),
            ]
        }
        case 'login': {
            return [
                body('email', 'Invalid email').exists().isEmail(),
                body('password', 'password is required').exists().isString(),
            ]
        }
        default: {
            return [];
        }
    }
}
function validateRequest(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new APIError(400, "Invalid request", errors);
    }
}

module.exports = {
    validate,
    signup,
    login,
};
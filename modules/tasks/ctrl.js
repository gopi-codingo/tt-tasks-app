const { validationResult, body, param } = require("express-validator");
const { apiFmt } = require("../services/fmt");
const TasksClient = require("./tasks");

const create = async (req, res, next) => {
    try {
        const task = await (new TasksClient()).create(req.body, req.user.id);
        return res.send(apiFmt(task, "Success"));
    } catch (e) {
        return next(e);
    }
};

const edit = async (req, res, next) => {
    try {
        const task = await (new TasksClient()).edit(req.params.taskId, req.body, req.user.id);
        return res.send(apiFmt(task, "Success"));
    } catch (e) {
        return next(e);
    }
};

const list = async (req, res, next) => {
    try {
        const list = await (new TasksClient()).list(req.user.id);
        return res.send(apiFmt(list, "Success"));
    } catch (e) {
        return next(e);
    }
};

const view = async (req, res, next) => {
    try {
        const task = await (new TasksClient()).view(req.params.taskId, req.user.id);
        return res.send(apiFmt(task, "Success"));
    } catch (e) {
        return next(e);
    }
};


function validate(method) {
    switch (method) {
        case 'create': {
            return [
                body('title', 'title is a required field').exists().isString(),
            ]
        }
        case 'edit': {
            return [
                param('taskId', 'taskId is required').exists().isInt(),
                body('title', 'title is required').exists().isString(),
                body('is_completed', 'is_completed is required').exists().isBoolean(),
            ]
        }
        case 'view': {
            return [
                param('taskId', 'taskId is required').exists().isInt(),
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
    create,
    edit,
    list,
    view,
};
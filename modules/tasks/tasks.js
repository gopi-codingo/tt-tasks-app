const APIError = require("../errors/APIError");
const db = require("../db");

class Tasks {
    constructor() {}

    async create(payload = {}, userId) {
        return  new Promise(async (resolve, reject) => {
            try {
                const taskPayload = {
                    title   : payload.title,
                    user_id : userId,
                }
                const task = await db.insertDoc("tasks", taskPayload);
        
                return resolve(task);
            } catch (e) {
                return reject(e);
            }
        });
    }

    async edit(taskId, payload = {}, userId) {
        return  new Promise(async (resolve, reject) => {
            try {
                const taskPayload = {
                    title        : payload.title,
                    is_completed : payload.is_completed,
                }
                
                const exists = await db.getQueryBuilder("tasks").where({ id: taskId, user_id: userId, is_deleted: false }).first();
                
                if (!exists) throw new APIError(400, "Task not found");

                const task = await db.updateDoc("tasks", taskId, taskPayload);
        
                return resolve(task);
            } catch (e) {
                return reject(e);
            }
        });
    }

    async list(userId) {
        return  new Promise(async (resolve, reject) => {
            try {
                const list = await db.getQueryBuilder("tasks").where({ user_id: userId, is_deleted: false });       
                return resolve(list);
            } catch (e) {
                return reject(e);
            }
        });
    }

    async view(taskId, userId) {
        return  new Promise(async (resolve, reject) => {
            try {
                const task = await db.getQueryBuilder("tasks").where({ id: taskId, user_id: userId, is_deleted: false }).first();
                
                if (!task) throw new APIError(400, "Task not found");

                return resolve(task);
            } catch (e) {
                return reject(e);
            }
        });
    }
}

module.exports = Tasks;
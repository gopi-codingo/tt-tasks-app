const knex = require("knex");
const knexfile = require("./knexfile");
const env = process.env.NODE_ENV || "development";
const configOptions = knexfile[env];
const knexDB = knex(configOptions);
const dbUtils = require("./utils");

async function insertDoc(tableName, doc) {
    const dbResponse = await knexDB(tableName)
        .insert(doc)
        .returning('*');
    return dbUtils.parseWriteResponse(dbResponse);
}

async function updateDoc(tableName, id, doc) {
    const dbResponse = await knexDB(tableName)
        .where({ id })
        .update(doc)
        .returning('*');
    return dbUtils.parseWriteResponse(dbResponse);
}

async function updateWithCondition(tableName, whereCondition, doc) {
    const dbResponse = await knexDB(tableName)
        .where(whereCondition)
        .update(doc)
        .returning('*');
    return dbUtils.parseWriteResponse(dbResponse);
}

function getQueryBuilder(tableName) {
    return knexDB(tableName);
}

async function executeQuery(queryBuilder) {
    const results = await queryBuilder;
    return results;
}

module.exports = {
    insertDoc,
    updateDoc,
    updateWithCondition,
    getQueryBuilder,
    executeQuery,
};
module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: '123456',
            database: 'tasks_app_reference'
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    }, local: {
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: '123456',
            database: 'tasks_app_reference'
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },

}

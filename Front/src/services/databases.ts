let db = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'policia',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
}

if(process.env.NODE_ENV === 'test'){
    db = {
        user: process.env.DB_USER_TEST || 'postgres',
        host: process.env.DB_HOST_TEST || 'localhost',
        database: process.env.DB_NAME_TEST || 'policia',
        password: process.env.DB_PASSWORD_TEST,
        port: parseInt(process.env.DB_PORT_TEST || '5432'),
    }
}

export default db